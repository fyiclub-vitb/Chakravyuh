const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { CITY_ORDER, DISQUALIFY_ON_WRONG, checkAnswer } = require('../config/answers');

const TOTAL_GAME_TIME = 90 * 60 * 1000; // 90 minutes in milliseconds

// Brute-force protection: a player may make only a few WRONG guesses per minute.
// In-memory, so it resets on restart and is per server instance (fine for a single-server event).
const WRONG_WINDOW_MS = 60 * 1000;
const maxWrongPerWindow = () => Number(process.env.MAX_WRONG_ATTEMPTS_PER_MINUTE) || 5;
const wrongAttempts = new Map(); // userId -> [timestamps of wrong guesses]

const recentWrong = (userId) => {
    const now = Date.now();
    const recent = (wrongAttempts.get(userId) || []).filter((t) => now - t < WRONG_WINDOW_MS);
    wrongAttempts.set(userId, recent);
    return recent;
};

const disqualify = async (user) => {
    user.isDisqualified = true;
    user.isSubmitted = true;
    user.submitAt = new Date();
    await user.save();
};

// POST /api/game/verify
// Checks a player's answer for a city ON THE SERVER. On a correct answer the
// server itself marks the city complete (and, for Delhi, stores the final
// submission). Clients can no longer mark progress without solving the puzzle.
router.post('/verify', async (req, res) => {
    try {
        const { userId, city, answers } = req.body;

        if (!userId || !city) {
            return res.status(400).json({ success: false, message: 'userId and city are required' });
        }
        if (!CITY_ORDER.includes(city)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid city name. Valid cities are: ' + CITY_ORDER.join(', ')
            });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isDisqualified) {
            return res.status(403).json({ success: false, correct: false, disqualified: true, message: 'User is disqualified' });
        }
        if (user.isSubmitted) {
            return res.status(409).json({ success: false, message: 'Final answers already submitted' });
        }

        // Server-enforced time limit
        const elapsed = Date.now() - new Date(user.timeStart).getTime();
        if (elapsed > TOTAL_GAME_TIME) {
            await disqualify(user);
            return res.status(403).json({ success: false, correct: false, disqualified: true, message: 'Time limit exceeded' });
        }

        // Server-enforced city order: only the next unsolved city can be answered
        const nextCity = CITY_ORDER.find((c) => !user.cityProgress[c]);
        if (city !== nextCity) {
            return res.status(409).json({
                success: false,
                message: nextCity ? `City not unlocked. Current city is ${nextCity}` : 'All cities already completed'
            });
        }

        if (recentWrong(userId).length >= maxWrongPerWindow()) {
            return res.status(429).json({
                success: false,
                message: 'Too many incorrect attempts. Wait a minute and try again.'
            });
        }

        const correct = checkAnswer(city, answers);

        if (!correct) {
            recentWrong(userId).push(Date.now());
            if (DISQUALIFY_ON_WRONG.includes(city)) {
                await disqualify(user);
                return res.status(200).json({ success: true, correct: false, disqualified: true });
            }
            return res.status(200).json({ success: true, correct: false, disqualified: false });
        }

        user.cityProgress[city] = true;

        // Delhi is the final city: store the submission and stop the clock
        if (city === 'Delhi') {
            user.city = String(answers.city).trim();
            user.date = String(answers.date).trim();
            user.time = String(answers.time).trim();
            user.places = String(answers.places).trim();
            user.isSubmitted = true;
            user.submitAt = new Date();
        }

        await user.save();

        return res.status(200).json({
            success: true,
            correct: true,
            disqualified: false,
            data: { userId: user.userId, cityProgress: user.cityProgress, isSubmitted: user.isSubmitted }
        });
    } catch (error) {
        console.error('Error verifying answer:', error);
        res.status(500).json({ success: false, message: 'Server error while verifying answer' });
    }
});

// POST /api/game/disqualify
// Only valid once the 90-minute limit has actually passed, so nobody can
// disqualify another player (or themselves) by calling this early.
router.post('/disqualify', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'UserId is required' });
        }
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.isSubmitted || user.isDisqualified) {
            return res.status(200).json({
                success: true,
                message: 'Already finished',
                data: { userId: user.userId, isDisqualified: user.isDisqualified }
            });
        }

        const elapsed = Date.now() - new Date(user.timeStart).getTime();
        const GRACE_MS = 5000; // tolerate small client/server clock differences
        if (elapsed < TOTAL_GAME_TIME - GRACE_MS) {
            return res.status(400).json({ success: false, message: 'Time limit has not been reached' });
        }

        await disqualify(user);
        res.status(200).json({
            success: true,
            message: 'User disqualified (time expired)',
            data: { userId: user.userId, isDisqualified: true }
        });
    } catch (error) {
        console.error('Error disqualifying user:', error);
        res.status(500).json({ success: false, message: 'Server error while disqualifying user' });
    }
});

// Get leaderboard and stats
router.get('/leaderboard', async (req, res) => {
    try {
        // Get all users for statistics
        const allUsers = await User.find({});
        const totalPlayers = allUsers.length;
        
        // Calculate active players (those who started but haven't submitted/disqualified)
        const activePlayers = allUsers.filter(user => 
            user.timeStart && !user.isSubmitted && !user.isDisqualified
        );
        
        // Get eligible players for leaderboard (submitted and not disqualified)
        const eligiblePlayers = await User.find({
            isSubmitted: true,
            isDisqualified: false
        });

        // Calculate points and time remaining for each player
        const TOTAL_GAME_TIME = 90 * 60 * 1000; // 90 minutes in milliseconds
        
        const playersWithStats = eligiblePlayers.map(user => {
            const timeTaken = new Date(user.submitAt) - new Date(user.timeStart);
            const timeTakenSeconds = Math.floor(timeTaken / 1000);
            const totalGameSeconds = 5400; // 90 minutes
            
            // Points = seconds remaining when they submitted
            const points = Math.max(0, totalGameSeconds - timeTakenSeconds);
            
            // Get cities completed count
            const citiesCompleted = Object.values(user.cityProgress).filter(Boolean).length;
            
            return {
                userId: user.userId,
                name: user.name,
                points: points,
                timeTaken: timeTakenSeconds,
                citiesCompleted: citiesCompleted,
                cityProgress: user.cityProgress,
                submitAt: user.submitAt,
                timeStart: user.timeStart
            };
        });

        // Sort by points descending
        playersWithStats.sort((a, b) => b.points - a.points);
        
        // Get top 10 for leaderboard
        const topTen = playersWithStats.slice(0, 10);
        
        // Calculate stats for active players
        const activePlayersWithTime = activePlayers.map(user => {
            const currentTime = new Date();
            const elapsedTime = currentTime - new Date(user.timeStart);
            const timeRemaining = Math.max(0, TOTAL_GAME_TIME - elapsedTime);
            const timeRemainingSeconds = Math.floor(timeRemaining / 1000);
            const citiesCompleted = Object.values(user.cityProgress).filter(Boolean).length;
            
            return {
                userId: user.userId,
                name: user.name,
                timeRemainingSeconds: timeRemainingSeconds,
                citiesCompleted: citiesCompleted,
                cityProgress: user.cityProgress
            };
        });

        res.status(200).json({
            success: true,
            data: {
                statistics: {
                    totalPlayers: totalPlayers,
                    activePlayers: activePlayers.length,
                    completedPlayers: eligiblePlayers.length,
                    disqualifiedPlayers: allUsers.filter(u => u.isDisqualified).length
                },
                leaderboard: topTen,
                activePlayers: activePlayersWithTime
            }
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching leaderboard',
            error: error.message
        });
    }
});


module.exports = router;

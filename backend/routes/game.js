const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Update city progress
router.post('/update-progress', async (req, res) => {
    try {
        const { userId, city } = req.body;

        // Validate required fields
        if (!userId || !city) {
            return res.status(400).json({
                success: false,
                message: 'UserId and city are required'
            });
        }

        // Validate city name
        const validCities = ['Mumbai', 'Bangalore', 'Pune', 'Chennai', 'Jammu', 'Delhi'];
        if (!validCities.includes(city)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid city name. Valid cities are: ' + validCities.join(', ')
            });
        }

        // Find user and update city progress
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update the specific city's progress
        user.cityProgress[city] = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Progress updated for ${city}`,
            data: {
                userId: user.userId,
                cityProgress: user.cityProgress
            }
        });

    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating progress',
            error: error.message
        });
    }
});


// Disqualify user
router.post('/disqualify', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'UserId is required'
            });
        }
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        user.isDisqualified = true;
        user.isSubmitted = true;
        user.submitAt = new Date();
        await user.save();
        res.status(200).json({
            success: true,
            message: 'User disqualified successfully',
            data: {
                userId: user.userId,
                isDisqualified: user.isDisqualified
            }
        });
    } catch (error) {
        console.error('Error disqualifying user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while disqualifying user',
            error: error.message
        });
    }
});


// Submit final answers

router.post('/submit-answers', async (req, res) => {
    try {
        const { userId, city, date, time, places } = req.body;
        if (!userId || !city || !date || !time || !places) {
            return res.status(400).json({
                success: false,
                message: 'All fields (userId, city, date, time, places) are required'
            });
        }
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        user.city = city;
        user.date = date;
        user.time = time;
        user.places = places;
        user.isSubmitted = true;
        user.submitAt = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Final answers submitted successfully',
            data: {
                userId: user.userId,
                city: user.city,
                date: user.date,
                time: user.time,
                places: user.places,
                isSubmitted: user.isSubmitted,
                submitAt: user.submitAt
            }
        });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting answers',
            error: error.message
        });
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

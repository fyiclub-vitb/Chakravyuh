const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
// Register or login user
router.post('/register', async (req, res) => {
    try {
        const { userId, name, email } = req.body;

        // Validate input
        if (!userId || !name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide userId, name, and email'
            });
        }

        // Check if user already exists
        let user = await User.findOne({ userId });

        if (user) {
            // User exists, return existing user data
            return res.status(200).json({
                success: true,
                message: 'User already exists',
                data: user
            });
        }

        // Create new user
        user = new User({
            userId,
            name,
            email,
            timeStart: new Date()
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate email error
        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered with another account'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;

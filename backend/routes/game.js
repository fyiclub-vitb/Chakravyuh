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

module.exports = router;

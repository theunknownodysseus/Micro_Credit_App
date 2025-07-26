const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register user
router.post('/register', async (req, res) => {
    try {
        const { email, mobile } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({ email, mobile });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all users (for testing)
router.get('/all', async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.json({ users, count: users.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { email, password, name } = req.body;

        // Validate required fields
        if (!email || !password || !name) {
            console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            email,
            password,
            name
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user
        await user.save();
        console.log('User registered successfully:', email);

        // Return user ID for redirection
        res.status(201).json({
            message: 'Registration successful',
            userId: user._id,
            redirect: '/chatbot.html'
        });

    } catch (err) {
        console.error('Registration error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
        });
        res.status(500).json({ 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

module.exports = router;

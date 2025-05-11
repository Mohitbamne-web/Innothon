const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Patient = require('../models/patient');

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if patient exists
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Return patient data (excluding password)
        res.json({
            message: 'Login successful',
            userId: patient._id,
            name: patient.fullName,
            email: patient.email
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 
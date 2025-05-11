const express = require('express');
const router = express.Router();
const Patient = require('../../models/patient');

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find patient by email
        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password (Note: In a real application, you should use proper password hashing)
        if (patient.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Return success with user ID
        res.json({
            message: 'Login successful',
            userId: patient._id
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 
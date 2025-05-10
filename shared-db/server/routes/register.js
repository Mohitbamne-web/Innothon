const express = require('express');
const router = express.Router();
const Patient = require('../../shared-db/models/Patient');

router.post('/', async (req, res) => {
  try {
    const {
      fullName, phone, address, state, email, password,
      bloodType, medicalHistory, financialInfo
    } = req.body;

    const newPatient = new Patient({
      fullName,
      phone,
      address,
      state,
      email,
      password, // You should hash this!
      bloodType,
      medicalHistory,
      financialInfo
    });

    await newPatient.save();
    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

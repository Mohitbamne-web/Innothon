const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // Medical history fields
    pastConditions: [{
        type: String
    }],
    allergies: [{
        type: String
    }],
    medications: [{
        name: String,
        dosage: String,
        frequency: String
    }],
    familyHistory: [{
        condition: String,
        relation: String
    }],
    // Additional fields
    dateOfBirth: Date,
    gender: String,
    bloodType: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema); 
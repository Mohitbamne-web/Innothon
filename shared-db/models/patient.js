const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  address: String,
  state: String,
  email: String,
  password: String,
  bloodType: String,
  medicalHistory: {
    chronicConditions: String,
    surgeries: String,
    allergies: String,
    medications: String
  },
  financialInfo: {
    povertyLine: String,
    employment: String,
    govScheme: String,
    income: String,
    area: String
  }
});

module.exports = mongoose.model('Patient', patientSchema);


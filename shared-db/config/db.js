const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Natanshkalbhawar3:<Natansh-1234>@mediscan.w6mkqnl.mongodb.net/?retryWrites=true&w=majority&appName=Mediscan', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to Shared MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
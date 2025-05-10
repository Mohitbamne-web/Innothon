const connectDB = require('./config/db');
const Patient = require('./models/patient');

connectDB().then(async () => {
    console.log('🔌 Connection Successful.');

  const patients = await Patient.find();
  console.log(' 📄 Sample Patients:', patients);
  process.exit();
});
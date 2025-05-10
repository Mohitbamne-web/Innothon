const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('../config/db'); // Fixed path
const registerRoute = require('./routes/register');

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

connectDB(); // connect to MongoDB

app.use('/api/register', registerRoute);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

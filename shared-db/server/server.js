const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('../shared-db/config/db'); // shared DB
const registerRoute = require('./routes/register');

const app = express();
app.use(bodyParser.json());

connectDB(); // connect to MongoDB

app.use('/api/register', registerRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

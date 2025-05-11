const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('../config/db');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const uploadRoute = require('./routes/upload');
const analysisRoute = require('./routes/analysis');
const userRoute = require('./routes/user');
const path = require('path');
const fs = require('fs');

const app = express();

// Enable CORS with specific options
app.use(cors({
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for file uploads
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Connect to database
connectDB();

// Routes
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/upload', uploadRoute);
app.use('/api', analysisRoute);
app.use('/api/user', userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Function to start server on available port
function startServer(port) {
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
        console.log(`📁 Upload directory: ${uploadsDir}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
}

// Start server on port 5001 or next available port
startServer(5001);

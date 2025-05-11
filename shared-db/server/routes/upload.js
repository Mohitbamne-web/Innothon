const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, '../../../uploads');
        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Create a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter to only allow images and PDFs
const fileFilter = (req, file, cb) => {
    console.log('Processing file:', file.originalname, file.mimetype);
    
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only image and PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Test route to check if upload route is working
router.get('/test', (req, res) => {
    res.json({ message: 'Upload route is working' });
});

// File upload route
router.post('/', upload.single('file'), async (req, res) => {
    try {
        console.log('Received upload request');
        
        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.body.userId;
        if (!userId) {
            console.log('No user ID provided');
            return res.status(400).json({ message: 'User ID is required' });
        }

        console.log('File uploaded successfully:', {
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            path: req.file.path
        });

        res.json({
            message: 'File uploaded successfully',
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                path: req.file.path
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router; 
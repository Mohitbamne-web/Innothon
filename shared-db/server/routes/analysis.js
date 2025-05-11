const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Configure multer for scan uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, '../../../uploads');
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only image and PDF files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Get user's medical history
router.get('/medical-history/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            pastConditions: user.pastConditions || [],
            allergies: user.allergies || [],
            medications: user.medications || [],
            familyHistory: user.familyHistory || []
        });
    } catch (error) {
        console.error('Error fetching medical history:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Analyze symptoms
router.post('/analyze-symptoms', async (req, res) => {
    try {
        const { symptoms, medicalHistory } = req.body;

        // Here you would typically:
        // 1. Process the symptoms using NLP
        // 2. Compare with medical history
        // 3. Use a medical knowledge base or ML model to make predictions
        // 4. Generate recommendations

        // For now, we'll return a simulated analysis
        const analysis = {
            summary: `Based on your symptoms "${symptoms}" and medical history, I've identified potential conditions that match your symptoms.`,
            potentialConditions: [
                'Common cold',
                'Seasonal allergies',
                'Mild respiratory infection'
            ],
            recommendations: [
                'Rest and stay hydrated',
                'Monitor your temperature',
                'Consider over-the-counter pain relievers if needed',
                'Schedule a follow-up if symptoms worsen'
            ],
            severity: 'low',
            confidence: 0.75
        };

        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing symptoms:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Analyze medical scan
router.post('/analyze-scan', upload.single('file'), async (req, res) => {
    console.log('Received scan analysis request');
    
    try {
        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.body.userId;
        console.log('User ID from request:', userId);
        
        if (!userId) {
            console.log('No user ID provided');
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Log the file details for debugging
        console.log('File details:', {
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            originalname: req.file.originalname
        });

        // Get user's medical history
        console.log('Fetching user medical history');
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        const medicalHistory = {
            pastConditions: user.pastConditions || [],
            allergies: user.allergies || [],
            medications: user.medications || [],
            familyHistory: user.familyHistory || []
        };
        console.log('Medical history retrieved:', medicalHistory);

        // Here you would typically:
        // 1. Process the medical image using computer vision
        // 2. Compare with medical history
        // 3. Use a medical imaging ML model to make predictions
        // 4. Generate recommendations

        // For now, we'll return a simulated analysis
        const analysis = {
            summary: 'Analysis of your medical scan shows no immediate concerns.',
            findings: [
                'Normal tissue density',
                'No visible abnormalities',
                'Clear margins'
            ],
            recommendations: [
                'Regular follow-up recommended',
                'Maintain current treatment plan',
                'Schedule next check-up in 6 months'
            ],
            confidence: 0.85,
            fileDetails: {
                filename: req.file.filename,
                size: req.file.size,
                type: req.file.mimetype
            }
        };

        console.log('Sending analysis response');
        res.json(analysis);
    } catch (error) {
        console.error('Error in scan analysis:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router; 
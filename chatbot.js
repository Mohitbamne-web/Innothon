// Chatbot responses and patterns
const responses = {
    greetings: {
        patterns: ['hello', 'hi', 'hey', 'greetings'],
        responses: [
            "Hello! How can I assist you today?",
            "Hi there! What can I help you with?",
            "Greetings! How may I help you?"
        ]
    },
    symptoms: {
        patterns: ['symptom', 'feeling', 'pain', 'ache', 'fever', 'headache', 'cough', 'cold'],
        responses: [
            "I'll help analyze your symptoms. Please describe them in detail, and I'll check them against your medical history.",
            "Let me help you understand your symptoms. Please provide more details about what you're experiencing."
        ]
    },
    about: {
        patterns: ['what is mediscan', 'tell me about mediscan', 'how does mediscan work'],
        responses: [
            "MediScan AI is an advanced medical scanning platform that uses artificial intelligence to help detect early signs of diseases. We analyze medical scans and symptoms to provide quick and accurate results.",
            "MediScan AI combines deep learning technology with medical expertise to provide accurate disease detection and analysis of medical scans and symptoms."
        ]
    },
    features: {
        patterns: ['features', 'what can you do', 'capabilities'],
        responses: [
            "MediScan AI offers several features:\n1. Early disease detection\n2. Real-time scan analysis\n3. Symptom analysis\n4. Medical history integration\n5. Secure data handling\n6. Detailed medical reports\n7. Patient dashboard access",
            "Our main features include AI-powered disease detection, instant scan analysis, symptom assessment, and secure patient data management."
        ]
    },
    registration: {
        patterns: ['how to register', 'sign up', 'create account'],
        responses: [
            "To register, click on the 'Register' button in the navigation bar and fill out the registration form with your personal and medical information.",
            "You can create an account by clicking 'Register' and completing the two-step registration process."
        ]
    },
    scan: {
        patterns: ['how to upload scan', 'upload medical scan', 'scan analysis'],
        responses: [
            "To upload a scan:\n1. Use the upload section on the right\n2. Click the upload area or drag and drop your file\n3. Select your medical scan (JPG, PNG, or PDF)\n4. Click 'Upload Scan' to process",
            "You can upload your medical scans using the upload section on the right side of the chat. We support JPG, PNG, and PDF files."
        ]
    },
    default: {
        responses: [
            "I'm not sure I understand. Could you please rephrase your question?",
            "I'm still learning. Could you try asking that in a different way?",
            "I don't have information about that yet. Please contact our support team for assistance."
        ]
    }
};

// File upload handling
let selectedFile = null;

function handleFileUpload(event) {
    console.log('File upload triggered');
    const file = event.target.files[0];
    if (!file) {
        console.log('No file selected');
        return;
    }

    console.log('File selected:', {
        name: file.name,
        type: file.type,
        size: file.size
    });

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        console.log('Invalid file type:', file.type);
        alert('Please upload a JPG, PNG, or PDF file.');
        return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        console.log('File too large:', file.size);
        alert('File size should be less than 10MB.');
        return;
    }

    selectedFile = file;
    const fileInfo = document.getElementById('file-info');
    const uploadButton = document.getElementById('upload-button');
    const imagePreview = document.getElementById('image-preview');
    const pdfPreview = document.getElementById('pdf-preview');

    // Show file info
    fileInfo.textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    console.log('File info updated in UI');

    // Show appropriate preview
    if (file.type.startsWith('image/')) {
        console.log('Processing image preview');
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            pdfPreview.style.display = 'none';
            console.log('Image preview displayed');
        };
        reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
        console.log('Processing PDF preview');
        imagePreview.style.display = 'none';
        pdfPreview.style.display = 'block';
        document.getElementById('pdf-name').textContent = file.name;
        console.log('PDF preview displayed');
    }

    // Show upload button
    uploadButton.classList.remove('hidden');
    console.log('Upload button displayed');
}

// Function to fetch user's medical history
async function fetchUserMedicalHistory() {
    const userId = localStorage.getItem('user_id');
    if (!userId) return null;

    try {
        const response = await fetch(`http://localhost:5001/api/medical-history/${userId}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error fetching medical history:', error);
        return null;
    }
}

// Function to analyze symptoms and make predictions
async function analyzeSymptoms(symptoms, medicalHistory) {
    try {
        const response = await fetch('http://localhost:5001/api/analyze-symptoms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symptoms,
                medicalHistory
            })
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to analyze symptoms');
    } catch (error) {
        console.error('Error analyzing symptoms:', error);
        return null;
    }
}

// Function to analyze medical scan
async function analyzeMedicalScan(file, medicalHistory) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('medicalHistory', JSON.stringify(medicalHistory));

    try {
        const response = await fetch('http://localhost:5001/api/analyze-scan', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to analyze scan');
    } catch (error) {
        console.error('Error analyzing scan:', error);
        return null;
    }
}

// Update the uploadFile function to include medical history
async function uploadFile() {
    console.log('Upload function called');
    
    if (!selectedFile) {
        console.log('No file selected for upload');
        alert('Please select a file first.');
        return;
    }

    const userId = localStorage.getItem('user_id');
    console.log('User ID:', userId);
    
    if (!userId) {
        console.log('No user ID found');
        alert('Please log in to upload files.');
        return;
    }

    try {
        // Show loading state
        const uploadButton = document.getElementById('upload-button');
        uploadButton.disabled = true;
        uploadButton.textContent = 'Uploading...';
        console.log('Upload button state updated');

        // Add progress message to chat
        addMessage('Uploading your medical scan...', false);
        console.log('Progress message added to chat');

        // Create FormData
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('userId', userId);
        console.log('FormData created with file and user ID');

        console.log('Sending request to server...');
        // Send file to server
        const response = await fetch('http://localhost:5001/api/analyze-scan', {
            method: 'POST',
            body: formData
        });

        console.log('Server response received:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error:', errorData);
            throw new Error(errorData.message || 'Upload failed');
        }

        const analysis = await response.json();
        console.log('Analysis received:', analysis);

        // Add analysis results to chat
        addMessage('Analysis complete! Here are the findings:', false);
        addMessage(analysis.summary, false);
        
        if (analysis.findings) {
            addMessage('Findings:', false);
            analysis.findings.forEach(finding => {
                addMessage(`- ${finding}`, false);
            });
        }
        
        if (analysis.recommendations) {
            addMessage('Recommendations:', false);
            analysis.recommendations.forEach(rec => {
                addMessage(`- ${rec}`, false);
            });
        }

        // Reset upload area
        resetUploadArea();
        console.log('Upload process completed successfully');
    } catch (error) {
        console.error('Upload error:', error);
        addMessage('Failed to analyze scan: ' + error.message, false);
        alert('Failed to analyze scan. Please try again.');
    } finally {
        // Reset button state
        const uploadButton = document.getElementById('upload-button');
        uploadButton.disabled = false;
        uploadButton.textContent = 'Upload Scan';
        console.log('Upload button reset');
    }
}

function resetUploadArea() {
    console.log('Resetting upload area');
    selectedFile = null;
    document.getElementById('file-upload').value = '';
    document.getElementById('file-info').textContent = '';
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('pdf-preview').style.display = 'none';
    document.getElementById('upload-button').classList.add('hidden');
    console.log('Upload area reset complete');
}

// Function to get a random response from an array
function getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// Function to show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    document.getElementById('chat-messages').appendChild(typingDiv);
    return typingDiv;
}

// Function to get bot response
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check each category for matching patterns
    for (const [category, data] of Object.entries(responses)) {
        if (data.patterns && data.patterns.some(pattern => message.includes(pattern))) {
            return getRandomResponse(data.responses);
        }
    }
    
    // Return default response if no pattern matches
    return getRandomResponse(responses.default.responses);
}

// Function to add a message to the chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    document.getElementById('chat-messages').appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

// Function to handle sending messages
function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, true);
        input.value = '';
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Simulate bot thinking and then respond
        setTimeout(() => {
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add bot response
            const botResponse = getBotResponse(message);
            addMessage(botResponse);
        }, 1000);
    }
}

// Function to handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Add event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for input focus
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.addEventListener('focus', function() {
            this.placeholder = '';
        });

        userInput.addEventListener('blur', function() {
            this.placeholder = 'Type your message here...';
        });
    }
}); 
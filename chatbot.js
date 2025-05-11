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
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
        alert('Please upload a JPG, PNG, or PDF file.');
        return;
    }

    if (file.size > maxSize) {
        alert('File size should be less than 10MB.');
        return;
    }

    selectedFile = file;
    document.getElementById('file-info').textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;

    const imagePreview = document.getElementById('image-preview');
    const pdfPreview = document.getElementById('pdf-preview');

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            pdfPreview.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
        imagePreview.style.display = 'none';
        pdfPreview.style.display = 'block';
        document.getElementById('pdf-name').textContent = file.name;
    }

    document.getElementById('upload-button').classList.remove('hidden');
}

// Function to upload file without requiring login
async function uploadFile() {
    if (!selectedFile) {
        alert('Please select a file first.');
        return;
    }

    const userId = localStorage.getItem('user_id') || 'guest';

    try {
        const uploadButton = document.getElementById('upload-button');
        uploadButton.disabled = true;
        uploadButton.textContent = 'Uploading...';

        addMessage('Uploading your medical scan...', false);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('userId', userId);

        const response = await fetch('http://localhost:5001/api/analyze-scan', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Upload failed');
        }

        const analysis = await response.json();
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

        resetUploadArea();
    } catch (error) {
        console.error('Upload error:', error);
        addMessage('Failed to analyze scan: ' + error.message, false);
        alert('Failed to analyze scan. Please try again.');
    } finally {
        const uploadButton = document.getElementById('upload-button');
        uploadButton.disabled = false;
        uploadButton.textContent = 'Upload Scan';
    }
}

function resetUploadArea() {
    selectedFile = null;
    document.getElementById('file-upload').value = '';
    document.getElementById('file-info').textContent = '';
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('pdf-preview').style.display = 'none';
    document.getElementById('upload-button').classList.add('hidden');
}

// Chat functions
function getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

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

function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    for (const [category, data] of Object.entries(responses)) {
        if (data.patterns && data.patterns.some(pattern => message.includes(pattern))) {
            return getRandomResponse(data.responses);
        }
    }
    return getRandomResponse(responses.default.responses);
}

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    document.getElementById('chat-messages').appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (message) {
        addMessage(message, true);
        input.value = '';
        const typingIndicator = showTypingIndicator();
        setTimeout(() => {
            typingIndicator.remove();
            const botResponse = getBotResponse(message);
            addMessage(botResponse);
        }, 1000);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

document.addEventListener('DOMContentLoaded', function() {
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

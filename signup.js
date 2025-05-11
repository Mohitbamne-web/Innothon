document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // Send login request to the server
        const response = await fetch('http://localhost:5001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store user ID in localStorage
            localStorage.setItem('user_id', data.userId);
            
            // Show success message
            alert('Login successful!');
            
            // Redirect to chatbot
            window.location.href = 'chatbot.html';
        } else {
            // Show error message
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again later.');
    }
}); 
let currentStep = 1;

function nextStep(step) {
  const goingForward = step > currentStep;
  const currentDiv = document.getElementById(`step${currentStep}`);

  if (goingForward) {
    const inputs = currentDiv.querySelectorAll("input, select");

    let allFilled = true;
    inputs.forEach(input => {
      if (input.hasAttribute("required") && !input.value.trim()) {
        allFilled = false;
      }
    });

    if (!allFilled) {
      alert("Please fill the details.");
      return; // Stop from going to the next step
    }
  }

  currentDiv.classList.add("hidden");
  document.getElementById(`step${step}`).classList.remove("hidden");
  currentStep = step;
}

document.getElementById('registrationForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Collect all form data
  const formData = new FormData(this);
  const patientData = {
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    state: formData.get('state'),
    email: formData.get('email'),
    password: formData.get('password'),
    bloodType: formData.get('bloodType'),
    medicalHistory: {
      chronicConditions: formData.get('chronicConditions'),
      surgeries: formData.get('surgeries'),
      allergies: formData.get('allergies'),
      medications: formData.get('medications')
    }
  };

  // Send registration request
  fetch('http://localhost:5001/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.userId) {
      // Store the user ID in localStorage
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', formData.get('fullName'));
      localStorage.setItem('userEmail', formData.get('email'));
      alert(data.message);
      // Redirect to chatbot on successful registration
      window.location.href = 'chatbot.html';
    } else {
      throw new Error('No user ID received from server');
    }
  })
  .catch(error => {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  });
});

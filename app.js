function analyzeScan() {
  const input = document.getElementById('scanInput');
  const resultMessage = document.getElementById('resultMessage');
  if (input.files.length === 0) {
    resultMessage.textContent = 'Please upload a scan first.';
    resultMessage.classList.remove('text-green-600');
    resultMessage.classList.add('text-red-600');
    return;
  }

  // Simulate scan analysis
  resultMessage.textContent = 'Analyzing scan...';
  resultMessage.classList.remove('text-red-600');
  resultMessage.classList.add('text-yellow-600');

  setTimeout(() => {
    resultMessage.textContent = 'No early signs of disease detected. (Simulation Result)';
    resultMessage.classList.remove('text-yellow-600');
    resultMessage.classList.add('text-green-600');
  }, 2000);
}




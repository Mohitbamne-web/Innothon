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

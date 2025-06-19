  // Form validation and submission handling
  const form = document.getElementById('ownerDetailsForm');

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    // Simple front-end validation
    const fullName = form.fullName.value.trim();
    const mobileNumber = form.mobileNumber.value.trim();
    const address = form.address.value.trim();

    // Regex for basic phone number check (digits, spaces, +, -, parentheses)
    const phoneRegex = /^[0-9\s\-\+\(\)]{7,15}$/;

    let errors = [];

    if (!fullName) {
      errors.push('Full Name is required.');
    }
    if (!mobileNumber || !phoneRegex.test(mobileNumber)) {
      errors.push('Valid Mobile Number is required.');
    }
    if (!address) {
      errors.push('Address is required.');
    }

    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    // Here you would normally handle the form data submission (e.g., API call)

    alert('Owner details saved successfully. Proceeding to next step...');

    // For demo, clear the form (or you could route to next step)
    form.reset();

    // You may want to update UI to move to the next step here
  });
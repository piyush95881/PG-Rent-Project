const form = document.getElementById('ownerDetailsForm');

document.addEventListener('DOMContentLoaded', async () => {
  // Load navbar
  const navbar = document.getElementById('navbar-container');

  // Load the navbar
  const response = await fetch('/navbar.html');
  navbar.innerHTML = await response.text();

  // Wait for DOM to update, then bind events
  initNavbarListeners();

  // Wait for navbar content to load before adding event listener
  const btnSecondary = document.querySelector('.btn-secondary');
  if (btnSecondary) {
    btnSecondary.addEventListener('click', () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        alert("You're already logged in.");
      } else {
        window.location.href = "/login";
      }
    });
  }
});

function initNavbarListeners() {
  const signupBtn = document.querySelector('.signup-btn');
  if (!signupBtn) return; // Avoid null errors

  const token = localStorage.getItem('access_token');

  if (token) {
    signupBtn.textContent = 'Logout';
    signupBtn.addEventListener('click', () => {
      localStorage.removeItem('access_token');
      window.location.reload();
    });
  } else {
    signupBtn.textContent = 'Login/Signup';
    signupBtn.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }
}
function addAnnexure() {
  const container = document.getElementById('annexureList');
  const div = document.createElement('div');
  div.classList.add('annexure-item');
  div.innerHTML = `
    <input type="text" name="annexure_name[]" placeholder="Item Name" required />
    <input type="number" name="annexure_count[]" placeholder="Item Count" required />
  `;
  container.appendChild(div);
}
form.addEventListener('submit', async function(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const annexures = [];

  const names = formData.getAll('annexure_name[]');
  const counts = formData.getAll('annexure_count[]');

  for (let i = 0; i < names.length; i++) {
    annexures.push({
      name: names[i],
      count: Number(counts[i])
    });
  }

  const data = {
    owner: {
      name: formData.get('fullName'),
      address: formData.get('address'),
      mobile: formData.get('mobileNumber')
    },
    tenant: {
      name: formData.get('tenantName'),
      address: formData.get('tenantAddress')
    },
    property: {
      address: formData.get('propertyAddress'),
      city: formData.get('city'),
      state: formData.get('state')
    },
    terms: {
      start_date: formData.get('startDate'),
      end_date: formData.get('endDate'),
      rent: formData.get('rent'),
      security_deposit: formData.get('deposit'),
      email: formData.get('email')
    },
    annexures
  };
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/agreement/generate-agreement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('PDF generation failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "rental_agreement.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
      alert("Agreement generated and downloaded!");
    } catch (err) {
      console.error(err);
      alert("Error generating agreement.");
    }
  });
let currentStep = 0;
const formSteps = document.querySelectorAll('.form-step');
const nextBtn = document.getElementById('nextStep');
const prevBtn = document.getElementById('prevStep');
const submitBtn = document.getElementById('submitBtn');

function showStep(index) {
  formSteps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });
  prevBtn.style.display = index > 0 ? 'inline-block' : 'none';
  nextBtn.style.display = index < formSteps.length - 1 ? 'inline-block' : 'none';
  submitBtn.style.display = index === formSteps.length - 1 ? 'inline-block' : 'none';
}

nextBtn.addEventListener('click', () => {
  const inputs = formSteps[currentStep].querySelectorAll('input');
  for (const input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
  }
  if (currentStep < formSteps.length - 1) currentStep++;
  showStep(currentStep);
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 0) currentStep--;
  showStep(currentStep);
});

showStep(currentStep); // Initialize first step

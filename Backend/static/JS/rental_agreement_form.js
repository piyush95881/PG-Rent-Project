const form = document.getElementById('ownerDetailsForm');

document.querySelector('.btn-secondary').addEventListener('click', () => {
    const token = localStorage.getItem('access_token');

    if (token) {
      alert("You're already logged in.");
    } else {
      window.location.href = "/login"; // Redirect to your actual login/signup page
    }
  });

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
document.addEventListener('DOMContentLoaded', function () {

    // Rent agreement form
    const rentAgreementForm = document.getElementById('rentAgreementForm');
    if (rentAgreementForm) {
        rentAgreementForm.addEventListener('submit', handleRentAgreement);
    }
});

async function handleRentAgreement(e) {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
        alert("Please login to continue.");
        window.location.href = "/login";
        return;
    }

    const form = document.getElementById('rentAgreementForm');
    const formData = new FormData(form);

    // Gather annexures
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
            address: formData.get('tenantAddress'),
            phone: formData.get('tenantPhone')
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
            email: formData.get('email'),
            duration_months: formData.get('leaseDuration'),
            additional_terms: formData.get('additionalTerms')
        },
        annexures
    };

    try {
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

        form.reset();
    } catch (err) {
        console.error(err);
        alert("Error generating agreement.");
    }
}

function addAnnexure() {
    const annexureList = document.getElementById("annexureList");
    const div = document.createElement("div");
    div.className = "annexure-item";
    div.innerHTML = `
      <input type="text" name="annexure_name[]" placeholder="Item Name" required />
      <input type="number" name="annexure_count[]" placeholder="Item Count" required />
    `;
    annexureList.appendChild(div);
}
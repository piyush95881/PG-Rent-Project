document.addEventListener('DOMContentLoaded', function () {
    // Room listing form
    const roomListingForm = document.getElementById('roomListingForm');
    if (roomListingForm) {
        roomListingForm.addEventListener('submit', handleRoomListing);
    }

    // Roommate listing form
    const roommateListingForm = document.getElementById('roommateListingForm');
    if (roommateListingForm) {
        roommateListingForm.addEventListener('submit', handleRoommateListing);
    }
});

// Listing form handling
function showListingForm(type) {
    console.log('Showing listing form for:', type);

    // Hide all forms first
    const forms = document.querySelectorAll('.listing-form');
    forms.forEach(form => form.style.display = 'none');

    // Show the selected form
    const targetForm = document.getElementById(type + 'Form');
    if (targetForm) {
        targetForm.style.display = 'block';
        targetForm.scrollIntoView({behavior: 'smooth'});
    }
}

function hideListingForm() {
    const forms = document.querySelectorAll('.listing-form');
    forms.forEach(form => form.style.display = 'none');
}

async function handleRoomListing(e) {
    e.preventDefault();
    console.log('Submitting room listing...');

    const form = e.target;
    const formData = new FormData(form);

    try {
        const res = await fetch('/api/upload/people', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            showMessage('Your room requirement has been posted successfully!', 'success');
            form.reset();
            hideListingForm();
        } else {
            const err = await res.json();
            showMessage('Error: ' + (err.message || 'Failed to submit'), 'error');
        }
    } catch (err) {
        console.error(err);
        showMessage('Submission failed.', 'error');
    }
}


async function handleRoommateListing(e) {
    e.preventDefault();
    console.log('Submitting roommate listing...');

    const form = e.target;
    const formData = new FormData(form);

    try {
        const res = await fetch('/api/upload/properties', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            showMessage('Your roommate listing has been posted successfully!', 'success');
            form.reset();
            hideListingForm();
        } else {
            const err = await res.json();
            showMessage('Error: ' + (err.message || 'Failed to submit'), 'error');
        }
    } catch (err) {
        console.error(err);
        showMessage('Submission failed.', 'error');
    }
}
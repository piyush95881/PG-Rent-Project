         // Gender selection functionality
        const genderOptions = document.querySelectorAll('.gender-option');
        let selectedGender = 'male';

        genderOptions.forEach(option => {
            option.addEventListener('click', () => {
                genderOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedGender = option.dataset.gender;
            });
        });

        // Form submission
        const form = document.getElementById('profileForm');
        const saveBtn = document.getElementById('saveBtn');
        const saveText = document.getElementById('saveText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Hide previous messages
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            
            // Show loading state
            saveBtn.disabled = true;
            saveText.textContent = 'Saving...';
            loadingSpinner.style.display = 'block';

            // Collect form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                contactNumber: document.getElementById('contactNumber').value,
                gender: selectedGender,
                address: document.getElementById('address').value,
                hobbies: document.getElementById('hobbies').value
            };

            try {
                // API call to save profile data
                const response = await fetch('/api/profile/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token') // Assuming you store auth token
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const result = await response.json();
                    successMessage.style.display = 'block';
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    console.log('Profile updated successfully:', result);
                } else {
                    throw new Error('Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                errorMessage.style.display = 'block';
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } finally {
                // Reset button state
                saveBtn.disabled = false;
                saveText.textContent = 'Save Changes';
                loadingSpinner.style.display = 'none';
            }
        });

        // Input validation and real-time feedback
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.style.borderColor = '#4CAF50';
                } else {
                    input.style.borderColor = '#e9ecef';
                }
            });
        });

        // Phone number formatting
        const phoneInput = document.getElementById('contactNumber');
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        }); 
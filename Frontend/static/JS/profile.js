document.addEventListener('DOMContentLoaded', function () {
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    loadProfileData();
    // Image upload
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
});

function loadProfileData() {
    console.log('Fetching profile data...');

    fetch('/api/user/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Profile data received:', data);

            // Split full name into first and last if possible
            const fullName = data.name || '';
            const [firstName = '', lastName = ''] = fullName.split(' ');
            document.getElementById('firstName').value = firstName;
            document.getElementById('lastName').value = lastName;

            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.contact || '';
            document.getElementById('age').value = data.age || '';
            document.getElementById('gender').value = data.gender || '';
            document.getElementById('currentCity').value = data.address || '';
            document.getElementById('bio').value = data.bio || '';
            document.getElementById('occupation').value = data.occupation || '';
            document.getElementById('company').value = data.company || '';
            document.getElementById('income').value = data.income || '';

            if (data.profile_picture) {
                document.getElementById('profileImage').src = data.profile_picture.startsWith('/')
                    ? data.profile_picture
                    : `/${data.profile_picture}`;

            }
        })
        .catch(error => {
            console.error('Error loading profile:', error);
            showMessage('Failed to load profile data.', 'error');
        });
}


function handleProfileUpdate(e) {
    e.preventDefault();
    console.log('Updating profile...');

    const formData = new FormData();
    const name = `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`.trim();
    formData.append('name', name);
    formData.append('email', document.getElementById('email').value); // optional if allowed
    formData.append('contact', document.getElementById('phone').value);
    formData.append('age', document.getElementById('age').value);
    formData.append('gender', document.getElementById('gender').value);
    formData.append('address', document.getElementById('currentCity').value);
    formData.append('bio', document.getElementById('bio').value);
    formData.append('occupation', document.getElementById('occupation').value);
    formData.append('company', document.getElementById('company').value);
    formData.append('income', document.getElementById('income').value);

    const fileInput = document.getElementById('imageUpload');
    if (fileInput && fileInput.files[0]) {
        formData.append('profile_picture', fileInput.files[0]);
    }

    fetch('/api/user/profile/update', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            console.log('Update response:', data);
            if (data.msg === 'Profile updated successfully') {
                showMessage('Profile updated successfully!', 'success');
            } else {
                showMessage(data.msg || 'Update failed.', 'error');
            }
        })
        .catch(err => {
            console.error('Error updating profile:', err);
            showMessage('Error occurred while updating profile.', 'error');
        });
}


function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        console.log('Uploading image:', file.name);

        // Create a FileReader to preview the image
        const reader = new FileReader();
        reader.onload = function (e) {
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                profileImage.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);

        showMessage('Profile picture updated successfully!', 'success');
    }
}

// Global variables and utility functions
let currentCity = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('FlatMate website loaded');
    initializeEventListeners();
    loadPageSpecificContent();
});

// Initialize event listeners
function initializeEventListeners() {
    // Search form submission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    // Rent agreement form
    const rentAgreementForm = document.getElementById('rentAgreementForm');
    if (rentAgreementForm) {
        rentAgreementForm.addEventListener('submit', handleRentAgreement);
    }

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

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Image upload
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
}

// Load page-specific content
function loadPageSpecificContent() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'search':
            loadSearchResults();
            break;
        case 'profile':
            loadProfileData();
            break;
        default:
            break;
    }
}

// Search functionality
function handleSearch(e) {
    e.preventDefault();
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    if (city) {
        searchCity(city);
    } else {
        showMessage('Please enter a city name', 'error');
    }
}

function searchCity(city) {
    console.log('Searching for city:', city);
    currentCity = city;
    // Redirect to search results page with city parameter
    window.location.href = `search?city=${encodeURIComponent(city)}`;
}

function loadSearchResults() {
    // Get city from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city') || 'Unknown City';
    
    // Update page content
    const searchCityElement = document.getElementById('searchCity');
    if (searchCityElement) {
        searchCityElement.textContent = city;
    }
    
    currentCity = city;
    console.log('Loading search results for:', city);
}

document.addEventListener('DOMContentLoaded', () => {
  const resultsContainer = document.getElementById('resultsContainer');
  const resultsTitle = document.getElementById('resultsTitle');
  const resultsList = document.getElementById('resultsList');
  const tabs = document.querySelectorAll('.tab-btn');
  const searchBtn = document.getElementById('searchBtn');

  const locationInput = document.getElementById('locationInput');
  const budgetInput = document.getElementById('budgetInput');
  const genderInput = document.getElementById('genderInput');
  const lookingInput = document.getElementById('lookingInput');

  let currentTab = 'people';
  let currentCity = ''; // default value

  function showRooms() {
    console.log('Showing rooms for:', currentCity);
    if (resultsContainer && resultsTitle && resultsList) {
      resultsTitle.textContent = `Available Rooms in ${currentCity}`;
      resultsList.innerHTML = generateRoomResults();
      resultsContainer.style.display = 'block';
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function showFlatmates() {
    console.log('Showing flatmates for:', currentCity);
    if (resultsContainer && resultsTitle && resultsList) {
      resultsTitle.textContent = `Flatmates in ${currentCity}`;
      resultsList.innerHTML = generateFlatmateResults();
      resultsContainer.style.display = 'block';
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function generateRoomResults() {
    const rooms = [
      {
        title: 'Spacious 2BHK in Downtown',
        location: 'Central Area',
        rent: '₹25,000',
        type: 'Apartment',
        amenities: ['WiFi', 'Furnished', 'Parking']
      },
      {
        title: 'Cozy Single Room',
        location: 'Tech Hub',
        rent: '₹15,000',
        type: 'Shared',
        amenities: ['WiFi', 'AC', 'Kitchen']
      },
      {
        title: 'Modern 1BHK',
        location: 'Business District',
        rent: '₹20,000',
        type: 'Studio',
        amenities: ['Furnished', 'Gym', 'WiFi']
      }
    ];

    return rooms.map(room => `
      <div class="result-item">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem; color: #1e293b;">
              ${room.title}
            </h3>
            <p style="color: #64748b; margin-bottom: 0.5rem;">
              <i class="fas fa-map-marker-alt"></i> ${room.location}, ${currentCity}
            </p>
            <p style="color: #64748b; margin-bottom: 1rem;">
              <strong>Type:</strong> ${room.type}
            </p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${room.amenities.map(amenity => `
                <span style="background: #f1f5f9; color: #64748b; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem;">
                  ${amenity}
                </span>
              `).join('')}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.5rem; font-weight: 700; color: #2563eb; margin-bottom: 1rem;">
              ${room.rent}
            </div>
            <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
              View Details
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function generateFlatmateResults() {
    const flatmates = [
      {
        name: 'Alex Kumar',
        age: 26,
        profession: 'Software Engineer',
        location: 'Tech Park Area',
        preferences: ['Non-smoker', 'Vegetarian', 'Early riser']
      },
      {
        name: 'Priya Sharma',
        age: 24,
        profession: 'Marketing Executive',
        location: 'Downtown',
        preferences: ['Pet-friendly', 'Social', 'Non-smoker']
      },
      {
        name: 'Rohit Patel',
        age: 28,
        profession: 'Data Analyst',
        location: 'Business District',
        preferences: ['Quiet', 'Vegetarian', 'Fitness enthusiast']
      }
    ];

    return flatmates.map(flatmate => `
      <div class="result-item">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="display: flex; gap: 1rem;">
            <div style="width: 60px; height: 60px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-user" style="color: #64748b; font-size: 1.5rem;"></i>
            </div>
            <div>
              <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem; color: #1e293b;">
                ${flatmate.name}, ${flatmate.age}
              </h3>
              <p style="color: #64748b; margin-bottom: 0.5rem;">
                <i class="fas fa-briefcase"></i> ${flatmate.profession}
              </p>
              <p style="color: #64748b; margin-bottom: 1rem;">
                <i class="fas fa-map-marker-alt"></i> ${flatmate.location}, ${currentCity}
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${flatmate.preferences.map(pref => `
                  <span style="background: #f1f5f9; color: #64748b; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem;">
                    ${pref}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>
          <div>
            <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
              Connect
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Tab click listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      currentTab = tab.getAttribute('data-type');
      if (currentTab === 'people') {
        showFlatmates();
      } else {
        showRooms();
      }
    });
  });

  // Search button listener
  searchBtn.addEventListener('click', () => {
    currentCity = locationInput.value.trim() || 'your city';
    if (currentTab === 'people') {
      showFlatmates();
    } else {
      showRooms();
    }
  });

  // Initial load
  currentCity = locationInput.value.trim() || 'your city';
  showFlatmates();
});


// Rent agreement form handling
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
        targetForm.scrollIntoView({ behavior: 'smooth' });
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


// Profile handling
document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);

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
            document.getElementById('profileImage').src = `/uploads/${data.profile_picture}`;
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

    const fileInput = document.getElementById('profileImageInput');
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
        reader.onload = function(e) {
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                profileImage.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
        
        showMessage('Profile picture updated successfully!', 'success');
    }
}

// Utility functions
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Insert at the top of the main content
    const mainContent = document.querySelector('.container');
    if (mainContent) {
        mainContent.insertBefore(messageDiv, mainContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/\s+/g, ''));
}

// Animation and UI helpers
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize tooltips and other UI components
function initializeUIComponents() {
    // Add any additional UI initialization here
    console.log('UI components initialized');
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Log page load
console.log('FlatMate JavaScript loaded successfully');
// Animate premium section on scroll
window.addEventListener('scroll', function () {
  const premiumImages = document.querySelector('.premium-images');
  if (premiumImages && !premiumImages.classList.contains('animate')) {
    const rect = premiumImages.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 100) {
      premiumImages.classList.add('animate');
    }
  }
});
// Scroll animation trigger
function animateOnScroll() {
    const illustrationContainer = document.querySelector('.rent-agreement-section .illustration-container');
    
    if (!illustrationContainer) return;
    
    const containerTop = illustrationContainer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    // Trigger animation when element is 70% visible
    if (containerTop < windowHeight * 0.7) {
        const document = illustrationContainer.querySelector('.document');
        const person1 = illustrationContainer.querySelector('.person1');
        const person2 = illustrationContainer.querySelector('.person2');
        const lines = illustrationContainer.querySelectorAll('.document-line');
        
        // Add animation classes
        if (document && !document.classList.contains('animate')) {
            document.classList.add('animate');
            person1.classList.add('animate');
            person2.classList.add('animate');
            lines.forEach(line => line.classList.add('animate'));
        }
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
document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.getElementById('signIn');

  if (authButton) {
    const token = localStorage.getItem('access_token');

    // Set button text based on token
    if (token) {
      authButton.textContent = 'Logout';
      authButton.classList.remove('btn-secondary');
      authButton.classList.add('btn-danger');

      // Logout logic
      authButton.addEventListener('click', () => {
        localStorage.removeItem('access_token');
        window.location.href = '/';  // or refresh: location.reload();
      });
    } else {
      authButton.textContent = 'Login';
      authButton.classList.remove('btn-danger');
      authButton.classList.add('btn-secondary');

      // Login redirect
      authButton.addEventListener('click', () => {
        window.location.href = '/login';
      });
    }
  }

  console.log("FlatMate website loaded");
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);

// Check on page load
window.addEventListener('load', animateOnScroll);
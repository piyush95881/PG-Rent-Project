document.addEventListener('DOMContentLoaded', async () => {
    const navbar = document.getElementById('navbar-container');
    const response = await fetch('/navbar.html');
  navbar.innerHTML = await response.text();
  });

function setActiveTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    console.log(`Switched to ${tab} tab`);
}

function handleSearch(event) {
    event.preventDefault();

    const location = event.target.querySelector('input[placeholder*="city"]').value;
    const budget = event.target.querySelector('input[placeholder*="Budget"]').value;

    const searchBtn = event.target.querySelector('.search-btn');
    searchBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        searchBtn.style.transform = 'scale(1)';
    }, 150);

    // Redirect to search results
    window.location.href = `/search?location=${encodeURIComponent(location)}&budget=${encodeURIComponent(budget)}`;
}

// Animate input fields
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// Background parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.body;
    const speed = scrolled * 0.5;
    parallax.style.backgroundPosition = `center ${speed}px`;
});

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// Redirect to rent agreement page
function createAgreement() {
    const button = document.querySelector('.cta-button');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        window.location.href = '/generate-form';
    }, 150);
}

// Observe illustration animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const container = entry.target;
        if (entry.isIntersecting) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(30px)';
            container.style.transition = 'all 0.6s ease';
            setTimeout(() => {
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 50);
        } else {
            container.style.opacity = '0';
            container.style.transform = 'translateY(30px)';
        }
    });
}, {
    threshold: 0.3
});

const illustration = document.querySelector('.illustration-container');
if (illustration) observer.observe(illustration);

// Hover effect on illustration
if (illustration) {
    illustration.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });

    illustration.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
}

// // Redirect for "Sign Up" button to login.html
// document.querySelector('.signup-btn').addEventListener('click', function () {
//     window.location.href = '/login';
// });

// Redirect city cards to search URL
function navigateToCity(city) {
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
    window.location.href = `/search?location=${encodeURIComponent(formattedCity)}&budget=15000`;
}
document.addEventListener('DOMContentLoaded', async () => {
  const navbar = document.getElementById('navbar-container');
  const response = await fetch('/navbar.html');
  navbar.innerHTML = await response.text();

  // Now attach event listener AFTER navbar is loaded
  const signupBtn = document.querySelector('.signup-btn');

  if (signupBtn) {
    const token = localStorage.getItem('access_token');

    if (token) {
      signupBtn.textContent = 'Logout';
      signupBtn.addEventListener('click', (e) => {
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
});


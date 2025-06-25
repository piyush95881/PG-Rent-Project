document.addEventListener('DOMContentLoaded', () => {
    console.log('FlatMate website loaded');

    const authButton = document.getElementById('signIn');

    if (authButton) {
        const token = localStorage.getItem('access_token');

        if (token) {
            authButton.textContent = 'Logout';
            authButton.classList.replace('btn-secondary', 'btn-danger');
            authButton.addEventListener('click', () => {
                localStorage.removeItem('access_token');
                window.location.href = '/';
            });
        } else {
            authButton.textContent = 'Login';
            authButton.classList.replace('btn-danger', 'btn-secondary');
            authButton.addEventListener('click', () => {
                window.location.href = '/login';
            });
        }
    }
});

// Utility function
function showMessage(message, type = 'success') {
    // Remove existing alerts
    const oldAlert = document.getElementById('custom-alert');
    if (oldAlert) oldAlert.remove();

    // Create alert box
    const alertDiv = document.createElement('div');
    alertDiv.id = 'custom-alert';
    alertDiv.textContent = message;

    // Basic styles
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '12px 20px';
    alertDiv.style.zIndex = '1000';
    alertDiv.style.color = '#fff';
    alertDiv.style.borderRadius = '8px';
    alertDiv.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    alertDiv.style.fontSize = '14px';
    alertDiv.style.transition = 'opacity 0.3s ease';

    if (type === 'success') {
        alertDiv.style.backgroundColor = '#28a745'; // Green
    } else {
        alertDiv.style.backgroundColor = '#dc3545'; // Red
    }

    document.body.appendChild(alertDiv);

    // Remove after 1.5 seconds
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300); // wait for fade-out transition
    }, 1500);

    console.log(`${type.toUpperCase()}: ${message}`);
}

// Error Handling
window.addEventListener('error', function (e) {
    console.error('JavaScript error:', e.error);
});

// Scroll-based animations
function handleScrollAnimations() {
    // Premium section animation
    const premiumImages = document.querySelector('.premium-images');
    if (premiumImages && !premiumImages.classList.contains('animate')) {
        const rect = premiumImages.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 100) {
            premiumImages.classList.add('animate');
        }
    }

    // Rent-agreement animation
    const illustrationContainer = document.querySelector('.rent-agreement-section .illustration-container');
    if (illustrationContainer) {
        const containerTop = illustrationContainer.getBoundingClientRect().top;
        if (containerTop < window.innerHeight * 0.7) {
            const docElement = illustrationContainer.querySelector('.document');
            const person1 = illustrationContainer.querySelector('.person1');
            const person2 = illustrationContainer.querySelector('.person2');
            const lines = illustrationContainer.querySelectorAll('.document-line');

            if (docElement && !docElement.classList.contains('animate')) {
                docElement.classList.add('animate');
                person1?.classList.add('animate');
                person2?.classList.add('animate');
                lines.forEach(line => line.classList.add('animate'));
            }
        }
    }
}

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

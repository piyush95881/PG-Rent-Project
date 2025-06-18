document.addEventListener('DOMContentLoaded', async () => {
    const navbar = document.getElementById('navbar-container');

  // Load the navbar
  const response = await fetch('/navbar.html');
  navbar.innerHTML = await response.text();

  // Wait for DOM to update, then bind events
  initNavbarListeners();
  });

const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const type = params.get("type");

    fetch(`/api/details?id=${id}&type=${type}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          document.querySelector('.info-section').innerText = data.error;
          return;
        }

        document.getElementById("name").innerText = data.name || "Unknown";
        document.getElementById("city").innerText = `City: ${data.city || 'N/A'}`;
        document.getElementById("gender").innerText = data.gender ? `Gender: ${data.gender}` : '';
        document.getElementById("looking_for").innerText = data.looking_for ? `Looking for: ${data.looking_for}` : '';
        document.getElementById("description").innerText = data.description || '';

        // Contact
        const contactBtn = document.getElementById("contact");
        if (data.contact) {
          contactBtn.onclick = () => window.open(`tel:${data.contact}`, '_self');
        } else {
          contactBtn.style.display = 'none';
        }

        // Preferences
        if (data.preferences) {
          const prefDiv = document.getElementById("preferences");
          for (const [key, val] of Object.entries(data.preferences)) {
            const span = document.createElement("span");
            span.className = "feature";
            span.textContent = `${key}: ${val}`;
            prefDiv.appendChild(span);
          }
        }

        // Hobbies / Amenities
        const featureList = document.getElementById("hobbies");
        const featureData = data.hobbies || data.amenities || [];
        featureData.forEach(item => {
          const span = document.createElement("span");
          span.className = "feature";
          span.textContent = item;
          featureList.appendChild(span);
        });

        // Pricing (for property)
        if (data.rent) {
          const newPrice = document.getElementById("new-price");
          newPrice.innerHTML = Object.entries(data.rent)
            .map(([type, price]) => `${type}: ₹${price}`).join("<br>");
        }

        if (data.security_amount) {
          document.getElementById("old-price").innerText = `Security: ₹${data.security_amount}`;
        }

        if (data.electricity_rate) {
          document.getElementById("badge").innerText = `₹${data.electricity_rate}/unit`;
        }

        // Images
        const imgSection = document.getElementById("image-section");
        const images = data.pictures || [];
        if (images.length > 0) {
          imgSection.innerHTML = `<img src="${images[0]}" alt="Preview Image">`;
        }
      })
      .catch(err => {
        document.querySelector('.info-section').innerText = "Failed to load data.";
        console.error(err);
      });

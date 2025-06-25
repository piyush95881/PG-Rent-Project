document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const type = params.get("type");

    fetch(`/api/details?id=${id}&type=${type}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                document.querySelector('.right-section').innerText = data.error;
                return;
            }

            document.getElementById("name").innerText = data.name || "Unknown";
            document.querySelector("#location span").innerText = data.city || "Unknown City";

            // Image
            let imgUrl = '';

            if (type === 'people') {
                const firstName = data.name?.split(' ')[0] || 'User';
                const picPath = data.profile_picture?.replace(/^uploads\//, '');

                imgUrl = data.profile_picture
                    ? `/uploads/${picPath}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=random&bold=true`;

            } else {
                const picPath = data.pictures?.[0]?.replace(/^uploads\//, '');

                imgUrl = data.pictures?.[0]
                    ? `/uploads/${picPath}`
                    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
            }


            document.getElementById("image-section").innerHTML = `<img src="${imgUrl}" alt="Preview Image">`;

            // Basic Info
            const basicInfo = document.getElementById("basic-info");
            basicInfo.innerHTML = `
                ${data.gender ? `<span>Gender: ${data.gender}</span>` : ''}
                ${type === 'people' && data.looking_for ? `<span>Looking for: ${data.looking_for}</span>` : ''}
                ${type === 'properties' && data.rent?.single ? `<span>Single Rent: ₹${data.rent.single}</span>` : ''}
                ${data.security_amount ? `<span>Deposit: ₹${data.security_amount}</span>` : ''}
                ${data.electricity_rate ? `<span>Electricity: ₹${data.electricity_rate}/unit</span>` : ''}
            `;

            // Features (Hobbies / Amenities)
            const features = document.getElementById("features");
            const list = type === 'people'
                ? [...(data.hobbies || []), ...Object.values(data.preferences || {})].filter(Boolean)
                : (data.amenities || []);
            features.innerHTML = list.map(f => `<span class="feature">${f}</span>`).join('');

            // Highlights (dummy example)
            const highlights = document.getElementById("highlights");
            if (type === 'people') {
                highlights.innerHTML = `<span class="feature">✔️ Working full time</span>`;
            }

            // Description
            document.getElementById("description").innerText = data.description || "No description provided.";

            // Contact
            const contactBtn = document.getElementById("contact");
            if (data.contact) {
                contactBtn.onclick = () => window.open(`tel:${data.contact}`, '_self');
            } else {
                contactBtn.style.display = 'none';
            }

        })
        .catch(err => {
            console.error(err);
            document.querySelector('.right-section').innerText = "Failed to load data.";
        });
});

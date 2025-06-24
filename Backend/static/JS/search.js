document.addEventListener('DOMContentLoaded', function () {
    let currentTab = 'people';
    let currentPage = 1;

    const locationInput = document.getElementById('locationInput');
    const budgetInput = document.getElementById('budgetInput');
    const genderInput = document.getElementById('genderInput');
    const lookingInput = document.getElementById('lookingInput');

    const searchForm = document.getElementById('searchForm');
    const searchBtn = document.getElementById('searchBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const paginationContainer = document.getElementById('paginationContainer');
    const tabs = document.querySelectorAll('.tab-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const prefilledCity = urlParams.get('city');
    if (prefilledCity && locationInput) {
        locationInput.value = prefilledCity;
        loadData(currentTab, currentPage);
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            currentPage = 1;
            loadData(currentTab, currentPage);
        });
    }

    async function loadData(type, page = 1) {
        resultsContainer.innerHTML = 'Loading...';

        const endpoint = type === 'people'
            ? '/api/search/people'
            : '/api/search/properties';

        const queryParams = new URLSearchParams();
        if (locationInput.value) queryParams.append('city', locationInput.value);
        if (type === 'people' && lookingInput.value) queryParams.append('looking_for', lookingInput.value);
        if (type === 'people' && genderInput.value) queryParams.append('gender', genderInput.value);
        if (type === 'properties' && budgetInput.value) queryParams.append('max_rent', budgetInput.value);

        queryParams.append('limit', 10);
        queryParams.append('page', page);

        try {
            const response = await fetch(`${endpoint}?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const items = data.results || [];

            renderCards(items, type);
            renderPagination(data.pages || 1, page, type);  // Pass total pages and current page
        } catch (err) {
            console.error('Error loading data:', err);
            resultsContainer.innerHTML = '<p style="color:red;">Failed to load results.</p>';
        }
    }


    function parseSafeJSON(jsonStr) {
        try {
            return JSON.parse(jsonStr);
        } catch {
            return [];
        }
    }

    function renderCards(items, type) {
        resultsContainer.innerHTML = '';
        if (!items.length) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card-wrapper';

            const itemId = item.id || item._id || Math.random().toString(36).substr(2, 9);
            const firstName = item.name?.split(' ')[0] || 'User';

            const imgUrl = type === 'people'
                ? (item.profile_picture
                    ? `/uploads/${item.profile_picture}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=random&bold=true`)
                : (item.pictures?.[0]
                    ? `/uploads/${item.pictures[0]}`
                    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80');

            const title = item.name || (type === 'properties' ? 'Property' : 'User');
            const subtitle = type === 'people'
                ? `${item.gender || ''} | Looking for: ${item.looking_for || ''}`
                : item.city || 'Unknown City';
            const description = item.description || 'No description provided.';

            const hobbies = Array.isArray(item.hobbies)
                ? item.hobbies
                : parseSafeJSON(item.hobbies);

            const preferences = typeof item.preferences === 'object'
                ? Object.values(item.preferences).filter(Boolean)
                : [];

            const features = type === 'people'
                ? [...hobbies, ...preferences, item.age ? `Age: ${item.age}` : null].filter(Boolean)
                : item.amenities?.slice(0, 3) || [];

            const priceOld = type === 'properties'
                ? `<span class="old">₹${item.rent?.double || item.rent?.single || '0'}</span>` : '';
            const priceNew = type === 'properties'
                ? `<span class="new">₹${item.rent?.single || '0'}</span>` : '';

            div.innerHTML = `
                <div class="card" data-id="${itemId}" data-type="${type}">
                  <div class="badge">${type === 'people' ? 'New Profile' : 'Hot Listing'}</div>
                  <div class="tilt"><div class="img"><img src="${imgUrl}" alt="${title}"></div></div>
                  <div class="info">
                    <div class="cat">${subtitle}</div>
                    <h2 class="title">${title}</h2>
                    <p class="desc">${description}</p>
                    <div class="feats">${features.map(f => `<span class="feat">${f}</span>`).join('')}</div>
                    ${type === 'properties' ? `
                      <div class="bottom">
                        <div class="price">${priceOld}${priceNew}</div>
                        <button class="btn"><span>Contact Owner</span></button>
                      </div>` : ''}
                    <div class="meta">
                      <div class="rating">${'★'.repeat(5)} <span class="rcount">${type === 'people' ? 'Verified' : '245 Reviews'}</span></div>
                      <div class="stock">${type === 'people' ? 'Available to Connect' : 'In Stock'}</div>
                    </div>
                  </div>
                </div>
            `;

            resultsContainer.appendChild(div);

            div.querySelector('.card').addEventListener('click', (e) => {
                if (e.target.closest('.btn')) return;
                window.location.href = `details?id=${itemId}&type=${type}`;
            });
        });
    }

    function renderPagination(totalPages, currentPage, type) {
        const paginationContainer = document.getElementById('paginationContainer');
        paginationContainer.innerHTML = ''; // Clear old buttons

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.disabled = i === currentPage;
            btn.addEventListener('click', () => {
                loadData(type, i);
            });
            paginationContainer.appendChild(btn);
        }
    }


    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.getAttribute('data-type');
            currentPage = 1;
            loadData(currentTab, currentPage);
        });
    });

    searchBtn.addEventListener('click', () => {
        currentPage = 1;
        loadData(currentTab, currentPage);
    });

    currentPage = 1;
    loadData(currentTab, currentPage);
});

function searchCity(cityName) {
    window.location.href = `/search?city=${encodeURIComponent(cityName)}`;
}

document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from reloading the page

    const cityInput = document.getElementById('cityInput').value.trim();
    if (cityInput) {
        searchCity(cityInput); // Call your existing function
    }
});
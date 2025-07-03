document.addEventListener('DOMContentLoaded', function () {
    let currentTab = 'people';
    let currentPage = 1;

    const locationInput = document.getElementById('locationInput');
    const budgetInput = document.getElementById('budgetInput');
    const genderInput = document.getElementById('genderInput');
    const lookingInput = document.getElementById('lookingInput');
    const searchTypeSelect = document.getElementById('searchTypeSelect');

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
            currentTab = searchTypeSelect.value || 'people';
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

        if (locationInput.value.trim()) {
            queryParams.append('city', locationInput.value.trim());
        }

        if (type === 'people') {
            if (lookingInput.value && lookingInput.value !== '') {
                queryParams.append('looking_for', lookingInput.value);
            }
            if (genderInput.value && genderInput.value !== '') {
                queryParams.append('gender', genderInput.value);
            }
        }

        if (type === 'properties') {
            if (budgetInput.value.trim()) {
                queryParams.append('max_rent', budgetInput.value.trim());
            }
        }

        queryParams.append('limit', 10);
        queryParams.append('page', page);

        try {
            const response = await fetch(`${endpoint}?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const items = data.results || [];

            renderCards(items, type);
            renderPagination(data.pages || 1, page, type);
        } catch (err) {
            console.error('Error loading data:', err);
            resultsContainer.innerHTML = '<p style="color:red;">Failed to load results.</p>';
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
            const name = item.name || 'Unnamed';
            const city = item.city || 'Unknown City';

            let imgUrl = '';
            let cardContent = '';

            if (type === 'people') {
                const firstName = name.split(' ')[0] || 'User';
                const picPath = item.profile_picture?.replace(/^uploads\//, '');
                imgUrl = item.profile_picture
                    ? `/uploads/${picPath}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=random&bold=true`;

                const lookingFor = item.looking_for || 'Roommate';
                const budget = item.budget || 'N/A';

                cardContent = `
                    <div class="card" data-id="${itemId}" data-type="people">
                        <div class="img"><img src="${imgUrl}" alt="${name}"></div>
                        <div class="info">
                            <h3>${name}</h3>
                            <p><i class="fas fa-map-marker-alt"></i> ${city}</p>
                            <p><strong>Looking For:</strong> ${lookingFor}</p>
                            <p><strong>Budget:</strong> ₹${budget}</p>
                            <a href="details?id=${itemId}&type=people" class="btn">More Details</a>
                        </div>
                    </div>
                `;
            } else if (type === 'properties') {
                const picPath = item.pictures?.[0]?.replace(/^uploads\//, '');
                imgUrl = item.pictures?.[0]
                    ? `/uploads/${picPath}`
                    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';

                const genderPref = item.gender_preference || 'Any';
                const rent = item.rent?.single || 'N/A';

                cardContent = `
                    <div class="card" data-id="${itemId}" data-type="properties">
                        <div class="img"><img src="${imgUrl}" alt="${name}"></div>
                        <div class="info">
                            <h3>${name}</h3>
                            <p><i class="fas fa-map-marker-alt"></i> ${city}</p>
                            <p><strong>PG For:</strong> ${genderPref}</p>
                            <p><strong>Rent:</strong> ₹${rent}</p>
                            <a href="details?id=${itemId}&type=properties" class="btn">More Details</a>
                        </div>
                    </div>
                `;
            }

            div.innerHTML = cardContent;
            resultsContainer.appendChild(div);
        });
    }

    function renderPagination(totalPages, currentPage, type) {
        paginationContainer.innerHTML = '';

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
        currentTab = searchTypeSelect.value || 'people';
        currentPage = 1;
        loadData(currentTab, currentPage);
    });

    // Clear filters function
    window.clearFilters = function () {
        locationInput.value = '';
        budgetInput.value = '';
        genderInput.selectedIndex = 0;
        lookingInput.selectedIndex = 0;
        searchTypeSelect.selectedIndex = 0;
        currentPage = 1;
        loadData(currentTab, currentPage);
    };

    currentPage = 1;
    loadData(currentTab, currentPage);
});

document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from reloading the page

    const cityInput = document.getElementById('cityInput').value.trim();
    if (cityInput) {
        searchCity(cityInput); // Call your existing function
    }
});

function searchCity(cityName) {
    window.location.href = `/search?city=${encodeURIComponent(cityName)}`;
}
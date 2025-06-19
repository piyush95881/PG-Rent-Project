document.addEventListener('DOMContentLoaded', async() => {

    const navbar = document.getElementById('navbar-container');

  // Load the navbar
  const response = await fetch('/navbar.html');
  navbar.innerHTML = await response.text();

  // Wait for DOM to update, then bind events
  initNavbarListeners();


  const resultsContainer = document.getElementById('resultsContainer');
  const tabs = document.querySelectorAll('.tab-btn');
  const searchBtn = document.getElementById('searchBtn');

  // Filters
  const locationInput = document.getElementById('locationInput');
  const budgetInput = document.getElementById('budgetInput');
  const genderInput = document.getElementById('genderInput');
  const lookingInput = document.getElementById('lookingInput');

  let currentTab = 'people';

  async function loadData(type) {
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

    try {
      const response = await fetch(`${endpoint}?${queryParams.toString()}`);
      const data = await response.json();

      const items = data.results || [];
      renderCards(items, type);
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

    // Unique ID for navigation
    const itemId = item.id || item._id || Math.random().toString(36).substr(2, 9);

    const firstName = item.name?.split(' ')[0] || 'User';

const imgUrl = type === 'people'
  ? `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=random&bold=true`
  : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';




    const title = type === 'people' ? item.name : item.name || 'Property';
    const subtitle = type === 'people'
      ? `${item.gender || ''} | Looking for: ${item.looking_for || ''}`
      : item.city || 'Unknown City';
    const description = type === 'people'
      ? item.description || 'No description provided.'
      : item.amenities?.join(', ') || 'No amenities listed.';
    const priceOld = type === 'people'
      ? ''
      : `<span class="old">₹${item.rent?.double || item.rent?.single || '0'}</span>`;
    const priceNew = type === 'people'
      ? ''
      : `<span class="new">₹${item.rent?.single || '0'}</span>`;
    const features = type === 'people'
  ? [
      ...(Array.isArray(item.hobbies) ? item.hobbies : []),
      ...(Array.isArray(item.preferences) ? item.preferences : []),
      item.age ? `Age: ${item.age}` : null
    ].filter(Boolean)
  : item.amenities?.slice(0, 3) || [];


    div.innerHTML = `
      <div class="card" data-id="${itemId}" data-type="${type}">
        <div class="badge">${type === 'people' ? 'New Profile' : 'Hot Listing'}</div>
        <div class="tilt">
          <div class="img"><img src="${imgUrl}" alt="${title}"></div>
        </div>
        <div class="info">
          <div class="cat">${subtitle}</div>
          <h2 class="title">${title}</h2>
          <p class="desc">${description}</p>
          <div class="feats">
            ${features.map(f => `<span class="feat">${f}</span>`).join('')}
          </div>
          ${type === 'properties' ? `
            <div class="bottom">
              <div class="price">
                ${priceOld}
                ${priceNew}
              </div>
              <button class="btn">
                <span>Contact Owner</span>
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </button>
            </div>
          ` : ''}
          <div class="meta">
            <div class="rating">
              ${'<svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'.repeat(5)}
              <span class="rcount">${type === 'people' ? 'Verified' : '245 Reviews'}</span>
            </div>
            <div class="stock">${type === 'people' ? 'Available to Connect' : 'In Stock'}</div>
          </div>
        </div>
      </div>
    `;

    // Append to results
    resultsContainer.appendChild(div);

    // Attach click event to navigate to detail page
    div.querySelector('.card').addEventListener('click', (e) => {
      // Prevent click bubbling from button inside the card
      if (e.target.closest('.btn')) return;

      window.location.href = `details?id=${itemId}&type=${type}`;
    });
  });
}

  // Tab click listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      currentTab = tab.getAttribute('data-type');
      loadData(currentTab);
    });
  });

  // Search button listener
  searchBtn.addEventListener('click', () => {
    loadData(currentTab);
  });

  // Initial load
  loadData(currentTab);


});
function initNavbarListeners() {
  const signupBtn = document.querySelector('.signup-btn');
  if (!signupBtn) return; // Avoid null errors

  const token = localStorage.getItem('access_token');

  if (token) {
    signupBtn.textContent = 'Logout';
    signupBtn.addEventListener('click', () => {
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
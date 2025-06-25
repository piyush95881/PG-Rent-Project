document.addEventListener('DOMContentLoaded', () => {
  const signUpButton = document.getElementById('signUp');
  const signInButton = document.getElementById('signIn');
  const container = document.getElementById('container');

  signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
  });

  signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
  });
});

// Handle Signup
document.getElementById('signupForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value.trim();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const errorBox = document.getElementById('signupError');

  errorBox.textContent = "";

  if (!username || !name || !email || !password) {
    errorBox.textContent = "All fields are required.";
    return;
  }

  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('access_token', data.access_token);
      window.location.href = '/generate-form';
    } else {
      errorBox.textContent = data.msg || "Signup failed.";
    }
  } catch (err) {
    errorBox.textContent = "An error occurred during signup.";
  }
});

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorBox = document.getElementById('loginError');

  errorBox.textContent = "";

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('access_token', data.access_token);
      window.location.href = '/';
    } else {
      errorBox.textContent = data.msg || "Login failed.";
    }
  } catch (err) {
    errorBox.textContent = "An error occurred during login.";
  }
});

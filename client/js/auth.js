/**
 * GrowTrack — Auth Module
 * Handles login, register, logout, session management
 */

// Toggle between login and register forms
function toggleAuthForm() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const toggleText = document.getElementById('auth-toggle-text');
  const toggleLink = document.getElementById('auth-toggle-link');

  if (loginForm.classList.contains('hidden')) {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    toggleText.textContent = "Don't have an account?";
    toggleLink.textContent = 'Sign up';
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    toggleText.textContent = 'Already have an account?';
    toggleLink.textContent = 'Sign in';
  }
}

// Login handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');

  btn.disabled = true;
  btn.textContent = 'Signing in...';

  try {
    const result = await api.post('/auth/login', { email, password });

    if (result.success) {
      storageSet('access_token', result.data.accessToken);
      storageSet('refresh_token', result.data.refreshToken);
      storageSet('user', result.data.user);
      showToast('Welcome back! 🌱', 'success');
      initApp();
    }
  } catch (error) {
    showToast(error.message || 'Login failed.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
});

// Register handler
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const btn = document.getElementById('register-btn');

  btn.disabled = true;
  btn.textContent = 'Creating account...';

  try {
    const result = await api.post('/auth/register', { name, email, password });

    if (result.success) {
      storageSet('access_token', result.data.accessToken);
      storageSet('refresh_token', result.data.refreshToken);
      storageSet('user', result.data.user);
      showToast('Account created! Welcome aboard! 🎉', 'success');
      initApp();
    }
  } catch (error) {
    if (error.errors) {
      error.errors.forEach(err => showToast(`${err.field}: ${err.message}`, 'error'));
    } else {
      showToast(error.message || 'Registration failed.', 'error');
    }
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
});

// Logout handler
function handleLogout() {
  storageRemove('access_token');
  storageRemove('refresh_token');
  storageRemove('user');
  showAuthPage();
  showToast('Signed out.', 'info');
}

// Show auth page
function showAuthPage() {
  document.getElementById('loading-screen').classList.add('hidden');
  document.getElementById('auth-page').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

// Check if user is authenticated
function isAuthenticated() {
  return !!storageGet('access_token');
}

// Get current user
function getCurrentUser() {
  return storageGet('user');
}

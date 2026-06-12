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
    // Local storage login logic
    const users = storageGet('local_users') || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Create a fake token for local simulation
      const mockToken = btoa(email + Date.now());
      
      storageSet('access_token', mockToken);
      storageSet('refresh_token', mockToken);
      storageSet('user', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      });
      
      showToast('Welcome back!', 'success');
      initApp();
    } else {
      throw new Error('Invalid email or password.');
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
    // Local storage register logic
    const users = storageGet('local_users') || [];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      throw new Error('Email is already registered.');
    }

    // Create new user
    const newUser = {
      id: 'local_' + Date.now(),
      name,
      email,
      password,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    storageSet('local_users', users);

    // Auto-login
    const mockToken = btoa(email + Date.now());
    storageSet('access_token', mockToken);
    storageSet('refresh_token', mockToken);
    storageSet('user', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
    
    showToast('Account created! Welcome aboard!', 'success');
    initApp();
  } catch (error) {
    showToast(error.message || 'Registration failed.', 'error');
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

/**
 * GrowTrack — Main App Router & Initialization
 */

let currentPage = 'dashboard';

// Page render functions map
const pages = {
  'dashboard': renderDashboard,
  'habits': renderHabits,
  'goals': renderGoals,
  'mood': renderMood,
  'reports': renderReports,
  'settings': renderSettings,
  'knowledge': renderKnowledge,
  'upgrade': renderUpgrade,
  'admin-dashboard': renderAdminDashboard,
  'admin-users': renderAdminUsers,
  'admin-analytics': renderAdminMetrics,
};

// Page titles
const pageTitles = {
  'dashboard': 'Dashboard',
  'habits': 'My Habits',
  'goals': 'My Goals',
  'mood': 'Mood Logger',
  'reports': 'Reports & Analytics',
  'settings': 'Settings',
  'knowledge': 'Knowledge Hub',
  'upgrade': 'Upgrade Plan',
  'admin-dashboard': 'Admin Dashboard',
  'admin-users': 'User Management',
  'admin-analytics': 'System Metrics',
};

/**
 * Navigate to a page
 */
function navigateTo(page) {
  if (!pages[page]) {
    showToast('Page not found.', 'error');
    return;
  }

  currentPage = page;

  // Update sidebar active state
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Update page title
  document.getElementById('page-title').textContent = pageTitles[page] || capitalize(page);

  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');

  // Reset page animation
  const contentEl = document.getElementById('page-content');
  if (contentEl) {
    contentEl.style.animation = 'none';
    contentEl.offsetHeight; // trigger reflow
    contentEl.style.animation = null;
  }

  // Render page
  pages[page]();

  // Re-init Lucide icons for new content
  if (window.lucide) lucide.createIcons();
}

/**
 * Toggle sidebar on mobile
 */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

/**
 * Toggle dark/light theme
 */
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  storageSet('theme', next);

  // Update icon
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.setAttribute('data-lucide', next === 'dark' ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }
}

/**
 * Modal helpers
 */
function openModal(title, bodyHTML, footerHTML = '') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-footer').innerHTML = footerHTML;
  document.getElementById('modal-backdrop').classList.add('active');
  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('active');
  document.getElementById('modal').classList.remove('active');
}

/**
 * PWA Install
 */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show install banner after a delay
  setTimeout(() => {
    if (!storageGet('pwa_dismissed')) {
      document.getElementById('pwa-install-banner').classList.remove('hidden');
    }
  }, 5000);
});

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        showToast('App installed!', 'success');
      }
      deferredPrompt = null;
      document.getElementById('pwa-install-banner').classList.add('hidden');
    });
  }
}

function dismissPWABanner() {
  document.getElementById('pwa-install-banner').classList.add('hidden');
  storageSet('pwa_dismissed', true);
}

/**
 * Initialize app after authentication
 */
async function initApp() {
  const user = getCurrentUser();

  if (!user || !isAuthenticated()) {
    showAuthPage();
    return;
  }

  // Show app, hide auth
  document.getElementById('loading-screen').classList.add('hidden');
  document.getElementById('auth-page').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  // Update user info in sidebar
  document.getElementById('user-name').textContent = user.name || 'User';
  document.getElementById('user-plan').textContent = `${capitalize(user.plan || 'free')} Plan`;
  document.getElementById('user-avatar').textContent = getInitials(user.name || 'GT');

  // Show admin nav if admin
  if (user.role === 'admin') {
    document.getElementById('admin-nav').classList.remove('hidden');
  } else {
    document.getElementById('admin-nav').classList.add('hidden');
  }

  // Apply saved theme
  const savedTheme = storageGet('theme', 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.setAttribute('data-lucide', savedTheme === 'dark' ? 'sun' : 'moon');
  }

  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();

  // Navigate to dashboard
  navigateTo('dashboard');

  // Refresh user data from server (non-blocking)
  try {
    const result = await api.get('/auth/me');
    if (result.success) {
      storageSet('user', result.data.user);
      document.getElementById('user-name').textContent = result.data.user.name;
      document.getElementById('user-plan').textContent = `${capitalize(result.data.user.plan)} Plan`;
    }
  } catch (e) {
    // Non-critical — use cached data
  }
}

/**
 * Boot the app
 */
window.addEventListener('DOMContentLoaded', () => {
  if (isAuthenticated()) {
    initApp();
  } else {
    showAuthPage();
  }
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('menu-toggle-btn');
  if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  }
});

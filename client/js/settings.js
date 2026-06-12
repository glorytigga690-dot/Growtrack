/**
 * GrowTrack — Settings Page
 */

function renderSettings() {
  const user = getCurrentUser();
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="mb-lg animate-in"><h2 style="font-family:var(--font-heading);font-weight:800;">Settings</h2></div>
    <div class="grid-2">
      <div class="card animate-in animate-in-delay-1"><div class="card-header"><h3 class="card-title">Profile</h3></div><div class="card-body">
        <div class="form-group"><label class="form-label">Name</label><input class="form-input" id="settings-name" value="${user.name || ''}"></div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" value="${user.email || ''}" disabled></div>
        <button class="btn btn-primary" onclick="saveProfile()" id="save-profile-btn">Save Changes</button>
      </div></div>
      <div class="card animate-in animate-in-delay-2"><div class="card-header"><h3 class="card-title">Preferences</h3></div><div class="card-body">
        <div class="settings-toggle"><div><div class="font-bold">Dark Mode</div><div class="text-sm text-muted">Toggle dark theme</div></div><button class="btn btn-secondary btn-sm" onclick="toggleTheme()" id="settings-theme-btn">Toggle</button></div>
        <div class="settings-toggle"><div><div class="font-bold">Notifications</div><div class="text-sm text-muted">Push notification reminders</div></div><span class="badge badge-warning">Coming Soon</span></div>
        <div class="settings-toggle"><div><div class="font-bold">Data Export</div><div class="text-sm text-muted">Download all your data</div></div><button class="btn btn-secondary btn-sm" onclick="showToast('Data export coming soon!','info')" id="export-data-btn">Export</button></div>
      </div></div>
    </div>
    <div class="card mt-lg animate-in animate-in-delay-3" style="border-color: var(--color-danger);">
      <div class="card-header"><h3 class="card-title" style="color:var(--color-danger);">Danger Zone</h3></div>
      <div class="card-body"><div class="flex-between"><div><div class="font-bold">Delete Account</div><div class="text-sm text-muted">Permanently delete your account and all data.</div></div><button class="btn btn-danger btn-sm" onclick="showToast('Contact support to delete your account.','warning')" id="delete-account-btn">Delete Account</button></div></div>
    </div>
  `;
}

async function saveProfile() {
  try {
    const name = document.getElementById('settings-name').value.trim();
    if (!name) { showToast('Name is required.', 'warning'); return; }
    const result = await api.put('/auth/profile', { name });
    if (result.success) {
      const user = getCurrentUser();
      user.name = name;
      storageSet('user', user);
      document.getElementById('user-name').textContent = name;
      document.getElementById('user-avatar').textContent = getInitials(name);
      showToast('Profile updated!', 'success');
    }
  } catch (e) { showToast(e.message || 'Failed to update.', 'error'); }
}

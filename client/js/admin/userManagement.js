/**
 * GrowTrack — Admin User Management
 */

async function renderAdminUsers() {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="flex-between mb-lg animate-in">
      <div><h2 style="font-family:var(--font-heading);font-weight:800;">User Management</h2></div>
      <div class="flex gap-sm"><input class="form-input" id="admin-search" placeholder="Search users..." style="width:250px;" oninput="debounce(loadAdminUsers, 400)()"><select class="form-input" id="admin-filter-plan" style="width:120px;" onchange="loadAdminUsers()"><option value="">All Plans</option><option value="free">Free</option><option value="pro">Pro</option><option value="team">Team</option></select></div>
    </div>
    <div class="card animate-in animate-in-delay-1"><div class="card-body" style="overflow-x:auto;" id="admin-users-table"><div class="flex-center" style="padding:var(--space-xl);"><div class="spinner"></div></div></div></div>
  `;
  loadAdminUsers();
}

async function loadAdminUsers() {
  try {
    const search = document.getElementById('admin-search')?.value || '';
    const plan = document.getElementById('admin-filter-plan')?.value || '';
    let url = '/admin/users?limit=50';
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (plan) url += `&plan=${plan}`;

    const result = await api.get(url);
    const el = document.getElementById('admin-users-table');

    if (!result.data.length) { el.innerHTML = '<p class="text-muted text-center">No users found.</p>'; return; }
    el.innerHTML = `<table class="data-table"><thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead><tbody>${result.data.map(u => `
      <tr>
        <td><div class="font-bold">${u.name}</div><div class="text-xs text-muted">${u.email}</div></td>
        <td><span class="badge badge-${u.role==='admin'?'primary':'info'}">${u.role}</span></td>
        <td><span class="badge badge-${u.plan==='pro'?'success':u.plan==='team'?'primary':'warning'}">${capitalize(u.plan)}</span></td>
        <td><span class="badge badge-${u.is_active?'success':'danger'}">${u.is_active?'Active':'Suspended'}</span></td>
        <td class="text-sm text-muted">${u.last_login ? timeAgo(u.last_login) : 'Never'}</td>
        <td>
          ${u.role !== 'admin' ? `
            ${u.is_active
              ? `<button class="btn btn-ghost btn-sm" onclick="adminSuspendUser(${u.id},'${u.email}')">Suspend</button>`
              : `<button class="btn btn-ghost btn-sm" onclick="adminActivateUser(${u.id},'${u.email}')">Activate</button>`
            }
            <button class="btn btn-ghost btn-sm" style="color:var(--color-danger);" onclick="adminDeleteUser(${u.id},'${u.email}')">Delete</button>
          ` : '<span class="text-xs text-muted">Protected</span>'}
        </td>
      </tr>
    `).join('')}</tbody></table><div class="text-sm text-muted mt-md">Showing ${result.data.length} of ${result.pagination.total} users</div>`;
  } catch (e) { showToast('Failed to load users.', 'error'); }
}

async function adminSuspendUser(id, email) {
  openModal('Suspend User', `<p>Suspend <strong>${email}</strong>?</p>`, `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-danger" onclick="confirmAdminAction('/admin/users/${id}/suspend','put','User suspended.','warning')">Suspend</button>`);
}

async function adminActivateUser(id, email) {
  try { await api.put(`/admin/users/${id}/activate`); showToast(`${email} activated.`, 'success'); loadAdminUsers(); } catch(e) { showToast(e.message, 'error'); }
}

async function adminDeleteUser(id, email) {
  openModal('Delete User', `<p>Permanently delete <strong>${email}</strong> and all their data?</p><p class="text-sm text-muted mt-sm">This cannot be undone.</p>`, `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-danger" onclick="confirmAdminAction('/admin/users/${id}','delete','User deleted.','info')">Delete</button>`);
}

async function confirmAdminAction(url, method, msg, type) {
  try { await api[method](url); closeModal(); showToast(msg, type); loadAdminUsers(); } catch(e) { showToast(e.message, 'error'); }
}

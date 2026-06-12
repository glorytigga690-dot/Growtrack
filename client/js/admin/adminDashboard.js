/**
 * GrowTrack — Admin Dashboard
 */

async function renderAdminDashboard() {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="mb-lg animate-in"><h2 style="font-family:var(--font-heading);font-weight:800;">Admin Dashboard</h2><p class="text-sm text-muted">System overview and management.</p></div>
    <div class="grid-stats mb-lg" id="admin-stats"><div class="flex-center" style="grid-column:1/-1;padding:var(--space-lg);"><div class="spinner"></div></div></div>
    <div class="grid-2">
      <div class="card animate-in animate-in-delay-1"><div class="card-header"><h3 class="card-title">Plan Distribution</h3></div><div class="card-body chart-container"><canvas id="admin-plan-chart" height="200"></canvas></div></div>
      <div class="card animate-in animate-in-delay-2"><div class="card-header"><h3 class="card-title">Recent Audit Logs</h3></div><div class="card-body" id="admin-audit-logs"><div class="flex-center"><div class="spinner"></div></div></div></div>
    </div>
  `;
  loadAdminData();
}

async function loadAdminData() {
  try {
    const [analytics, logs] = await Promise.all([api.get('/admin/analytics'), api.get('/admin/audit-logs?limit=10')]);
    const d = analytics.data;

    document.getElementById('admin-stats').innerHTML = `
      <div class="card stat-card animate-in animate-in-delay-1"><div class="stat-icon blue">👥</div><div class="stat-info"><div class="stat-label">Total Users</div><div class="stat-value">${d.users.total}</div></div></div>
      <div class="card stat-card animate-in animate-in-delay-2"><div class="stat-icon green">✅</div><div class="stat-info"><div class="stat-label">Active (7d)</div><div class="stat-value">${d.users.weekly_active}</div></div></div>
      <div class="card stat-card animate-in animate-in-delay-3"><div class="stat-icon yellow">📝</div><div class="stat-info"><div class="stat-label">New (30d)</div><div class="stat-value">${d.users.recent_signups}</div></div></div>
      <div class="card stat-card animate-in animate-in-delay-4"><div class="stat-icon purple">💰</div><div class="stat-info"><div class="stat-label">Revenue</div><div class="stat-value">$${d.revenue.total.toFixed(2)}</div></div></div>
    `;

    // Plan chart
    const ctx = document.getElementById('admin-plan-chart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Free', 'Pro', 'Team'],
        datasets: [{ data: [d.plans.free, d.plans.pro, d.plans.team], backgroundColor: ['#94A3B8', '#6C63FF', '#2DD4A8'], borderWidth: 0 }],
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
    });

    // Audit logs
    const logsEl = document.getElementById('admin-audit-logs');
    if (logs.data.length) {
      logsEl.innerHTML = logs.data.map(l => `<div class="flex-between" style="padding:var(--space-xs) 0;border-bottom:1px solid var(--color-border-light);font-size:var(--text-sm);"><span>${l.action}</span><span class="text-xs text-muted">${timeAgo(l.created_at)}</span></div>`).join('');
    } else { logsEl.innerHTML = '<p class="text-muted">No logs yet.</p>'; }
  } catch (e) { showToast('Failed to load admin data.', 'error'); }
}

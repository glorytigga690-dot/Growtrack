/**
 * GrowTrack — Admin System Metrics
 */

async function renderAdminMetrics() {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="mb-lg animate-in"><h2 style="font-family:var(--font-heading);font-weight:800;">System Metrics</h2></div>
    <div class="grid-stats mb-lg" id="metrics-stats"><div class="flex-center" style="grid-column:1/-1;"><div class="spinner"></div></div></div>
    <div class="card animate-in animate-in-delay-5"><div class="card-header"><h3 class="card-title">Activity Overview</h3></div><div class="card-body chart-container"><canvas id="metrics-chart" height="250"></canvas></div></div>
  `;
  loadMetrics();
}

async function loadMetrics() {
  try {
    const result = await api.get('/admin/analytics');
    const d = result.data;

    document.getElementById('metrics-stats').innerHTML = `
      <div class="card stat-card animate-in animate-in-delay-1"><div class="stat-icon purple"><i data-lucide="clipboard-list"></i></div><div class="stat-info"><div class="stat-label">Total Habits</div><div class="stat-value">${d.activity.habits}</div></div></div>
      <div class="card stat-card animate-in animate-in-delay-2"><div class="stat-icon green"><i data-lucide="target"></i></div><div class="stat-info"><div class="stat-label">Total Goals</div><div class="stat-value">${d.activity.goals}</div></div></div>
      <div class="card stat-card animate-in animate-in-delay-3"><div class="stat-icon yellow"><i data-lucide="smile"></i></div><div class="stat-info"><div class="stat-label">Mood Logs</div><div class="stat-value">${d.activity.mood_logs}</div></div></div>
      <div class="card stat-card animate-in animate-in-delay-4"><div class="stat-icon blue"><i data-lucide="check-circle"></i></div><div class="stat-info"><div class="stat-label">Habit Logs</div><div class="stat-value">${d.activity.habit_logs}</div></div></div>
    `;

    const ctx = document.getElementById('metrics-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Habits', 'Goals', 'Mood Logs', 'Habit Logs'],
        datasets: [{
          label: 'Total Count',
          data: [d.activity.habits, d.activity.goals, d.activity.mood_logs, d.activity.habit_logs],
          backgroundColor: ['#6C63FF80', '#2DD4A880', '#FBBF2480', '#38BDF880'],
          borderColor: ['#6C63FF', '#2DD4A8', '#FBBF24', '#38BDF8'],
          borderWidth: 2,
          borderRadius: 8,
        }],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
  } catch (e) { showToast('Failed to load metrics.', 'error'); }
}

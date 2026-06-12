/**
 * GrowTrack — Reports & Analytics Page
 */

async function renderReports() {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="mb-lg animate-in"><h2 style="font-family:var(--font-heading);font-weight:800;">Reports & Analytics</h2><p class="text-sm text-muted">Understand your growth patterns with data-driven insights.</p></div>
    <div class="grid-stats mb-lg">
      <div class="card stat-card animate-in animate-in-delay-1"><div class="stat-icon purple">📈</div><div class="stat-info"><div class="stat-label">Growth Score</div><div class="stat-value" id="report-growth">—</div></div></div>
      <div class="card stat-card animate-in animate-in-delay-2"><div class="stat-icon green">✅</div><div class="stat-info"><div class="stat-label">Consistency</div><div class="stat-value" id="report-consistency">—</div></div></div>
      <div class="card stat-card animate-in animate-in-delay-3"><div class="stat-icon yellow">😊</div><div class="stat-info"><div class="stat-label">Mood Avg</div><div class="stat-value" id="report-mood-avg">—</div></div></div>
      <div class="card stat-card animate-in animate-in-delay-4"><div class="stat-icon red">🔥</div><div class="stat-info"><div class="stat-label">Best Streak</div><div class="stat-value" id="report-streak">—</div></div></div>
    </div>
    <div class="grid-2 mb-lg">
      <div class="card animate-in animate-in-delay-5"><div class="card-header"><h3 class="card-title">Habit Performance</h3></div><div class="card-body chart-container"><canvas id="habit-chart" height="250"></canvas></div></div>
      <div class="card animate-in animate-in-delay-5"><div class="card-header"><h3 class="card-title">Mood Trend</h3></div><div class="card-body chart-container"><canvas id="mood-chart" height="250"></canvas></div></div>
    </div>
    <div class="card mb-lg animate-in animate-in-delay-6">
      <div class="card-header"><h3 class="card-title">Insights</h3><span class="badge badge-primary">AI-Powered</span></div>
      <div class="card-body" id="report-insights"><div class="flex-center"><div class="spinner"></div></div></div>
    </div>
    <div class="flex-center animate-in animate-in-delay-6"><button class="btn btn-secondary" onclick="exportPDF()" id="export-pdf-btn"><i data-lucide="download" style="width:16px;height:16px;"></i> Export PDF Report</button></div>
  `;
  if (window.lucide) lucide.createIcons();
  loadReportData();
}

let habitChartInstance = null;
let moodChartInstance = null;

async function loadReportData() {
  try {
    const [weekly, score] = await Promise.all([
      api.get('/reports/weekly'),
      api.get('/reports/growth-score?days=7'),
    ]);

    const w = weekly.data;
    const s = score.data;

    document.getElementById('report-growth').textContent = s.growth_score;
    document.getElementById('report-growth').style.color = getScoreColor(s.growth_score);
    document.getElementById('report-consistency').textContent = `${Math.round(s.breakdown.habit_consistency)}%`;
    document.getElementById('report-mood-avg').textContent = s.breakdown.mood_avg ? `${s.breakdown.mood_avg} ${getMoodEmoji(Math.round(s.breakdown.mood_avg))}` : '—';
    document.getElementById('report-streak').textContent = `${s.meta.max_streak}d`;

    // Habit chart
    if (w.habits && w.habits.length > 0) {
      const ctx = document.getElementById('habit-chart').getContext('2d');
      if (habitChartInstance) habitChartInstance.destroy();
      habitChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: w.habits.map(h => h.name),
          datasets: [{
            label: 'Completion Rate',
            data: w.habits.map(h => h.rate),
            backgroundColor: w.habits.map(h => h.color + '80'),
            borderColor: w.habits.map(h => h.color),
            borderWidth: 2,
            borderRadius: 8,
          }],
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } } },
      });
    }

    // Mood chart
    if (w.mood_trend && w.mood_trend.length > 0) {
      const ctx2 = document.getElementById('mood-chart').getContext('2d');
      if (moodChartInstance) moodChartInstance.destroy();
      moodChartInstance = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: w.mood_trend.map(m => formatDateShort(m.date)),
          datasets: [{
            label: 'Mood Score',
            data: w.mood_trend.map(m => m.score),
            borderColor: '#6C63FF',
            backgroundColor: 'rgba(108, 99, 255, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: w.mood_trend.map(m => {
              const colors = { 1: '#EF4444', 2: '#F97316', 3: '#EAB308', 4: '#22C55E', 5: '#6C63FF' };
              return colors[m.score] || '#6C63FF';
            }),
            pointRadius: 6,
          }],
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 1, max: 5, ticks: { stepSize: 1, callback: v => getMoodEmoji(v) } } } },
      });
    }

    // Insights
    const insightsEl = document.getElementById('report-insights');
    if (w.insights && w.insights.length > 0) {
      insightsEl.innerHTML = w.insights.map(i => `<div class="insight-item"><span style="margin-right:var(--space-sm);font-size:1.2rem;">💡</span><span class="text-sm" style="font-weight:500;">${i}</span></div>`).join('');
    } else {
      insightsEl.innerHTML = '<p class="text-muted">Log more habits and moods to unlock insights.</p>';
    }
  } catch (e) {
    console.error('Report error:', e);
    document.getElementById('report-insights').innerHTML = '<p class="text-muted">Could not load report data.</p>';
  }
}

async function exportPDF() {
  showToast('Generating PDF...', 'info');
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const user = getCurrentUser();

    doc.setFontSize(22);
    doc.setTextColor(108, 99, 255);
    doc.text('GrowTrack Report', 20, 25);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated for: ${user.name}`, 20, 35);
    doc.text(`Date: ${formatDate(new Date())}`, 20, 42);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Growth Score: ' + (document.getElementById('report-growth').textContent || '—'), 20, 58);
    doc.text('Consistency: ' + (document.getElementById('report-consistency').textContent || '—'), 20, 68);
    doc.text('Mood Average: ' + (document.getElementById('report-mood-avg').textContent || '—'), 20, 78);
    doc.text('Best Streak: ' + (document.getElementById('report-streak').textContent || '—'), 20, 88);

    // Capture charts as images
    const habitCanvas = document.getElementById('habit-chart');
    const moodCanvas = document.getElementById('mood-chart');

    if (habitCanvas) {
      const habitImg = habitCanvas.toDataURL('image/png');
      doc.text('Habit Performance', 20, 105);
      doc.addImage(habitImg, 'PNG', 20, 110, 170, 70);
    }

    if (moodCanvas) {
      const moodImg = moodCanvas.toDataURL('image/png');
      doc.text('Mood Trend', 20, 190);
      doc.addImage(moodImg, 'PNG', 20, 195, 170, 70);
    }

    doc.save(`GrowTrack_Report_${getTodayISO()}.pdf`);
    showToast('PDF downloaded! 📄', 'success');
  } catch (e) {
    showToast('PDF export failed.', 'error');
    console.error(e);
  }
}

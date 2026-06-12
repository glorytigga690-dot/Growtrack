/**
 * GrowTrack — Mood Logger Page
 */

async function renderMood() {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="mb-lg animate-in"><h2 style="font-family:var(--font-heading);font-weight:800;">Mood Logger</h2><p class="text-sm text-muted">Track how you feel each day to discover patterns.</p></div>
    <div class="grid-2 mb-lg">
      <div class="card animate-in animate-in-delay-1">
        <div class="card-header"><h3 class="card-title">Log Today's Mood</h3></div>
        <div class="card-body">
          <div class="mood-selector" id="mood-page-selector">
            ${[1,2,3,4,5].map(s => `<div class="mood-option" data-score="${s}" onclick="selectPageMood(${s})"><span class="mood-emoji">${getMoodEmoji(s)}</span><span class="mood-label">${getMoodLabel(s)}</span></div>`).join('')}
          </div>
          <div id="mood-page-form" class="hidden">
            <div class="form-group"><label class="form-label">How are you feeling?</label><textarea class="form-input" id="mood-page-note" placeholder="Write a quick note..."></textarea></div>
            <div class="form-group"><label class="form-label">Tags</label><input class="form-input" id="mood-page-tags" placeholder="e.g., exercise, work, sleep (comma separated)"></div>
            <button class="btn btn-primary" onclick="submitPageMood()" style="width:100%;" id="mood-page-submit">Save Mood</button>
          </div>
        </div>
      </div>
      <div class="card animate-in animate-in-delay-2">
        <div class="card-header"><h3 class="card-title">Mood Stats</h3><span class="badge badge-primary">30 Days</span></div>
        <div class="card-body" id="mood-stats-content"><div class="flex-center"><div class="spinner"></div></div></div>
      </div>
    </div>
    <div class="card animate-in animate-in-delay-3">
      <div class="card-header"><h3 class="card-title">Mood History</h3></div>
      <div class="card-body" id="mood-history"><div class="flex-center"><div class="spinner"></div></div></div>
    </div>
  `;
  loadMoodStats();
  loadMoodHistory();
}

let pageMoodScore = null;

function selectPageMood(score) {
  pageMoodScore = score;
  document.querySelectorAll('#mood-page-selector .mood-option').forEach(o => o.classList.toggle('selected', parseInt(o.dataset.score) === score));
  document.getElementById('mood-page-form').classList.remove('hidden');
}

async function submitPageMood() {
  if (!pageMoodScore) return;
  const btn = document.getElementById('mood-page-submit');
  btn.disabled = true;
  try {
    const tags = document.getElementById('mood-page-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    await api.post('/moods', { mood_score: pageMoodScore, note: document.getElementById('mood-page-note').value, tags, date: new Date().toISOString() });
    showToast('Mood logged!', 'success');
    loadMoodHistory();
    loadMoodStats();
    pageMoodScore = null;
    document.getElementById('mood-page-form').classList.add('hidden');
    document.querySelectorAll('#mood-page-selector .mood-option').forEach(o => o.classList.remove('selected'));
  } catch (e) { showToast(e.message || 'Failed to log mood.', 'error'); }
  finally { btn.disabled = false; }
}

async function loadMoodStats() {
  try {
    const result = await api.get('/moods/stats?days=30');
    const el = document.getElementById('mood-stats-content');
    const d = result.data;
    el.innerHTML = `
      <div class="grid-2" style="gap:var(--space-md);">
        <div><div class="text-xs text-muted">Average</div><div style="font-size:var(--text-2xl);font-weight:800;">${d.average ? `${getMoodEmoji(Math.round(d.average))} ${d.average}` : '—'}</div></div>
        <div><div class="text-xs text-muted">Stability</div><div style="font-size:var(--text-2xl);font-weight:800;">${d.stability ? `${Math.round(d.stability)}%` : '—'}</div></div>
        <div><div class="text-xs text-muted">Trend</div><div class="badge badge-${d.trend==='improving'?'success':d.trend==='declining'?'danger':'info'}">${capitalize(d.trend||'neutral')}</div></div>
        <div><div class="text-xs text-muted">Entries</div><div style="font-size:var(--text-xl);font-weight:700;">${d.total_logs}</div></div>
      </div>
      ${d.top_tags && d.top_tags.length ? `<div class="mt-md"><div class="text-xs text-muted mb-sm">Top Tags</div><div class="flex gap-sm" style="flex-wrap:wrap;">${d.top_tags.map(t=>`<span class="badge badge-primary">${t.tag} (${t.count})</span>`).join('')}</div></div>` : ''}
    `;
  } catch (e) { document.getElementById('mood-stats-content').innerHTML = '<p class="text-muted">Could not load stats.</p>'; }
}

async function loadMoodHistory() {
  try {
    const result = await api.get('/moods?limit=14');
    const el = document.getElementById('mood-history');
    if (!result.data || result.data.length === 0) { el.innerHTML = '<p class="text-muted text-center">No mood logs yet.</p>'; return; }
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:var(--space-sm);">${result.data.map(m => `
      <div class="mood-timeline-item">
        <div class="mood-timeline-emoji">${getMoodEmoji(m.mood_score)}</div>
        <div style="flex:1;">
          <div class="text-sm font-bold">${getMoodLabel(m.mood_score)}</div>
          <div class="text-xs text-muted">${formatDate(m.date)}</div>
          ${m.note ? `<div class="text-sm text-muted mt-sm">${m.note}</div>` : ''}
        </div>
      </div>
    `).join('')}</div>`;
  } catch (e) { document.getElementById('mood-history').innerHTML = '<p class="text-muted">Could not load history.</p>'; }
}

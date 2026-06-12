/**
 * GrowTrack — Dashboard Page
 */

async function renderDashboard() {
  const container = document.getElementById('page-content');
  
  const user = getCurrentUser() || { name: 'User' };
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  
  container.innerHTML = `
    <div class="greeting-section animate-in">
      <div class="greeting-text">${greeting}, <span class="highlight">${user.name.split(' ')[0]}</span>!</div>
      <div class="greeting-subtitle">Ready to grow today? Let's make it count.</div>
    </div>

    <div class="grid-stats mb-lg" id="dashboard-stats">
      <div class="card stat-card animate-in animate-in-delay-1">
        <div class="stat-icon purple"><i data-lucide="clipboard-list"></i></div>
        <div class="stat-info">
          <div class="stat-label">Today's Habits</div>
          <div class="stat-value" id="stat-habits-today">-/-</div>
        </div>
      </div>
      <div class="card stat-card animate-in animate-in-delay-2">
        <div class="stat-icon green"><i data-lucide="target"></i></div>
        <div class="stat-info">
          <div class="stat-label">Active Goals</div>
          <div class="stat-value" id="stat-goals-active">0</div>
        </div>
      </div>
      <div class="card stat-card animate-in animate-in-delay-3">
        <div class="stat-icon yellow"><i data-lucide="smile"></i></div>
        <div class="stat-info">
          <div class="stat-label">Today's Mood</div>
          <div class="stat-value" id="stat-mood-today">—</div>
        </div>
      </div>
      <div class="card stat-card animate-in animate-in-delay-4">
        <div class="stat-icon blue"><i data-lucide="trending-up"></i></div>
        <div class="stat-info">
          <div class="stat-label">Growth Score</div>
          <div class="stat-value" id="stat-growth-score">—</div>
        </div>
      </div>
    </div>

    <div class="grid-2 mb-lg">
      <!-- Growth Score Gauge -->
      <div class="card animate-in animate-in-delay-5">
        <div class="card-header">
          <h3 class="card-title">Growth Score</h3>
          <span class="badge badge-primary">This Week</span>
        </div>
        <div class="card-body" style="text-align: center;">
          <div class="growth-gauge" id="dashboard-gauge">
            <div class="growth-gauge-circle">
              <div class="growth-gauge-inner">
                <div class="growth-gauge-value" id="gauge-value">—</div>
                <div class="growth-gauge-label">Score</div>
              </div>
            </div>
          </div>
          <div style="margin-top: var(--space-md);">
            <div class="text-sm text-muted" id="gauge-breakdown">Loading breakdown...</div>
          </div>
        </div>
      </div>

      <!-- Quick Mood Logger -->
      <div class="card animate-in animate-in-delay-5">
        <div class="card-header">
          <h3 class="card-title">How are you feeling?</h3>
        </div>
        <div class="card-body">
          <div class="mood-selector" id="dashboard-mood-selector">
            <div class="mood-option" data-score="1" onclick="quickLogMood(1)">
              <span class="mood-emoji"><i data-lucide="frown" style="width:28px;height:28px;"></i></span>
              <span class="mood-label">Awful</span>
            </div>
            <div class="mood-option" data-score="2" onclick="quickLogMood(2)">
              <span class="mood-emoji"><i data-lucide="meh" style="width:28px;height:28px;"></i></span>
              <span class="mood-label">Bad</span>
            </div>
            <div class="mood-option" data-score="3" onclick="quickLogMood(3)">
              <span class="mood-emoji"><i data-lucide="minus" style="width:28px;height:28px;"></i></span>
              <span class="mood-label">Okay</span>
            </div>
            <div class="mood-option" data-score="4" onclick="quickLogMood(4)">
              <span class="mood-emoji"><i data-lucide="smile" style="width:28px;height:28px;"></i></span>
              <span class="mood-label">Good</span>
            </div>
            <div class="mood-option" data-score="5" onclick="quickLogMood(5)">
              <span class="mood-emoji"><i data-lucide="heart" style="width:28px;height:28px;"></i></span>
              <span class="mood-label">Great</span>
            </div>
          </div>
          <div id="mood-note-area" class="hidden" style="margin-top: var(--space-md);">
            <input class="form-input" id="quick-mood-note" placeholder="Add a note (optional)..." style="margin-bottom: var(--space-sm);">
            <button class="btn btn-primary btn-sm" onclick="submitQuickMood()" id="submit-mood-btn">Save Mood</button>
          </div>
          <div id="mood-logged-msg" class="hidden" style="text-align: center; padding: var(--space-md);">
            <span style="font-size: 2rem;" id="mood-logged-emoji"><i data-lucide="check-circle" style="width: 48px; height: 48px; color: var(--color-success);"></i></span>
            <p class="text-sm text-muted mt-sm">Mood logged for today!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Habits Quick View -->
    <div class="card mb-lg animate-in animate-in-delay-6">
      <div class="card-header">
        <h3 class="card-title">Today's Habits</h3>
        <button class="btn btn-ghost btn-sm" onclick="navigateTo('habits')">View All →</button>
      </div>
      <div class="card-body" id="dashboard-habits-list">
        <div class="flex-center" style="padding: var(--space-lg);"><div class="spinner"></div></div>
      </div>
    </div>
  `;

  // Load data
  loadDashboardData();
}

let selectedMoodScore = null;

async function loadDashboardData() {
  try {
    const result = await api.get('/reports/dashboard-summary');
    if (!result.success) return;

    const data = result.data;

    // Update stat cards
    document.getElementById('stat-habits-today').textContent =
      `${data.habits.completed_today}/${data.habits.active}`;
    document.getElementById('stat-goals-active').textContent = data.goals.active;
    document.getElementById('stat-mood-today').textContent =
      data.mood.logged ? getMoodEmoji(data.mood.today) : '—';
    document.getElementById('stat-growth-score').textContent = data.growth_score;

    // Update gauge
    const gauge = document.getElementById('dashboard-gauge');
    if (gauge) {
      gauge.querySelector('.growth-gauge-circle').style.background =
        `conic-gradient(${getScoreColor(data.growth_score)} ${data.growth_score * 3.6}deg, var(--color-bg-input) 0deg)`;
      document.getElementById('gauge-value').textContent = data.growth_score;
      document.getElementById('gauge-value').style.color = getScoreColor(data.growth_score);
    }

    // Breakdown
    const b = data.growth_breakdown;
    if (b) {
      document.getElementById('gauge-breakdown').innerHTML = `
        Consistency: ${Math.round(b.habit_consistency)}% · Stability: ${Math.round(b.mood_stability)}% · Streak: ${b.streak_bonus / 10}d
      `;
    }

    // If mood already logged, show the emoji
    if (data.mood.logged) {
      document.getElementById('dashboard-mood-selector').classList.add('hidden');
      document.getElementById('mood-logged-msg').classList.remove('hidden');
      document.getElementById('mood-logged-emoji').textContent = getMoodEmoji(data.mood.today);
    }

    // Load habits list
    loadDashboardHabits();
  } catch (error) {
    console.error('Dashboard load error:', error);
    document.getElementById('dashboard-habits-list').innerHTML =
      '<p class="text-muted text-center">Could not load dashboard data. Is the server running?</p>';
  }
}

async function loadDashboardHabits() {
  try {
    const result = await api.get('/habits');
    const container = document.getElementById('dashboard-habits-list');

    if (!result.success || result.data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i data-lucide="clipboard-list" style="width:48px;height:48px;"></i></div>
          <div class="empty-state-title">No habits yet</div>
          <div class="empty-state-text">Start building great habits today!</div>
          <button class="btn btn-primary" onclick="navigateTo('habits')">Create First Habit</button>
        </div>
      `;
      return;
    }

    container.innerHTML = result.data.slice(0, 5).map(habit => `
      <div class="flex-between" style="padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-border-light);">
        <div class="flex" style="align-items: center; gap: var(--space-sm);">
          <div class="habit-check ${habit.completed_today ? 'completed' : ''}"
               onclick="toggleDashboardHabit('${habit._id}', ${!habit.completed_today})"
               style="border-color: ${habit.color}; ${habit.completed_today ? `background: ${habit.color}; border-color: ${habit.color};` : ''}">
            ${habit.completed_today ? '✓' : ''}
          </div>
          <span style="font-weight: 500; ${habit.completed_today ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${habit.name}</span>
        </div>
        <div class="habit-streak">
          <span class="habit-streak-fire" style="display:inline-flex; align-items:center;"><i data-lucide="flame" style="width:14px;height:14px;"></i></span>
          <span>${habit.current_streak}d</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Habits load error:', error);
  }
}

async function toggleDashboardHabit(habitId, completed) {
  try {
    await api.post(`/habits/${habitId}/log`, {
      date: new Date().toISOString(),
      completed,
    });
    showToast(completed ? 'Habit completed!' : 'Habit unmarked.', completed ? 'success' : 'info');
    loadDashboardData();
  } catch (error) {
    showToast(error.message || 'Failed to log habit.', 'error');
  }
}

function quickLogMood(score) {
  selectedMoodScore = score;
  // Highlight selected
  document.querySelectorAll('#dashboard-mood-selector .mood-option').forEach(opt => {
    opt.classList.toggle('selected', parseInt(opt.dataset.score) === score);
  });
  document.getElementById('mood-note-area').classList.remove('hidden');
}

async function submitQuickMood() {
  if (!selectedMoodScore) return;

  const note = document.getElementById('quick-mood-note').value;
  const btn = document.getElementById('submit-mood-btn');
  btn.disabled = true;

  try {
    await api.post('/moods', {
      mood_score: selectedMoodScore,
      note,
      date: new Date().toISOString(),
    });
    showToast('Mood logged!', 'success');

    document.getElementById('dashboard-mood-selector').classList.add('hidden');
    document.getElementById('mood-note-area').classList.add('hidden');
    document.getElementById('mood-logged-msg').classList.remove('hidden');
    document.getElementById('mood-logged-emoji').textContent = getMoodEmoji(selectedMoodScore);
    document.getElementById('stat-mood-today').textContent = getMoodEmoji(selectedMoodScore);
  } catch (error) {
    showToast(error.message || 'Failed to log mood.', 'error');
  } finally {
    btn.disabled = false;
  }
}

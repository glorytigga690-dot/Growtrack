/**
 * GrowTrack — Habits Page
 */

async function renderHabits() {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="flex-between mb-lg">
      <div>
        <h2 style="font-family: var(--font-heading); font-weight: 800;">My Habits</h2>
        <p class="text-sm text-muted">Track your daily routines and build consistency.</p>
      </div>
      <button class="btn btn-primary" onclick="openAddHabitModal()" id="add-habit-btn">
        <i data-lucide="plus" style="width: 18px; height: 18px;"></i>
        Add Habit
      </button>
    </div>

    <div class="grid-habits" id="habits-grid">
      <div class="flex-center" style="padding: var(--space-2xl); grid-column: 1 / -1;"><div class="spinner"></div></div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
  loadHabits();
}

async function loadHabits() {
  try {
    const result = await api.get('/habits?status=all');
    const grid = document.getElementById('habits-grid');

    if (!result.success || result.data.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">No habits yet</div>
          <div class="empty-state-text">Create your first habit and start building consistency!</div>
          <button class="btn btn-primary" onclick="openAddHabitModal()">Create Habit</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = result.data.map((habit, index) => `
      <div class="card habit-card animate-in animate-in-delay-${(index % 6) + 1}" style="border-left-color: ${habit.color};">
        <div class="card-body">
          <div class="habit-card-header">
            <div>
              <div class="habit-card-name">${habit.name}</div>
              <div class="text-xs text-muted">${capitalize(habit.frequency)} · ${habit.target_days} days/week</div>
            </div>
            <div class="habit-check ${habit.completed_today ? 'completed' : ''}"
                 onclick="toggleHabitCompletion('${habit._id}', ${!habit.completed_today})"
                 style="border-color: ${habit.color}; ${habit.completed_today ? `background: ${habit.color}; border-color: ${habit.color};` : ''}">
              ${habit.completed_today ? '✓' : ''}
            </div>
          </div>
          ${habit.description ? `<p class="text-sm text-muted" style="margin: var(--space-sm) 0;">${truncate(habit.description, 80)}</p>` : ''}
          <div class="progress-bar" style="margin: var(--space-sm) 0;">
            <div class="progress-fill" style="width: ${habit.total_completions > 0 ? Math.min(100, (habit.total_completions / (habit.target_days * 4)) * 100) : 0}%; background: ${habit.color};"></div>
          </div>
          <div class="flex-between" style="margin-top: var(--space-sm);">
            <div class="habit-streak">
              <span class="habit-streak-fire" style="display:inline-flex; align-items:center;"><i data-lucide="flame" style="width:14px;height:14px;"></i></span>
              <span>${habit.current_streak}d streak</span>
              ${habit.best_streak > 0 ? `<span class="text-muted">· Best: ${habit.best_streak}d</span>` : ''}
            </div>
            <div class="flex gap-sm">
              <button class="btn btn-ghost btn-sm btn-icon" onclick="editHabit('${habit._id}')" title="Edit" aria-label="Edit habit">
                <i data-lucide="pencil" style="width: 14px; height: 14px;"></i>
              </button>
              <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteHabit('${habit._id}', '${habit.name}')" title="Delete" aria-label="Delete habit">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </div>
          ${habit.status !== 'active' ? `<span class="badge badge-warning mt-sm">${capitalize(habit.status)}</span>` : ''}
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  } catch (error) {
    showToast(error.message || 'Failed to load habits.', 'error');
  }
}

async function toggleHabitCompletion(id, completed) {
  try {
    await api.post(`/habits/${id}/log`, { date: new Date().toISOString(), completed });
    showToast(completed ? 'Habit completed!' : 'Habit unmarked.', completed ? 'success' : 'info');
    loadHabits();
  } catch (error) {
    showToast(error.message || 'Failed to log habit.', 'error');
  }
}

const habitColors = ['#6C63FF', '#2DD4A8', '#FF6B6B', '#FBBF24', '#38BDF8', '#F472B6', '#A78BFA', '#FB923C'];

function openAddHabitModal() {
  const colorsHTML = habitColors.map(c =>
    `<div class="color-swatch" onclick="selectHabitColor('${c}')" style="width:32px;height:32px;border-radius:50%;background:${c};cursor:pointer;border:3px solid transparent;transition:border var(--transition-fast);" data-color="${c}"></div>`
  ).join('');

  openModal('New Habit', `
    <form id="add-habit-form">
      <div class="form-group">
        <label class="form-label">Habit Name</label>
        <input class="form-input" id="habit-name" placeholder="e.g., Morning Exercise" required maxlength="100">
      </div>
      <div class="form-group">
        <label class="form-label">Description (optional)</label>
        <input class="form-input" id="habit-desc" placeholder="Quick description..." maxlength="500">
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Frequency</label>
          <select class="form-input" id="habit-frequency">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Target Days/Week</label>
          <input class="form-input" type="number" id="habit-target" value="7" min="1" max="7">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Color</label>
        <div class="flex gap-sm" style="flex-wrap: wrap;" id="color-picker">${colorsHTML}</div>
        <input type="hidden" id="habit-color" value="#6C63FF">
      </div>
    </form>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="submitNewHabit()">Create Habit</button>
  `);

  // Select first color
  selectHabitColor('#6C63FF');
}

function selectHabitColor(color) {
  document.getElementById('habit-color').value = color;
  document.querySelectorAll('#color-picker .color-swatch').forEach(sw => {
    sw.style.border = sw.dataset.color === color ? '3px solid var(--color-text)' : '3px solid transparent';
  });
}

async function submitNewHabit() {
  const name = document.getElementById('habit-name').value.trim();
  if (!name) { showToast('Habit name is required.', 'warning'); return; }

  try {
    await api.post('/habits', {
      name,
      description: document.getElementById('habit-desc').value,
      frequency: document.getElementById('habit-frequency').value,
      target_days: parseInt(document.getElementById('habit-target').value),
      color: document.getElementById('habit-color').value,
    });
    closeModal();
    showToast('Habit created!', 'success');
    loadHabits();
  } catch (error) {
    showToast(error.message || 'Failed to create habit.', 'error');
  }
}

async function editHabit(id) {
  try {
    const result = await api.get(`/habits/${id}`);
    const habit = result.data;

    const colorsHTML = habitColors.map(c =>
      `<div class="color-swatch" onclick="selectHabitColor('${c}')" style="width:32px;height:32px;border-radius:50%;background:${c};cursor:pointer;border:3px solid ${c === habit.color ? 'var(--color-text)' : 'transparent'};transition:border var(--transition-fast);" data-color="${c}"></div>`
    ).join('');

    openModal('Edit Habit', `
      <form id="edit-habit-form">
        <div class="form-group">
          <label class="form-label">Habit Name</label>
          <input class="form-input" id="habit-name" value="${habit.name}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <input class="form-input" id="habit-desc" value="${habit.description || ''}">
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Frequency</label>
            <select class="form-input" id="habit-frequency">
              <option value="daily" ${habit.frequency === 'daily' ? 'selected' : ''}>Daily</option>
              <option value="weekly" ${habit.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
              <option value="custom" ${habit.frequency === 'custom' ? 'selected' : ''}>Custom</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Target Days</label>
            <input class="form-input" type="number" id="habit-target" value="${habit.target_days}" min="1" max="7">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Color</label>
          <div class="flex gap-sm" id="color-picker">${colorsHTML}</div>
          <input type="hidden" id="habit-color" value="${habit.color}">
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-input" id="habit-status">
            <option value="active" ${habit.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="paused" ${habit.status === 'paused' ? 'selected' : ''}>Paused</option>
            <option value="archived" ${habit.status === 'archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitEditHabit('${id}')">Save Changes</button>
    `);
  } catch (error) {
    showToast('Failed to load habit.', 'error');
  }
}

async function submitEditHabit(id) {
  try {
    await api.put(`/habits/${id}`, {
      name: document.getElementById('habit-name').value,
      description: document.getElementById('habit-desc').value,
      frequency: document.getElementById('habit-frequency').value,
      target_days: parseInt(document.getElementById('habit-target').value),
      color: document.getElementById('habit-color').value,
      status: document.getElementById('habit-status').value,
    });
    closeModal();
    showToast('Habit updated.', 'success');
    loadHabits();
  } catch (error) {
    showToast(error.message || 'Failed to update.', 'error');
  }
}

function confirmDeleteHabit(id, name) {
  openModal('Delete Habit', `
    <p>Are you sure you want to delete <strong>"${name}"</strong>?</p>
    <p class="text-sm text-muted mt-sm">This will also delete all associated logs. This action cannot be undone.</p>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-danger" onclick="deleteHabitConfirmed('${id}')">Delete</button>
  `);
}

async function deleteHabitConfirmed(id) {
  try {
    await api.delete(`/habits/${id}`);
    closeModal();
    showToast('Habit deleted.', 'info');
    loadHabits();
  } catch (error) {
    showToast(error.message || 'Failed to delete.', 'error');
  }
}

/**
 * GrowTrack — Goals Page
 */

async function renderGoals() {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="flex-between mb-lg">
      <div>
        <h2 style="font-family: var(--font-heading); font-weight: 800;">My Goals</h2>
        <p class="text-sm text-muted">Set meaningful targets and track your progress.</p>
      </div>
      <button class="btn btn-primary" onclick="openAddGoalModal()" id="add-goal-btn">
        <i data-lucide="plus" style="width: 18px; height: 18px;"></i>
        Add Goal
      </button>
    </div>
    <div class="grid-habits" id="goals-grid">
      <div class="flex-center" style="padding: var(--space-2xl); grid-column: 1/-1;"><div class="spinner"></div></div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
  loadGoals();
}

async function loadGoals() {
  try {
    const result = await api.get('/goals?status=all');
    const grid = document.getElementById('goals-grid');

    if (!result.success || result.data.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">🎯</div><div class="empty-state-title">No goals yet</div><div class="empty-state-text">Set your first goal and start making progress!</div><button class="btn btn-primary" onclick="openAddGoalModal()">Create Goal</button></div>`;
      return;
    }

    grid.innerHTML = result.data.map(goal => {
      const days = getDaysRemaining(goal.target_date);
      const statusColor = goal.status === 'completed' ? 'var(--color-success)' : days < 0 ? 'var(--color-danger)' : goal.color;
      return `
        <div class="card" style="border-top: 4px solid ${statusColor};">
          <div class="card-body">
            <div class="flex-between mb-md">
              <div>
                <h4>${goal.title}</h4>
                <span class="badge badge-${goal.status === 'completed' ? 'success' : goal.status === 'abandoned' ? 'danger' : 'primary'}">${capitalize(goal.status)}</span>
              </div>
              <span class="badge ${days < 0 ? 'badge-danger' : days < 7 ? 'badge-warning' : 'badge-info'}">${goal.status === 'completed' ? 'Done!' : days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}</span>
            </div>
            ${goal.description ? `<p class="text-sm text-muted mb-md">${truncate(goal.description, 100)}</p>` : ''}
            <div class="flex-between text-sm mb-sm">
              <span>Progress</span>
              <span class="font-bold">${goal.progress_percent}%</span>
            </div>
            <div class="progress-bar mb-md">
              <div class="progress-fill" style="width: ${goal.progress_percent}%; background: ${goal.color};"></div>
            </div>
            <div class="flex-between">
              <span class="text-xs text-muted">Target: ${formatDate(goal.target_date)}</span>
              <div class="flex gap-sm">
                ${goal.status === 'active' ? `<button class="btn btn-sm btn-secondary" onclick="openProgressModal('${goal._id}', ${goal.progress_percent})">Update</button>` : ''}
                <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteGoal('${goal._id}', '${goal.title}')" aria-label="Delete goal"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
    if (window.lucide) lucide.createIcons();
  } catch (error) {
    showToast(error.message || 'Failed to load goals.', 'error');
  }
}

function openAddGoalModal() {
  const categories = ['health', 'career', 'education', 'personal', 'financial', 'social', 'other'];
  openModal('New Goal', `
    <form id="add-goal-form">
      <div class="form-group"><label class="form-label">Goal Title</label><input class="form-input" id="goal-title" placeholder="e.g., Read 12 books this year" required></div>
      <div class="form-group"><label class="form-label">Description</label><textarea class="form-input" id="goal-desc" placeholder="What does success look like?"></textarea></div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Target Date</label><input class="form-input" type="date" id="goal-date" required></div>
        <div class="form-group"><label class="form-label">Category</label><select class="form-input" id="goal-category">${categories.map(c => `<option value="${c}">${capitalize(c)}</option>`).join('')}</select></div>
      </div>
    </form>
  `, `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="submitNewGoal()">Create Goal</button>`);
}

async function submitNewGoal() {
  const title = document.getElementById('goal-title').value.trim();
  const target_date = document.getElementById('goal-date').value;
  if (!title || !target_date) { showToast('Title and date are required.', 'warning'); return; }
  try {
    await api.post('/goals', { title, description: document.getElementById('goal-desc').value, target_date, category: document.getElementById('goal-category').value });
    closeModal(); showToast('Goal created! 🎯', 'success'); loadGoals();
  } catch (error) { showToast(error.message || 'Failed to create goal.', 'error'); }
}

function openProgressModal(id, current) {
  openModal('Update Progress', `
    <div class="form-group"><label class="form-label">Progress (%)</label><input class="form-input" type="range" id="goal-progress" min="0" max="100" value="${current}" oninput="document.getElementById('progress-val').textContent=this.value+'%'"><div class="text-center font-bold mt-sm" id="progress-val">${current}%</div></div>
  `, `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="submitProgress('${id}')">Save</button>`);
}

async function submitProgress(id) {
  try {
    const val = parseInt(document.getElementById('goal-progress').value);
    await api.put(`/goals/${id}/progress`, { progress_percent: val });
    closeModal(); showToast(val >= 100 ? 'Goal completed! 🎉' : 'Progress updated.', 'success'); loadGoals();
  } catch (error) { showToast(error.message || 'Failed to update.', 'error'); }
}

function confirmDeleteGoal(id, title) {
  openModal('Delete Goal', `<p>Delete <strong>"${title}"</strong>?</p>`, `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-danger" onclick="deleteGoalConfirmed('${id}')">Delete</button>`);
}

async function deleteGoalConfirmed(id) {
  try { await api.delete(`/goals/${id}`); closeModal(); showToast('Goal deleted.', 'info'); loadGoals(); } catch (e) { showToast(e.message, 'error'); }
}

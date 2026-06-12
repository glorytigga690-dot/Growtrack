/**
 * GrowTrack — Upgrade / Pricing Page
 */

function renderUpgrade() {
  const user = getCurrentUser();
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="text-center mb-lg animate-in">
      <h2 style="font-family:var(--font-heading);font-weight:800;font-size:var(--text-3xl);">Upgrade Your Plan</h2>
      <p class="text-muted">Unlock unlimited tracking, advanced analytics, and more.</p>
    </div>
    <div class="grid-3" style="max-width:1000px;margin:0 auto;">
      <!-- Free -->
      <div class="card pricing-card animate-in animate-in-delay-1" style="${user.plan==='free'?'border:2px solid var(--color-primary);':''}">
        <div class="card-body" style="padding:var(--space-2xl) var(--space-lg);">
          <div class="text-xs text-muted" style="text-transform:uppercase;letter-spacing:0.1em;">Free</div>
          <div class="pricing-price">$0</div>
          <div class="text-sm text-muted mb-lg">forever</div>
          <div class="feature-list">
            <div class="pricing-feature"><span class="check">✓</span> 3 habits</div>
            <div class="pricing-feature"><span class="check">✓</span> 1 goal</div>
            <div class="pricing-feature"><span class="check">✓</span> Basic mood tracking</div>
            <div class="pricing-feature"><span class="check">✓</span> Weekly reports</div>
            <div class="pricing-feature"><span class="check">✓</span> PWA install</div>
            <div class="pricing-feature"><span class="cross">✕</span> Correlation analytics</div>
            <div class="pricing-feature"><span class="cross">✕</span> PDF export</div>
            <div class="pricing-feature"><span class="cross">✕</span> Monthly reports</div>
          </div>
          <button class="btn btn-secondary" style="width:100%;margin-top:var(--space-lg);" disabled>${user.plan==='free'?'Current Plan':'—'}</button>
        </div>
      </div>
      <!-- Pro -->
      <div class="card pricing-card popular animate-in animate-in-delay-2" style="${user.plan==='pro'?'border:2px solid var(--color-primary);':''}">
        <div class="pricing-badge">POPULAR</div>
        <div class="card-body" style="padding:var(--space-2xl) var(--space-lg);">
          <div class="text-xs text-muted" style="text-transform:uppercase;letter-spacing:0.1em;">Pro</div>
          <div class="pricing-price">$2.99</div>
          <div class="text-sm text-muted mb-lg">/month</div>
          <div class="feature-list">
            <div class="pricing-feature"><span class="check">✓</span> Unlimited habits</div>
            <div class="pricing-feature"><span class="check">✓</span> Unlimited goals</div>
            <div class="pricing-feature"><span class="check">✓</span> Full mood tracking</div>
            <div class="pricing-feature"><span class="check">✓</span> Weekly + Monthly reports</div>
            <div class="pricing-feature"><span class="check">✓</span> Correlation analytics</div>
            <div class="pricing-feature"><span class="check">✓</span> PDF export</div>
            <div class="pricing-feature"><span class="check">✓</span> Priority sync</div>
            <div class="pricing-feature"><span class="check">✓</span> Adaptive scaling</div>
          </div>
          <button class="btn btn-primary" style="width:100%;margin-top:var(--space-lg);" onclick="handleUpgrade('pro')" ${user.plan==='pro'?'disabled':''}  id="upgrade-pro-btn">${user.plan==='pro'?'Current Plan':'Upgrade to Pro'}</button>
        </div>
      </div>
      <!-- Team -->
      <div class="card pricing-card animate-in animate-in-delay-3" style="${user.plan==='team'?'border:2px solid var(--color-primary);':''}">
        <div class="card-body" style="padding:var(--space-2xl) var(--space-lg);">
          <div class="text-xs text-muted" style="text-transform:uppercase;letter-spacing:0.1em;">Team / Edu</div>
          <div class="pricing-price">$4.99</div>
          <div class="text-sm text-muted mb-lg">/user/month</div>
          <div class="feature-list">
            <div class="pricing-feature"><span class="check">✓</span> Everything in Pro</div>
            <div class="pricing-feature"><span class="check">✓</span> Admin dashboard</div>
            <div class="pricing-feature"><span class="check">✓</span> Cohort analytics</div>
            <div class="pricing-feature"><span class="check">✓</span> Bulk import</div>
            <div class="pricing-feature"><span class="check">✓</span> Custom reports</div>
            <div class="pricing-feature"><span class="check">✓</span> Team management</div>
            <div class="pricing-feature"><span class="check">✓</span> Priority support</div>
          </div>
          <button class="btn btn-secondary" style="width:100%;margin-top:var(--space-lg);" onclick="handleUpgrade('team')" ${user.plan==='team'?'disabled':''} id="upgrade-team-btn">${user.plan==='team'?'Current Plan':'Upgrade to Team'}</button>
        </div>
      </div>
    </div>
    <div class="text-center mt-lg animate-in animate-in-delay-4"><p class="text-xs text-muted">🔒 Sandbox mode enabled for demo. No real charges will be made.</p></div>
  `;
}

async function handleUpgrade(plan) {
  try {
    showToast('Processing upgrade...', 'info');
    const result = await api.post('/payments/sandbox-activate', { plan });
    if (result.success) {
      const user = getCurrentUser();
      user.plan = plan;
      storageSet('user', user);
      document.getElementById('user-plan').textContent = `${capitalize(plan)} Plan`;
      showToast(`Upgraded to ${capitalize(plan)}!`, 'success');
      renderUpgrade();
    }
  } catch (e) { showToast(e.message || 'Upgrade failed.', 'error'); }
}

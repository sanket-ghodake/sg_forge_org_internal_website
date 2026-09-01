/**
 * @forge/portal - Viewport-Safe Modals & Action Drawers (2026 LTS)
 * Invite Member modal, Role Editor, Request Tool Access, and PAT Generator.
 */

export function renderPortalModals(): string {
  return `
    <!-- Invite Colleague Modal -->
    <div class="astryx-modal-backdrop" id="modal-invite-member" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="astryx-modal">
        <div class="astryx-modal-header">
          <h3>Invite New Team Member</h3>
          <button class="astryx-modal-close" data-close-modal="modal-invite-member" aria-label="Close modal">
            &times;
          </button>
        </div>
        <div class="astryx-modal-body">
          <div class="form-field">
            <label style="font-size: 0.78rem; font-weight: 600; color: var(--forge-text-muted); margin-bottom: 0.35rem; display: block;">Work Email Address</label>
            <input type="email" class="form-input" id="invite-email" placeholder="colleague@forge.internal" style="width: 100%; box-sizing: border-box;" />
          </div>
          <div class="form-field" style="margin-top: 1rem;">
            <label style="font-size: 0.78rem; font-weight: 600; color: var(--forge-text-muted); margin-bottom: 0.35rem; display: block;">Full Display Name</label>
            <input type="text" class="form-input" id="invite-name" placeholder="e.g. Jane Doe" style="width: 100%; box-sizing: border-box;" />
          </div>
          <div class="form-field" style="margin-top: 1rem;">
            <label style="font-size: 0.78rem; font-weight: 600; color: var(--forge-text-muted); margin-bottom: 0.35rem; display: block;">Organizational Division</label>
            <select class="astryx-select" id="invite-division" style="width: 100%; box-sizing: border-box;">
              <option value="Engineering">Engineering & Platform</option>
              <option value="Product">Product & Design</option>
              <option value="Finance">Finance & Operations</option>
              <option value="HR">People & HR Ops</option>
            </select>
          </div>
          <div class="form-field" style="margin-top: 1rem;">
            <label style="font-size: 0.78rem; font-weight: 600; color: var(--forge-text-muted); margin-bottom: 0.35rem; display: block;">Initial IAM Role</label>
            <select class="astryx-select" id="invite-role" style="width: 100%; box-sizing: border-box;">
              <option value="roles/employee">Standard Employee (Self-Service)</option>
              <option value="roles/manager">Department Lead / Manager</option>
              <option value="roles/admin">Organization Admin</option>
            </select>
          </div>
        </div>
        <div class="astryx-modal-footer">
          <button class="astryx-btn btn-ghost" data-close-modal="modal-invite-member">Cancel</button>
          <button class="astryx-btn btn-primary" id="confirm-invite-btn">Send Invitation</button>
        </div>
      </div>
    </div>

    <!-- Request Tool Access Modal -->
    <div class="astryx-modal-backdrop" id="modal-request-access" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="astryx-modal">
        <div class="astryx-modal-header">
          <h3>Request Application Access</h3>
          <button class="astryx-modal-close" data-close-modal="modal-request-access" aria-label="Close modal">
            &times;
          </button>
        </div>
        <div class="astryx-modal-body">
          <p style="font-size: 0.84rem; color: var(--forge-text-muted); margin-top: 0;">
            You are requesting access to <strong id="req-access-app-name" style="color: var(--forge-text-main);">Enterprise App</strong>.
          </p>
          <div class="form-field" style="margin-top: 1rem;">
            <label style="font-size: 0.78rem; font-weight: 600; color: var(--forge-text-muted); margin-bottom: 0.35rem; display: block;">Business Justification</label>
            <textarea class="form-input" id="req-access-reason" rows="3" placeholder="Briefly describe why you require access to this workspace tool..." style="width: 100%; height: auto; box-sizing: border-box;"></textarea>
          </div>
        </div>
        <div class="astryx-modal-footer">
          <button class="astryx-btn btn-ghost" data-close-modal="modal-request-access">Cancel</button>
          <button class="astryx-btn btn-primary" id="submit-access-req-btn">Submit Request</button>
        </div>
      </div>
    </div>
  `;
}

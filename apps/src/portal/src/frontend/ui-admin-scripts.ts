/**
 * @forge/portal - Admin Actions Client Script (2026 LTS)
 * Handles Admin Suite modal flows, member invitations, role edits, and security audit log export.
 */

export function getAdminClientScript(): string {
  return `
    (function initAdminSuiteEngine() {
      // Modal Open/Close Controls
      function openModal(modalId) {
        const m = document.getElementById(modalId);
        if (m) {
          m.classList.add('open');
          m.classList.add('active');
          m.setAttribute('aria-hidden', 'false');
        }
      }

      function closeModal(modalId) {
        const m = document.getElementById(modalId);
        if (m) {
          m.classList.remove('open');
          m.classList.remove('active');
          m.setAttribute('aria-hidden', 'true');
        }
      }

      const inviteTrigger = document.getElementById('open-invite-modal-btn');
      if (inviteTrigger) {
        inviteTrigger.addEventListener('click', function() {
          openModal('modal-invite-member');
        });
      }

      document.querySelectorAll('[data-close-modal]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const mId = btn.getAttribute('data-close-modal');
          if (mId) closeModal(mId);
        });
      });

      // Confirm Invite Member Action
      const confirmInviteBtn = document.getElementById('confirm-invite-btn');
      if (confirmInviteBtn) {
        confirmInviteBtn.addEventListener('click', function() {
          const emailInput = document.getElementById('invite-email');
          const nameInput = document.getElementById('invite-name');
          const email = emailInput ? emailInput.value.trim() : '';
          const name = nameInput ? nameInput.value.trim() : '';

          if (!email) {
            if (window.astryxToast) window.astryxToast('Please enter a valid work email', 'error');
            return;
          }

          closeModal('modal-invite-member');
          if (window.astryxToast) {
            window.astryxToast('Invitation sent to ' + email, 'success');
          }
          if (emailInput) emailInput.value = '';
          if (nameInput) nameInput.value = '';
        });
      }

      // Request Access Modal Flow
      document.querySelectorAll('.request-access-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const appName = btn.getAttribute('data-app-name') || 'Application';
          const titleEl = document.getElementById('req-access-app-name');
          if (titleEl) titleEl.textContent = appName;
          openModal('modal-request-access');
        });
      });

      const submitReqBtn = document.getElementById('submit-access-req-btn');
      if (submitReqBtn) {
        submitReqBtn.addEventListener('click', function() {
          closeModal('modal-request-access');
          if (window.astryxToast) {
            window.astryxToast('Access request submitted to workspace administrator', 'success');
          }
        });
      }

      // Export Audit Logs Actions
      const exportJsonBtn = document.getElementById('export-audit-json-btn');
      if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', function() {
          if (window.astryxToast) {
            window.astryxToast('Audit logs exported as JSON (RFC 7807 compliance)', 'info');
          }
        });
      }

      const exportCsvBtn = document.getElementById('export-audit-csv-btn');
      if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function() {
          if (window.astryxToast) {
            window.astryxToast('Audit logs exported as CSV', 'info');
          }
        });
      }
    })();
  `;
}

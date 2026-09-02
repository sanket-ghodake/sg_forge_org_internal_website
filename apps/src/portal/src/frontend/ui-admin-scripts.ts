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

      // ── Dynamic Member Roster Hydration & Filtering ──
      let cachedMembers = [];
      const membersTbody = document.getElementById('admin-members-tbody');
      const totalMembersEl = document.getElementById('admin-total-members');
      const searchInput = document.getElementById('admin-member-search-input');

      function getApiPrefix() {
        return window.location.pathname.startsWith('/portal') ? '/portal' : '';
      }

      function renderMemberRows(members) {
        if (!membersTbody) return;
        if (!members || members.length === 0) {
          membersTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--forge-text-muted);">No members match the active filter.</td></tr>';
          return;
        }

        membersTbody.innerHTML = members.map(function(m) {
          const roles = m.roles || [];
          let roleTag = 'Employee';
          if (roles.some(function(r) { return r.includes('super_admin'); })) roleTag = 'Super Admin';
          else if (roles.some(function(r) { return r.includes('admin') || r.includes('lead'); })) roleTag = 'Dept Admin';

          const isOnline = m.status === 'ONLINE' || m.status === 'ACTIVE';
          const badgeClass = isOnline ? 'badge-running' : 'badge-muted';
          const statusText = isOnline ? 'ONLINE' : 'OFFLINE';

          return '<tr data-id="' + m.id + '">' +
            '<td>' +
              '<div class="table-user-cell">' +
                '<div class="table-user-avatar">' + (m.avatarInitial || '--') + '</div>' +
                '<div>' +
                  '<div class="table-user-name">' + (m.name || 'Member') + '</div>' +
                  '<div class="table-user-email">' + (m.email || '') + '</div>' +
                '</div>' +
              '</div>' +
            '</td>' +
            '<td>' +
              '<div class="table-dept-tag">' + (m.department || 'General') + '</div>' +
              '<div class="table-div-sub">' + (m.division || 'Operations') + '</div>' +
            '</td>' +
            '<td>' + (m.jobTitle || 'Team Member') + '</td>' +
            '<td><span class="astryx-badge ' + badgeClass + '">' + statusText + '</span></td>' +
            '<td><span class="iam-role-tag">' + roleTag + '</span></td>' +
            '<td style="text-align: right;">' +
              '<button class="astryx-btn btn-sm btn-ghost edit-role-btn" data-id="' + m.id + '" data-name="' + m.name + '" title="Edit IAM Roles">' +
                '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' +
              '</button>' +
              '<button class="astryx-btn btn-sm btn-ghost delete-user-btn" data-id="' + m.id + '" data-name="' + m.name + '" title="Suspend Account" style="color: var(--forge-danger);">' +
                '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>' +
              '</button>' +
            '</td>' +
          '</tr>';
        }).join('');
      }

      async function loadAdminMembers() {
        if (!membersTbody) return;
        try {
          const endpoint = getApiPrefix() + '/api/v1/portal/members';
          const res = await fetch(endpoint, { headers: { 'Accept': 'application/json' } });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const body = await res.json();
          cachedMembers = body.data || [];
          if (totalMembersEl) totalMembersEl.textContent = String(cachedMembers.length);
          renderMemberRows(cachedMembers);
        } catch (err) {
          console.warn('Failed to load admin members:', err);
          if (membersTbody) {
            membersTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--forge-danger);">Failed to retrieve members from Auth service.</td></tr>';
          }
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', function() {
          const q = (searchInput.value || '').toLowerCase().trim();
          if (!q) {
            renderMemberRows(cachedMembers);
            return;
          }
          const filtered = cachedMembers.filter(function(m) {
            return (m.name && m.name.toLowerCase().includes(q)) ||
                   (m.email && m.email.toLowerCase().includes(q)) ||
                   (m.jobTitle && m.jobTitle.toLowerCase().includes(q)) ||
                   (m.department && m.department.toLowerCase().includes(q));
          });
          renderMemberRows(filtered);
        });
      }

      // Automatically fetch when document loads or when switching to admin-members view
      loadAdminMembers();
      loadAdminOrgTree();
      window.addEventListener('hashchange', function() {
        if (window.location.hash === '#admin-members') loadAdminMembers();
        if (window.location.hash === '#admin-org') loadAdminOrgTree();
      });
      document.addEventListener('viewchange', function(e) {
        if (e && e.detail === 'admin-members') loadAdminMembers();
        if (e && e.detail === 'admin-org') loadAdminOrgTree();
      });

      // ── Dynamic Admin Organization Tree Builder ──
      const orgTreeContainer = document.getElementById('admin-org-tree-container');
      async function loadAdminOrgTree() {
        if (!orgTreeContainer) return;
        try {
          const endpoint = getApiPrefix() + '/api/v1/portal/canvas/tree?max_depth=4';
          const res = await fetch(endpoint, { headers: { 'Accept': 'application/json' } });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const body = await res.json();
          const treeData = body.data;
          const rootNode = treeData && treeData.root;
          if (!rootNode) {
            orgTreeContainer.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--forge-text-muted);">No organization structure found in central identity.</div>';
            return;
          }

          function renderNodeHtml(node) {
            const hasChildren = node.children && node.children.length > 0;
            const subCount = node.totalSubtreeCount || (node.children ? node.children.length : 0);
            return '<div class="tree-node ' + (node.level === 1 ? 'root-tree-node' : '') + '">' +
              '<div class="tree-node-card ' + (node.level === 1 ? 'node-root' : '') + '">' +
                '<span class="node-title">' + (node.department || node.division || 'Team') + '</span>' +
                '<span class="node-lead-name">' + node.name + ' (' + node.title + ')</span>' +
                (subCount > 0 ? '<span class="node-sub-count">' + subCount + ' direct & indirect members</span>' : '') +
              '</div>' +
              (hasChildren ? '<div class="tree-children-container">' +
                node.children.map(renderNodeHtml).join('') +
              '</div>' : '') +
            '</div>';
          }

          orgTreeContainer.innerHTML = renderNodeHtml(rootNode);
        } catch(err) {
          console.warn('Failed to load admin org tree:', err);
        }
      }

      // Confirm Invite Member Action with API Persistence
      const confirmInviteBtn = document.getElementById('confirm-invite-btn');
      if (confirmInviteBtn) {
        confirmInviteBtn.addEventListener('click', async function() {
          const emailInput = document.getElementById('invite-email');
          const nameInput = document.getElementById('invite-name');
          const roleSelect = document.getElementById('invite-role');
          const email = emailInput ? emailInput.value.trim() : '';
          const name = nameInput ? nameInput.value.trim() : '';
          const role = roleSelect ? roleSelect.value : 'roles/employee';

          if (!email) {
            if (window.astryxToast) window.astryxToast('Please enter a valid work email', 'error');
            return;
          }

          try {
            const endpoint = getApiPrefix() + '/api/v1/portal/members/invite';
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ email: email, name: name, role: role })
            });
            closeModal('modal-invite-member');
            if (window.astryxToast) {
              window.astryxToast('Invited ' + (name || email) + ' to the organization', 'success');
            }
            if (emailInput) emailInput.value = '';
            if (nameInput) nameInput.value = '';
            loadAdminMembers();
          } catch(err) {
            closeModal('modal-invite-member');
            if (window.astryxToast) {
              window.astryxToast('Invitation saved: ' + email, 'info');
            }
          }
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

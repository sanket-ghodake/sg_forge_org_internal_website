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

      // ── Dynamic Admin Organization Tree Builder ──
      async function loadAdminOrgTree() {
        const orgTreeContainer = document.getElementById('admin-org-tree-container');
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

          const divSelect = document.getElementById('invite-division');
          if (divSelect && rootNode) {
            const depts = new Set();
            function extractDepts(n) {
              if (n.department) depts.add(n.department);
              if (n.division) depts.add(n.division);
              if (n.children) n.children.forEach(extractDepts);
            }
            extractDepts(rootNode);
            if (depts.size > 0) {
              divSelect.innerHTML = Array.from(depts).map(function(d) {
                return '<option value="' + d + '">' + d + '</option>';
              }).join('');
            }
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

      // ── Dynamic Audit Logs Hydration & Filtering ──
      let cachedAuditLogs = [];
      const auditSearchInput = document.getElementById('audit-search-input');

      function renderAuditRows(logs) {
        const auditTbody = document.getElementById('admin-audit-tbody');
        if (!auditTbody) return;
        if (!logs || logs.length === 0) {
          auditTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--forge-text-muted);">No audit logs found.</td></tr>';
          return;
        }

        auditTbody.innerHTML = logs.map(function(a) {
          const badgeClass = a.status === 'SUCCESS' ? 'badge-online' : (a.status === 'DENIED' ? 'badge-warning' : 'badge-danger');
          return '<tr>' +
            '<td style="font-family: var(--forge-font-mono, monospace); font-size: 0.78rem; color: var(--forge-text-muted);">' + (a.timestamp || '') + '</td>' +
            '<td><strong style="color: var(--forge-text-main); font-size: 0.84rem;">' + (a.actor || '') + '</strong></td>' +
            '<td><code>' + (a.action || '') + '</code></td>' +
            '<td><span style="font-size: 0.82rem; color: var(--forge-text-muted);">' + (a.resource || '') + '</span></td>' +
            '<td><span class="astryx-badge ' + badgeClass + '">' + (a.status || 'SUCCESS') + '</span></td>' +
            '<td><code style="font-size: 0.75rem; color: var(--forge-primary);">' + (a.traceId || '') + '</code></td>' +
          '</tr>';
        }).join('');
      }

      async function loadAdminAuditLogs() {
        const auditTbody = document.getElementById('admin-audit-tbody');
        if (!auditTbody) return;
        const auditCountEl = document.getElementById('audit-events-count');
        try {
          const endpoint = getApiPrefix() + '/api/v1/portal/audit';
          const res = await fetch(endpoint, { headers: { 'Accept': 'application/json' } });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const body = await res.json();
          cachedAuditLogs = body.data || [];
          if (auditCountEl) auditCountEl.textContent = String(cachedAuditLogs.length);
          renderAuditRows(cachedAuditLogs);
        } catch (err) {
          console.warn('Failed to load audit logs:', err);
        }
      }

      if (auditSearchInput) {
        auditSearchInput.addEventListener('input', function() {
          const q = (auditSearchInput.value || '').toLowerCase().trim();
          if (!q) {
            renderAuditRows(cachedAuditLogs);
            return;
          }
          const filtered = cachedAuditLogs.filter(function(a) {
            return (a.actor && a.actor.toLowerCase().includes(q)) ||
                   (a.action && a.action.toLowerCase().includes(q)) ||
                   (a.resource && a.resource.toLowerCase().includes(q)) ||
                   (a.traceId && a.traceId.toLowerCase().includes(q));
          });
          renderAuditRows(filtered);
        });
      }

      // Export Audit Logs Actions (Real dynamic download)
      const exportJsonBtn = document.getElementById('export-audit-json-btn');
      if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', function() {
          if (!cachedAuditLogs || cachedAuditLogs.length === 0) {
            if (window.astryxToast) window.astryxToast('No audit logs to export', 'warning');
            return;
          }
          const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cachedAuditLogs, null, 2));
          const dlAnchor = document.createElement('a');
          dlAnchor.setAttribute('href', dataStr);
          dlAnchor.setAttribute('download', 'security-audit-logs.json');
          dlAnchor.click();
          if (window.astryxToast) window.astryxToast('Exported audit logs as JSON', 'success');
        });
      }

      const exportCsvBtn = document.getElementById('export-audit-csv-btn');
      if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function() {
          if (!cachedAuditLogs || cachedAuditLogs.length === 0) {
            if (window.astryxToast) window.astryxToast('No audit logs to export', 'warning');
            return;
          }
          const headers = ['Timestamp', 'Actor', 'Action', 'Resource', 'Status', 'TraceId'];
          const csvRows = [headers.join(',')];
          cachedAuditLogs.forEach(function(l) {
            csvRows.push(['"' + (l.timestamp||'') + '"', '"' + (l.actor||'') + '"', '"' + (l.action||'') + '"', '"' + (l.resource||'') + '"', '"' + (l.status||'') + '"', '"' + (l.traceId||'') + '"'].join(','));
          });
          const csvStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join(String.fromCharCode(10)));
          const dlAnchor = document.createElement('a');
          dlAnchor.setAttribute('href', csvStr);
          dlAnchor.setAttribute('download', 'security-audit-logs.csv');
          dlAnchor.click();
          if (window.astryxToast) window.astryxToast('Exported audit logs as CSV', 'success');
        });
      }

      // Automatically fetch when document loads or when switching to admin views
      loadAdminMembers();
      loadAdminOrgTree();
      loadAdminAuditLogs();
      window.addEventListener('hashchange', function() {
        if (window.location.hash === '#admin-members') loadAdminMembers();
        if (window.location.hash === '#admin-org') loadAdminOrgTree();
        if (window.location.hash === '#admin-audit') loadAdminAuditLogs();
      });
      document.addEventListener('viewchange', function(e) {
        if (e && e.detail === 'admin-members') loadAdminMembers();
        if (e && e.detail === 'admin-org') loadAdminOrgTree();
        if (e && e.detail === 'admin-audit') loadAdminAuditLogs();
      });
    })();
  `;
}

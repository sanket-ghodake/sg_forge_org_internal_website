/**
 * @forge/dev-dashboard - Employee Flyout & Hierarchy Modal Handlers (2026 LTS)
 * Meta Astryx Form Processing, Validation, and Scoped Hierarchy Rendering.
 */

export function getEmployeeModalScripts(): string {
  return `
    function openAddEmployeeModal() {
      const modal = document.getElementById('modal-employee-flyout');
      if (!modal) return;

      document.getElementById('modal-employee-title').textContent = '➕ Add New Employee Profile';
      document.getElementById('emp-form-id').value = '';
      document.getElementById('emp-form-name').value = '';
      const emailInput = document.getElementById('emp-form-email');
      if (emailInput) {
        emailInput.value = '';
        emailInput.removeAttribute('disabled');
      }
      document.getElementById('emp-form-title').value = '';
      document.getElementById('emp-form-code').value = '';
      document.getElementById('emp-form-dept').value = '';
      document.getElementById('emp-form-role').value = 'roles/employee';
      document.getElementById('emp-form-status').value = 'ACTIVE';

      const mgrSelect = document.getElementById('emp-form-manager');
      if (mgrSelect) {
        let opts = '<option value="">(None / Top Level)</option>';
        for (const e of (employeeData.items || [])) {
          opts += '<option value="' + e.id + '">' + (e.display_name || 'Unnamed') + ' (' + (e.job_title || 'Employee') + ')</option>';
        }
        mgrSelect.innerHTML = opts;
      }

      modal.classList.add('open');
      modal.style.display = 'flex';
    }

    function openEditEmployeeModal(userId) {
      const modal = document.getElementById('modal-employee-flyout');
      if (!modal) return;

      const emp = (employeeData.items || []).find(i => i.id === userId);
      if (!emp) return;

      document.getElementById('modal-employee-title').textContent = '✏️ Edit Profile: ' + (emp.display_name || '');
      document.getElementById('emp-form-id').value = emp.id;
      document.getElementById('emp-form-name').value = emp.display_name || '';
      const emailInput = document.getElementById('emp-form-email');
      if (emailInput) {
        emailInput.value = emp.email || '';
        emailInput.setAttribute('disabled', 'true');
      }
      document.getElementById('emp-form-title').value = emp.job_title || '';
      document.getElementById('emp-form-code').value = emp.employee_code || '';
      document.getElementById('emp-form-dept').value = emp.org_node_id || '';
      document.getElementById('emp-form-role').value = (emp.roles && emp.roles[0]) || 'roles/employee';
      document.getElementById('emp-form-status').value = emp.status || 'ACTIVE';

      const mgrSelect = document.getElementById('emp-form-manager');
      if (mgrSelect) {
        let opts = '<option value="">(None / Top Level)</option>';
        for (const e of (employeeData.items || [])) {
          if (e.id !== userId) {
            const sel = e.id === emp.manager_id ? ' selected' : '';
            opts += '<option value="' + e.id + '"' + sel + '>' + (e.display_name || 'Unnamed') + ' (' + (e.job_title || 'Employee') + ')</option>';
          }
        }
        mgrSelect.innerHTML = opts;
      }

      modal.classList.add('open');
      modal.style.display = 'flex';
    }

    function closeEmployeeModal() {
      const modal = document.getElementById('modal-employee-flyout');
      if (modal) {
        modal.classList.remove('open');
        modal.style.display = 'none';
      }
      const emailInput = document.getElementById('emp-form-email');
      if (emailInput) emailInput.removeAttribute('disabled');
    }

    async function saveEmployeeForm(event) {
      if (event) event.preventDefault();
      const id = document.getElementById('emp-form-id').value;
      const name = document.getElementById('emp-form-name').value.trim();
      const email = document.getElementById('emp-form-email').value.trim();
      const title = document.getElementById('emp-form-title').value.trim();
      const code = document.getElementById('emp-form-code').value.trim();
      const deptId = document.getElementById('emp-form-dept').value || null;
      const managerId = document.getElementById('emp-form-manager').value || null;
      const role = document.getElementById('emp-form-role').value;
      const status = document.getElementById('emp-form-status').value;

      try {
        if (!id) {
          const res = await fetch(\`\${apiBase}/api/employees\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              display_name: name,
              email,
              job_title: title,
              employee_code: code,
              department_id: deptId,
              manager_id: managerId,
              role,
              status,
            }),
          });
          const json = await res.json();
          if (json.status !== 'ok') throw new Error(json.error || 'Failed to create employee');
          showAstryxToast('success', 'Created employee "' + name + '" successfully');
        } else {
          const res = await fetch(\`\${apiBase}/api/employees/update\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id,
              display_name: name,
              job_title: title,
              employee_code: code,
              department_id: deptId,
              manager_id: managerId,
              role,
              status,
            }),
          });
          const json = await res.json();
          if (json.status !== 'ok') throw new Error(json.error || 'Failed to update employee');
          showAstryxToast('success', 'Updated employee "' + name + '" successfully');
        }
        closeEmployeeModal();
        loadEmployees();
      } catch (err) {
        showAstryxToast('error', err.message);
      }
    }

    async function revokeEmployeeSessions(userId) {
      const emp = (employeeData.items || []).find(i => i.id === userId);
      const name = emp ? emp.display_name : 'Employee';
      try {
        const res = await fetch(\`\${apiBase}/api/employees/revoke\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId }),
        });
        const json = await res.json();
        if (json.status !== 'ok') throw new Error(json.error || 'Revocation failed');
        showAstryxToast('success', 'Active sessions revoked for "' + name + '"');
        loadEmployees();
      } catch (err) {
        showAstryxToast('error', err.message);
      }
    }

    async function openHierarchyModal(userId) {
      const modal = document.getElementById('modal-hierarchy-view');
      const container = document.getElementById('hierarchy-content-box');
      if (!modal || !container) return;

      modal.classList.add('open');
      modal.style.display = 'flex';
      container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--forge-text-muted);">Loading reporting hierarchy...</div>';

      try {
        const res = await fetch(\`\${apiBase}/api/employees/hierarchy?userId=\${encodeURIComponent(userId)}\`);
        const json = await res.json();
        if (json.status !== 'ok') throw new Error(json.error || 'Failed to fetch hierarchy');

        let html = '<div class="hierarchy-chain">';
        if (json.managementChain && json.managementChain.length > 0) {
          json.managementChain.forEach((m, idx) => {
            html += '<div class="hierarchy-node" style="border-left: 3px solid var(--forge-primary);">' +
              '<div class="hierarchy-level">Level ' + (idx + 1) + ' Manager</div>' +
              '<div style="font-weight: 700; color: var(--forge-text-main); font-size: 0.88rem;">' + m.display_name + '</div>' +
              '<div style="font-size: 0.72rem; color: var(--forge-text-muted);">' + m.job_title + ' • ' + m.email + '</div>' +
              '</div><div class="hierarchy-arrow">↓</div>';
          });
        }
        html += '<div class="hierarchy-node" style="border: 2px solid var(--forge-primary); background: rgba(62, 207, 142, 0.08);">' +
          '<div class="hierarchy-level" style="color: var(--forge-primary);">★ Target Employee</div>' +
          '<div style="font-weight: 700; color: var(--forge-text-main); font-size: 0.92rem;">' + json.user.display_name + '</div>' +
          '<div style="font-size: 0.75rem; color: var(--forge-text-muted);">' + (json.user.job_title || 'Employee') + ' • ' + json.user.email + '</div>' +
          '</div>';

        if (json.directReports && json.directReports.length > 0) {
          html += '<div class="hierarchy-arrow">↓</div><div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--forge-text-muted); margin: 0.25rem 0;">Direct Reports (' + json.directReports.length + ')</div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; width: 100%;">';
          json.directReports.forEach(r => {
            html += '<div class="hierarchy-report-card"><div style="font-weight: 600; font-size: 0.8rem;">' + r.display_name + '</div><div style="font-size: 0.7rem; color: var(--forge-text-muted);">' + (r.job_title || 'Employee') + '</div></div>';
          });
          html += '</div>';
        }
        html += '</div>';
        container.innerHTML = html;
      } catch (err) {
        container.innerHTML = '<div style="padding: 1.5rem; color: var(--forge-accent); text-align: center;">' + err.message + '</div>';
      }
    }

    function closeHierarchyModal() {
      const modal = document.getElementById('modal-hierarchy-view');
      if (modal) {
        modal.classList.remove('open');
        modal.style.display = 'none';
      }
    }
  `;
}

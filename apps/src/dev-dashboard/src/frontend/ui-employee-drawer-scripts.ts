/**
 * @forge/dev-dashboard - MS Teams-Inspired Interactive Org Chart & Drawer Scripts (2026 LTS)
 * Executive Lineage, Focused Hero Person, Direct Reports Grid, and Slide-Over Profile Inspector.
 */

export function getEmployeeDrawerAndTreeScripts(): string {
  return `
    /* MS Teams-Inspired Interactive Org Chart */
    let focusedEmployeeId = null;

    async function loadOrgChartTree() {
      const container = document.getElementById('org-chart-container');
      if (!container) return;

      const items = employeeData.items || [];
      if (items.length === 0) {
        container.innerHTML = '<div style="padding: 2.5rem; text-align: center; color: var(--forge-text-muted);">No employee records found in organization.</div>';
        return;
      }

      // If no employee focused, focus the top leader (or first person without manager, or first item)
      if (!focusedEmployeeId || !items.find(i => i.id === focusedEmployeeId)) {
        const topLeader = items.find(i => !i.manager_id) || items[0];
        focusedEmployeeId = topLeader ? topLeader.id : null;
      }

      renderMsTeamsOrgChart();
    }

    function setOrgFocus(userId) {
      focusedEmployeeId = userId;
      renderMsTeamsOrgChart();
      const container = document.getElementById('tab-employees');
      if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderMsTeamsOrgChart() {
      const container = document.getElementById('org-chart-container');
      if (!container) return;

      const items = employeeData.items || [];
      const focused = items.find(i => i.id === focusedEmployeeId) || items[0];
      if (!focused) {
        container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--forge-text-muted);">Select an employee to explore org chart.</div>';
        return;
      }

      // Build Manager Chain (Breadcrumbs & Manager Node)
      const chain = [];
      let curr = focused;
      const visited = new Set([curr.id]);
      while (curr && curr.manager_id && !visited.has(curr.manager_id)) {
        const mgr = items.find(i => i.id === curr.manager_id);
        if (mgr) {
          chain.unshift(mgr);
          visited.add(mgr.id);
          curr = mgr;
        } else {
          break;
        }
      }

      // Manager Node (Direct manager above)
      const directManager = focused.manager_id ? items.find(i => i.id === focused.manager_id) : null;

      // Direct Reports (Employees who report to focused person)
      const directReports = items.filter(i => i.manager_id === focused.id);

      // Breadcrumb HTML
      let breadcrumbsHtml = '<div class="teams-org-breadcrumbs">' +
        '<span class="teams-breadcrumb-item" onclick="jumpToTopLeader()">🏢 Organization Root</span>';
      chain.forEach(mgr => {
        breadcrumbsHtml += ' <span>/</span> <span class="teams-breadcrumb-item" onclick="setOrgFocus(\\\'' + mgr.id + '\\\')">' + (mgr.display_name || 'Manager') + '</span>';
      });
      breadcrumbsHtml += ' <span>/</span> <span class="teams-breadcrumb-current">' + (focused.display_name || 'Employee') + '</span></div>';

      // Toolbar HTML with Quick Search Jump
      let searchOpts = items.map(i => '<option value="' + i.id + '" ' + (i.id === focused.id ? 'selected' : '') + '>' + (i.display_name || 'Unnamed') + ' (' + (i.job_title || 'Employee') + ')</option>').join('');
      let toolbarHtml = '<div class="teams-org-toolbar">' +
        breadcrumbsHtml +
        '<div style="display: flex; gap: 0.5rem; align-items: center;">' +
          '<span style="font-size: 0.76rem; color: var(--forge-text-muted);">Jump to:</span>' +
          '<select class="form-input" style="max-width: 240px;" onchange="setOrgFocus(this.value)">' + searchOpts + '</select>' +
          '<button class="astryx-btn btn-outline" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" onclick="jumpToTopLeader()">🏠 Top Level</button>' +
        '</div>' +
      '</div>';

      // Manager Node HTML
      let managerNodeHtml = '';
      if (directManager) {
        const mgrInitials = (directManager.display_name || 'MG').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        managerNodeHtml = '<div style="display: flex; flex-direction: column; align-items: center;">' +
          '<div class="teams-manager-node" onclick="setOrgFocus(\\\'' + directManager.id + '\\\')" title="Click to focus manager">' +
            '<div class="emp-avatar">' + mgrInitials + '</div>' +
            '<div style="flex: 1; min-width: 0;">' +
              '<div class="teams-manager-role">Reporting Manager</div>' +
              '<div class="teams-manager-name">' + (directManager.display_name || 'Manager') + '</div>' +
            '</div>' +
            '<span style="font-size: 0.75rem; color: var(--forge-primary);">↑ Focus</span>' +
          '</div>' +
          '<div class="teams-connector-vertical"></div>' +
        '</div>';
      }

      // Focused Hero Card HTML
      const heroInitials = (focused.display_name || 'EM').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const heroCardHtml = '<div class="teams-hero-card">' +
        '<div class="teams-hero-header">' +
          '<div class="emp-avatar hero">' + heroInitials + '</div>' +
          '<div style="flex: 1; min-width: 0;">' +
            '<div class="teams-hero-name">' + (focused.display_name || 'Employee') + '</div>' +
            '<div class="teams-hero-title">' + (focused.job_title || 'No Title Assigned') + '</div>' +
            '<div class="teams-hero-meta">' +
              '<span>🏛️ ' + (focused.department_name || 'Unassigned') + '</span>' +
              '<span>✉️ ' + (focused.email || 'N/A') + '</span>' +
              '<span>🏷️ ' + (focused.employee_code || 'N/A') + '</span>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<button class="astryx-btn btn-outline" style="font-size: 0.72rem; padding: 0.25rem 0.55rem;" onclick="openEditEmployeeModal(\\\'' + focused.id + '\\\')">✏️ Edit Profile</button>' +
          '</div>' +
        '</div>' +
      '</div>';

      // Direct Reports Section HTML
      let reportsSectionHtml = '';
      if (directReports.length > 0) {
        const reportCardsHtml = directReports.map(rep => {
          const repInitials = (rep.display_name || 'EM').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
          const subReportsCount = items.filter(i => i.manager_id === rep.id).length;
          return '<div class="teams-report-card" onclick="setOrgFocus(\\\'' + rep.id + '\\\')">' +
            '<div class="teams-report-header">' +
              '<div class="emp-avatar">' + repInitials + '</div>' +
              '<div style="flex: 1; min-width: 0;">' +
                '<div class="teams-report-name">' + (rep.display_name || 'Unnamed') + '</div>' +
                '<div class="teams-report-title">' + (rep.job_title || 'Employee') + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="teams-report-footer">' +
              '<span style="color: var(--forge-text-muted);">🏛️ ' + (rep.department_name || 'General') + '</span>' +
              (subReportsCount > 0
                ? '<button class="astryx-btn btn-outline" style="font-size: 0.68rem; padding: 0.15rem 0.45rem; color: var(--forge-primary); border-color: var(--forge-primary);" onclick="event.stopPropagation(); setOrgFocus(\\\'' + rep.id + '\\\')">👥 ' + subReportsCount + ' Reports ↓</button>'
                : '<span style="color: var(--forge-text-muted); font-size: 0.7rem;">Individual</span>') +
            '</div>' +
          '</div>';
        }).join('');

        reportsSectionHtml = '<div class="teams-connector-vertical"></div>' +
          '<div class="teams-reports-section">' +
            '<div class="teams-branch-header">Direct Reports (' + directReports.length + ')</div>' +
            '<div class="teams-reports-grid">' + reportCardsHtml + '</div>' +
          '</div>';
      } else {
        reportsSectionHtml = '<div style="margin-top: 1.5rem; text-align: center; color: var(--forge-text-muted); font-size: 0.8rem;">' +
          'No direct reports under ' + (focused.display_name || 'this employee') + '.' +
          '<div style="margin-top: 0.5rem;"><button class="astryx-btn btn-outline" style="font-size: 0.75rem;" onclick="openAddReportModal(\\\'' + focused.id + '\\\')">➕ Add Direct Report</button></div>' +
        '</div>';
      }

      container.innerHTML = '<div class="teams-org-container">' + toolbarHtml + managerNodeHtml + heroCardHtml + reportsSectionHtml + '</div>';
      setTimeout(() => {
        if (typeof window.syncAstryxSelects === 'function') window.syncAstryxSelects();
      }, 30);
    }

    function jumpToTopLeader() {
      const items = employeeData.items || [];
      const topLeader = items.find(i => !i.manager_id) || items[0];
      if (topLeader) setOrgFocus(topLeader.id);
    }

    function openAddReportModal(managerId) {
      openAddEmployeeModal();
      const mgrSelect = document.getElementById('emp-form-manager');
      if (mgrSelect) mgrSelect.value = managerId;
    }

    /* Slide-Over Profile Inspector Drawer */
    function openEmployeeDrawer(userId) {
      const emp = (employeeData.items || []).find(i => i.id === userId);
      if (!emp) return;

      activeDrawerEmployee = emp;
      const drawer = document.getElementById('emp-profile-drawer');
      const backdrop = document.getElementById('emp-drawer-backdrop');
      const avatarEl = document.getElementById('drawer-emp-avatar');
      const nameEl = document.getElementById('drawer-emp-name');
      const emailEl = document.getElementById('drawer-emp-email');

      const initials = (emp.display_name || 'EM').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      if (avatarEl) avatarEl.textContent = initials;
      if (nameEl) nameEl.textContent = emp.display_name || 'Unnamed';
      if (emailEl) emailEl.textContent = emp.email;

      switchDrawerTab('overview');
      if (backdrop) backdrop.classList.add('open');
      if (drawer) drawer.classList.add('open');
    }

    function closeEmployeeDrawer() {
      const drawer = document.getElementById('emp-profile-drawer');
      const backdrop = document.getElementById('emp-drawer-backdrop');
      if (backdrop) backdrop.classList.remove('open');
      if (drawer) drawer.classList.remove('open');
    }

    function switchDrawerTab(tab) {
      ['overview', 'roles', 'chain'].forEach(t => {
        const btn = document.getElementById('tab-btn-emp-' + t);
        if (btn) {
          if (t === tab) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });

      const body = document.getElementById('emp-drawer-body');
      if (!body || !activeDrawerEmployee) return;

      const emp = activeDrawerEmployee;

      if (tab === 'overview') {
        body.innerHTML = '<div class="drawer-card">' +
          '<div class="drawer-card-title">Employee Information</div>' +
          '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.8rem;">' +
            '<div><span style="color: var(--forge-text-muted); font-size: 0.7rem; display: block;">JOB TITLE</span><strong>' + (emp.job_title || 'N/A') + '</strong></div>' +
            '<div><span style="color: var(--forge-text-muted); font-size: 0.7rem; display: block;">EMPLOYEE CODE</span><code>' + (emp.employee_code || 'N/A') + '</code></div>' +
            '<div><span style="color: var(--forge-text-muted); font-size: 0.7rem; display: block;">DEPARTMENT</span><strong>' + (emp.department_name || 'Unassigned') + '</strong></div>' +
            '<div><span style="color: var(--forge-text-muted); font-size: 0.7rem; display: block;">STATUS</span><span class="astryx-badge">' + emp.status + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="drawer-card">' +
          '<div class="drawer-card-title">Quick Actions</div>' +
          '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">' +
            '<button class="astryx-btn btn-outline" style="font-size: 0.75rem;" onclick="openEditEmployeeModal(\\\'' + emp.id + '\\\')">✏️ Edit Details</button>' +
            '<button class="astryx-btn btn-outline" style="font-size: 0.75rem;" onclick="setEmployeeViewMode(\\\'tree\\\'); setOrgFocus(\\\'' + emp.id + '\\\'); closeEmployeeDrawer();">🌳 Focus in Org Chart</button>' +
            '<button class="astryx-btn btn-outline" style="font-size: 0.75rem; color: var(--forge-accent); border-color: var(--forge-border);" onclick="revokeEmployeeSessions(\\\'' + emp.id + '\\\')">🔒 Revoke Sessions</button>' +
          '</div>' +
        '</div>';
      } else if (tab === 'roles') {
        const roles = (emp.roles || ['roles/employee']).map(r => '<div style="background: var(--forge-bg-card); border: 1px solid var(--forge-border); padding: 0.6rem; border-radius: var(--forge-radius-sm); font-size: 0.8rem; margin-bottom: 0.4rem;">🔑 <strong>' + r + '</strong><div style="font-size: 0.7rem; color: var(--forge-text-muted); margin-top: 0.2rem;">Scope: org/* | Resource Condition: (None)</div></div>').join('');
        body.innerHTML = '<div class="drawer-card"><div class="drawer-card-title">IAM Policy Bindings</div>' + roles + '</div>';
      } else if (tab === 'chain') {
        body.innerHTML = '<div class="drawer-card"><div class="drawer-card-title">Hierarchy</div>' +
          '<div style="font-size: 0.8rem; color: var(--forge-text-muted); margin-bottom: 0.5rem;">Direct Manager: <strong>' + (emp.manager_name || 'None') + '</strong></div>' +
          '<button class="astryx-btn btn-outline" style="font-size: 0.75rem;" onclick="openHierarchyModal(\\\'' + emp.id + '\\\')">Explore Linear Chain</button>' +
        '</div>';
      }
    }
  `;
}

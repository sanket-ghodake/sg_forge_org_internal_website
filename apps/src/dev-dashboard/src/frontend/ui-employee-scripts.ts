import { getEmployeeImportScripts } from './ui-employee-import-scripts';
import { getEmployeeDrawerAndTreeScripts } from './ui-employee-drawer-scripts';
import { getEmployeeModalScripts } from './ui-employee-modal-scripts';

export function getEmployeeDashboardScripts(): string {
  return `
    let employeeData = { items: [], total: 0, departments: [] };
    let currentEmployeeFilter = { search: '', departmentId: '', status: '' };
    let currentViewMode = 'table';
    let selectedEmployeeIds = new Set();
    let sortDirection = { name: 1, department: 1 };
    let activeDrawerEmployee = null;
    let employeeCurrentPage = 1;
    let employeePageLimit = 25;

    async function loadEmployees() {
      const tbody = document.getElementById('employees-tbody');
      if (!tbody) return;

      const params = new URLSearchParams();
      if (currentEmployeeFilter.search) params.set('search', currentEmployeeFilter.search);
      if (currentEmployeeFilter.departmentId) params.set('departmentId', currentEmployeeFilter.departmentId);
      if (currentEmployeeFilter.status) params.set('status', currentEmployeeFilter.status);

      try {
        const res = await fetch(\`\${apiBase}/api/employees?\${params.toString()}\`);
        const json = await res.json();
        if (json.status !== 'ok') throw new Error(json.error || 'Failed to fetch employees');

        employeeData = json;
        renderEmployeeVitals();
        renderDepartmentDropdown();
        if (currentViewMode === 'table') renderEmployeeTable();
        else loadOrgChartTree();
      } catch (err) {
        if (typeof showAstryxToast === 'function') {
          showAstryxToast('error', 'Error loading employees: ' + err.message);
        }
      }
    }

    function renderEmployeeVitals() {
      const totalEl = document.getElementById('emp-stat-total');
      const activeEl = document.getElementById('emp-stat-active');
      const suspendedEl = document.getElementById('emp-stat-suspended');
      const deptsEl = document.getElementById('emp-stat-depts');

      const items = employeeData.items || [];
      const activeCount = items.filter(i => i.status === 'ACTIVE').length;
      const suspendedCount = items.filter(i => i.status === 'SUSPENDED').length;

      if (totalEl) totalEl.textContent = employeeData.total || items.length;
      if (activeEl) activeEl.textContent = activeCount;
      if (suspendedEl) suspendedEl.textContent = suspendedCount;
      if (deptsEl) deptsEl.textContent = employeeData.departments ? employeeData.departments.length : 0;
    }

    function renderDepartmentDropdown() {
      const select = document.getElementById('emp-dept-filter');
      const modalSelect = document.getElementById('emp-form-dept');
      if (!select || !employeeData.departments) return;

      const currentVal = select.value;
      let opts = '<option value="">All Departments</option>';
      let modalOpts = '<option value="">(No Department Assigned)</option>';

      for (const d of employeeData.departments) {
        const selected = d.id === currentVal ? 'selected' : '';
        opts += '<option value="' + d.id + '" ' + selected + '>' + d.name + ' (' + (d.path || d.code || '') + ')</option>';
        modalOpts += '<option value="' + d.id + '">' + d.name + ' (' + (d.path || d.code || '') + ')</option>';
      }
      select.innerHTML = opts;
      if (modalSelect) modalSelect.innerHTML = modalOpts;
    }

    function setEmployeeViewMode(mode) {
      currentViewMode = mode;
      const btnTable = document.getElementById('btn-view-table');
      const btnTree = document.getElementById('btn-view-tree');
      const tableView = document.getElementById('emp-table-view');
      const treeView = document.getElementById('emp-tree-view');

      if (mode === 'table') {
        if (btnTable) btnTable.classList.add('active');
        if (btnTree) btnTree.classList.remove('active');
        if (tableView) tableView.style.display = 'block';
        if (treeView) treeView.style.display = 'none';
        renderEmployeeTable();
      } else {
        if (btnTable) btnTable.classList.remove('active');
        if (btnTree) btnTree.classList.add('active');
        if (tableView) tableView.style.display = 'none';
        if (treeView) treeView.style.display = 'block';
        loadOrgChartTree();
      }
    }

    function renderEmployeeTable() {
      const tbody = document.getElementById('employees-tbody');
      if (!tbody) return;

      const items = employeeData.items || [];
      const total = items.length;
      const totalPages = Math.max(1, Math.ceil(total / employeePageLimit));
      if (employeeCurrentPage > totalPages) employeeCurrentPage = totalPages;
      if (employeeCurrentPage < 1) employeeCurrentPage = 1;

      const startIndex = (employeeCurrentPage - 1) * employeePageLimit;
      const paginatedItems = items.slice(startIndex, startIndex + employeePageLimit);

      const metricsEl = document.getElementById('emp-footer-metrics');
      const pageIndicator = document.getElementById('emp-page-indicator');
      const prevBtn = document.getElementById('btn-emp-prev');
      const nextBtn = document.getElementById('btn-emp-next');

      if (metricsEl) {
        if (total === 0) metricsEl.textContent = 'Showing 0 of 0 members';
        else metricsEl.textContent = 'Showing ' + (startIndex + 1) + '–' + Math.min(startIndex + paginatedItems.length, total) + ' of ' + total + ' members';
      }
      if (pageIndicator) pageIndicator.textContent = 'Page ' + employeeCurrentPage + ' of ' + totalPages;
      if (prevBtn) prevBtn.disabled = (employeeCurrentPage <= 1);
      if (nextBtn) nextBtn.disabled = (employeeCurrentPage >= totalPages);

      if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--forge-text-muted);"><div style="display: flex; justify-content: center; margin-bottom: 0.5rem; color: var(--forge-text-subtle);"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div><div>No employees match the specified filters.</div><button class="astryx-btn btn-outline" style="margin-top: 0.75rem;" onclick="resetEmployeeFilters()">Reset Filters</button></td></tr>';
        return;
      }

      tbody.innerHTML = paginatedItems.map(emp => {
        const isSuspended = emp.status === 'SUSPENDED';
        const isInvited = emp.status === 'INVITED';
        const isChecked = selectedEmployeeIds.has(emp.id) ? 'checked' : '';
        const statusBadge = isSuspended
          ? '<span class="status-badge" style="background: var(--forge-bg-elevated); color: var(--forge-text-muted); border: 1px solid var(--forge-border);"><span class="status-pulse-dot suspended" style="margin-right:4px;"></span>SUSPENDED</span>'
          : isInvited
          ? '<span class="status-badge" style="background: var(--forge-bg-elevated); color: var(--forge-accent); border: 1px solid var(--forge-border);"><span class="status-pulse-dot invited" style="margin-right:4px;"></span>INVITED</span>'
          : '<span class="status-badge" style="background: var(--forge-success-bg); color: var(--forge-success); border: 1px solid var(--forge-border);"><span class="status-pulse-dot active" style="margin-right:4px;"></span>ACTIVE</span>';

        const rolesList = (emp.roles || ['roles/employee']).map(r => {
          const short = r.replace('roles/', '');
          const isSuper = short.includes('super_admin') || short.includes('admin');
          return '<span class="astryx-badge" style="' + (isSuper ? 'background: var(--forge-bg-card-hover); color: var(--forge-accent); border-color: var(--forge-border-medium);' : '') + '">' + short + '</span>';
        }).join(' ');

        const initials = (emp.display_name || 'EM').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

        return '<tr class="emp-row" data-id="' + emp.id + '" style="cursor: pointer;" onclick="handleEmployeeRowClick(event, this.dataset.id)">' +
          '<td onclick="event.stopPropagation()"><input type="checkbox" ' + isChecked + ' data-emp-id="' + emp.id + '" onchange="toggleEmployeeSelection(this.getAttribute(\\'data-emp-id\\'), this.checked)"></td>' +
          '<td style="width: 260px;">' +
            '<div style="display: flex; align-items: center; gap: 0.65rem;">' +
              '<div class="emp-avatar">' + initials + '</div>' +
              '<div>' +
                '<div style="font-weight: 600; color: var(--forge-text-main); font-size: 0.85rem;">' + (emp.display_name || 'Unnamed') + '</div>' +
                '<div style="color: var(--forge-text-muted); font-size: 0.73rem; font-family: monospace;">' + emp.email + '</div>' +
              '</div>' +
            '</div>' +
          '</td>' +
          '<td>' +
            '<div style="font-size: 0.82rem; font-weight: 500;">' + (emp.department_name || '<span style="color: var(--forge-text-muted); font-style: italic;">Unassigned</span>') + '</div>' +
            '<div style="font-size: 0.7rem; color: var(--forge-text-muted); font-family: monospace;">' + (emp.department_path || '') + '</div>' +
          '</td>' +
          '<td>' +
            '<div style="font-size: 0.82rem;">' + (emp.job_title || 'Employee') + '</div>' +
            '<div style="font-size: 0.7rem; color: var(--forge-text-muted); font-family: monospace;">' + (emp.employee_code ? 'Code: ' + emp.employee_code : '') + '</div>' +
          '</td>' +
          '<td onclick="event.stopPropagation()">' +
            (emp.manager_name
              ? '<button class="emp-mgr-pill" data-emp-id="' + emp.id + '" onclick="openHierarchyModal(this.getAttribute(\\'data-emp-id\\'))" title="View Management Chain">👔 ' + emp.manager_name + '</button>'
              : '<span style="font-size: 0.75rem; color: var(--forge-text-muted); font-style: italic;">No Manager</span>') +
          '</td>' +
          '<td>' + rolesList + '</td>' +
          '<td>' + statusBadge + '</td>' +
          '<td style="text-align: right;" onclick="event.stopPropagation()">' +
            '<div style="display: inline-flex; gap: 0.35rem;">' +
              '<button class="astryx-btn btn-outline" style="padding: 0.2rem 0.45rem; font-size: 0.72rem;" data-emp-id="' + emp.id + '" onclick="openEditEmployeeModal(this.getAttribute(\\'data-emp-id\\'))">Edit</button>' +
              '<button class="astryx-btn btn-outline" style="padding: 0.2rem 0.45rem; font-size: 0.72rem; border-color: var(--forge-border); color: var(--forge-text-muted);" data-emp-id="' + emp.id + '" onclick="revokeEmployeeSessions(this.getAttribute(\\'data-emp-id\\'))">Revoke</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      }).join('');
    }

    function changeEmployeePage(delta) {
      const items = employeeData.items || [];
      const totalPages = Math.max(1, Math.ceil(items.length / employeePageLimit));
      const next = employeeCurrentPage + delta;
      if (next >= 1 && next <= totalPages) {
        employeeCurrentPage = next;
        renderEmployeeTable();
      }
    }

    function changeEmployeePageLimit(limit) {
      employeePageLimit = parseInt(limit, 10) || 25;
      employeeCurrentPage = 1;
      renderEmployeeTable();
    }

    function handleEmployeeRowClick(event, userId) {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') return;
      openEmployeeDrawer(userId);
    }

    function toggleEmployeeSelection(userId, checked) {
      if (checked) selectedEmployeeIds.add(userId);
      else selectedEmployeeIds.delete(userId);
      updateBatchToolbar();
    }

    function toggleSelectAllEmployees(checked) {
      const items = employeeData.items || [];
      if (checked) items.forEach(i => selectedEmployeeIds.add(i.id));
      else selectedEmployeeIds.clear();
      renderEmployeeTable();
      updateBatchToolbar();
    }

    function clearBatchSelection() {
      selectedEmployeeIds.clear();
      const selectAll = document.getElementById('emp-select-all');
      if (selectAll) selectAll.checked = false;
      renderEmployeeTable();
      updateBatchToolbar();
    }

    function updateBatchToolbar() {
      const bar = document.getElementById('emp-batch-bar');
      const countEl = document.getElementById('batch-selected-count');
      if (!bar || !countEl) return;

      countEl.textContent = selectedEmployeeIds.size;
      if (selectedEmployeeIds.size > 0) bar.classList.add('show');
      else bar.classList.remove('show');
    }

    async function executeBatchAction(action) {
      if (selectedEmployeeIds.size === 0) return;
      const userIds = Array.from(selectedEmployeeIds);

      try {
        const res = await fetch(\`\${apiBase}/api/employees/bulk-action\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, userIds }),
        });
        const json = await res.json();
        if (json.status !== 'ok') throw new Error(json.error || 'Action failed');
        showAstryxToast('success', 'Processed ' + json.processed + ' employees (' + action + ')');
        clearBatchSelection();
        loadEmployees();
      } catch (err) {
        showAstryxToast('error', err.message);
      }
    }

    function sortEmployeesBy(field) {
      sortDirection[field] = -1 * (sortDirection[field] || 1);
      const dir = sortDirection[field];
      employeeData.items.sort((a, b) => {
        const valA = field === 'name' ? (a.display_name || '') : (a.department_name || '');
        const valB = field === 'name' ? (b.display_name || '') : (b.department_name || '');
        return valA.localeCompare(valB) * dir;
      });
      renderEmployeeTable();
    }

    function downloadSampleCsvTemplate() {
      const sample = 'display_name,email,job_title,employee_code,department,manager_email,role\\n' +
        'Elena Rostova,elena.rostova@forge.internal,Chief Revenue Officer (CRO),CRO-001,Revenue & Commercial Org,,roles/super_admin\\n' +
        'Marcus Thorne,marcus.thorne@forge.internal,VP of Global Enterprise Sales,CRO-010,Enterprise Sales,elena.rostova@forge.internal,roles/super_admin\\n' +
        'Sophia Loren,sophia.loren@forge.internal,VP of Marketing & Brand Growth,CRO-020,Marketing & Growth,elena.rostova@forge.internal,roles/super_admin\\n' +
        'David Kalu,david.kalu@forge.internal,VP of Customer Success & Renewals,CRO-030,Customer Success,elena.rostova@forge.internal,roles/super_admin\\n' +
        'Aria Sterling,aria.sterling@forge.internal,VP of Revenue Operations & Strategy,CRO-040,Revenue Operations,elena.rostova@forge.internal,roles/super_admin\\n' +
        'Liam O\\'Connor,liam.oconnor@forge.internal,VP of Solutions Engineering & GTM,CRO-050,Solutions Engineering,elena.rostova@forge.internal,roles/super_admin\\n' +
        'Rachel Adams,rachel.adams@forge.internal,Director of Enterprise Sales (Americas),CRO-101,Sales - Americas,marcus.thorne@forge.internal,roles/super_admin\\n' +
        'James Wilson,james.wilson@forge.internal,Senior Strategic AE (US West),CRO-111,Sales - Americas,rachel.adams@forge.internal,roles/employee';

      const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'cro_org_hierarchy_sample.csv';
      link.click();
    }

    ${getEmployeeDrawerAndTreeScripts()}

    function filterEmployees() {
      const searchInput = document.getElementById('emp-search-input');
      const deptSelect = document.getElementById('emp-dept-filter');
      currentEmployeeFilter.search = searchInput ? searchInput.value.trim() : '';
      currentEmployeeFilter.departmentId = deptSelect ? deptSelect.value : '';
      loadEmployees();
    }

    function setEmployeeStatusFilter(status) {
      currentEmployeeFilter.status = status === 'all' ? '' : status;
      const chips = document.querySelectorAll('#emp-filter-chips .filter-chip');
      chips.forEach(c => {
        if (c.getAttribute('data-filter') === status) c.classList.add('active');
        else c.classList.remove('active');
      });
      loadEmployees();
    }

    function resetEmployeeFilters() {
      currentEmployeeFilter = { search: '', departmentId: '', status: '' };
      const searchInput = document.getElementById('emp-search-input');
      const deptSelect = document.getElementById('emp-dept-filter');
      if (searchInput) searchInput.value = '';
      if (deptSelect) deptSelect.value = '';
      setEmployeeStatusFilter('all');
    }

    ${getEmployeeModalScripts()}

    ${getEmployeeImportScripts()}
  `;
}


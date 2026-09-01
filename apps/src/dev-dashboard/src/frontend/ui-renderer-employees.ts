/**
 * @forge/dev-dashboard - Employee Directory & Org Chart Tab Renderer (2026 LTS)
 * Meta Astryx Glassmorphic Layout & Component Structure.
 */

import { astryxIcons } from '@forge/ui';

export function renderEmployeesTab(): string {
  return `
    <!-- Tab: Employees & Org Studio -->
    <section id="tab-employees" class="tab-pane">
      <div class="astryx-card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <h2 style="font-size: 1.2rem; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 600;">
              <span style="color: var(--forge-primary); display: flex; align-items: center;">${astryxIcons.users}</span> Organization Command & Directory Studio
            </h2>
            <p style="color: var(--forge-text-muted); font-size: 0.82rem;">Manage organization members, explore visual reporting hierarchy, configure IAM roles, and bulk import datasets.</p>
          </div>
          <div style="display: flex; gap: 0.45rem; align-items: center; flex-wrap: wrap;">
            <div class="view-switcher-group">
              <button class="view-switch-btn active" id="btn-view-table" onclick="setEmployeeViewMode('table')">
                <span style="display: flex; align-items: center; gap: 0.35rem;">${astryxIcons.table} Table</span>
              </button>
              <button class="view-switch-btn" id="btn-view-tree" onclick="setEmployeeViewMode('tree')">
                <span style="display: flex; align-items: center; gap: 0.35rem;">${astryxIcons.gitTree} Org Chart</span>
              </button>
            </div>
            <button class="astryx-btn btn-outline" onclick="openImportWizard()">
              ${astryxIcons.upload} Bulk Import
            </button>
            <button class="astryx-btn btn-outline" onclick="exportEmployees('csv')">
              ${astryxIcons.download} Export
            </button>
            <button class="astryx-btn btn-primary" onclick="openAddEmployeeModal()">
              ${astryxIcons.plus} Add Member
            </button>
          </div>
        </div>

        <div class="emp-stats-grid">
          <div class="emp-stat-card"><div class="emp-stat-icon" style="color: var(--forge-text-muted);">${astryxIcons.users}</div><div class="emp-stat-info"><span class="emp-stat-val" id="emp-stat-total">0</span><span class="emp-stat-lbl">Total Members</span></div></div>
          <div class="emp-stat-card"><div class="emp-stat-icon"><span class="status-pulse-dot active"></span></div><div class="emp-stat-info"><span class="emp-stat-val" style="color: var(--forge-success);" id="emp-stat-active">0</span><span class="emp-stat-lbl">Active Accounts</span></div></div>
          <div class="emp-stat-card"><div class="emp-stat-icon"><span class="status-pulse-dot suspended"></span></div><div class="emp-stat-info"><span class="emp-stat-val" style="color: var(--forge-accent);" id="emp-stat-suspended">0</span><span class="emp-stat-lbl">Suspended</span></div></div>
          <div class="emp-stat-card"><div class="emp-stat-icon" style="color: var(--forge-text-muted);">${astryxIcons.building}</div><div class="emp-stat-info"><span class="emp-stat-val" id="emp-stat-depts">0</span><span class="emp-stat-lbl">Departments</span></div></div>
        </div>
      </div>

      <div class="services-toolbar">
        <div class="services-search-box">
          <span style="display: flex; align-items: center; color: var(--forge-text-muted);">${astryxIcons.search}</span>
          <input type="search" id="emp-search-input" placeholder="Search by name, email, code, title... (⌘K)" oninput="filterEmployees()">
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <select class="form-input" id="emp-dept-filter" style="max-width: 220px;" onchange="filterEmployees()">
            <option value="">All Departments</option>
          </select>
          <div class="filter-chip-group" id="emp-filter-chips">
            <button class="filter-chip active" data-filter="all" onclick="setEmployeeStatusFilter('all')">All</button>
            <button class="filter-chip" data-filter="ACTIVE" onclick="setEmployeeStatusFilter('ACTIVE')"><span class="status-pulse-dot active" style="margin-right: 3px;"></span> Active</button>
            <button class="filter-chip" data-filter="INVITED" onclick="setEmployeeStatusFilter('INVITED')"><span class="status-pulse-dot invited" style="margin-right: 3px;"></span> Invited</button>
            <button class="filter-chip" data-filter="SUSPENDED" onclick="setEmployeeStatusFilter('SUSPENDED')"><span class="status-pulse-dot suspended" style="margin-right: 3px;"></span> Suspended</button>
          </div>
        </div>
      </div>

      <!-- Mode A: Directory Table -->
      <div id="emp-table-view">
        <div class="astryx-card" style="padding: 0; overflow: hidden;">
          <div class="astryx-table-wrap">
            <table class="data-table" style="margin-top: 0;">
              <thead>
                <tr>
                  <th style="width: 32px;"><input type="checkbox" id="emp-select-all" onchange="toggleSelectAllEmployees(this.checked)"></th>
                  <th style="cursor: pointer;" onclick="sortEmployeesBy('name')">Employee Name & Email ↕</th>
                  <th style="cursor: pointer;" onclick="sortEmployeesBy('department')">Department / Path ↕</th>
                  <th>Job Title & Code</th>
                  <th>Line Manager</th>
                  <th>IAM Roles</th>
                  <th style="width: 105px;">Status</th>
                  <th style="width: 130px; text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody id="employees-tbody">
                <tr><td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--forge-text-muted);">Loading employee directory...</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Integrated Enterprise Table Footer -->
          <div class="emp-table-footer">
            <div class="emp-footer-metrics" id="emp-footer-metrics">Showing 0 of 0 members</div>
            <div class="emp-footer-center">
              <span style="font-size: 0.74rem; color: var(--forge-text-muted);">Rows per page:</span>
              <select id="emp-page-limit" class="form-input" style="width: auto;" onchange="changeEmployeePageLimit(this.value)">
                <option value="10">10</option>
                <option value="25" selected>25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div class="emp-footer-pagination" id="emp-pagination-controls">
              <button class="astryx-btn btn-outline" id="btn-emp-prev" style="height: 26px; padding: 0 0.6rem; font-size: 0.74rem;" onclick="changeEmployeePage(-1)" disabled>&larr; Prev</button>
              <span id="emp-page-indicator" style="font-size: 0.75rem; font-weight: 600; color: var(--forge-text-main); min-width: 65px; text-align: center;">Page 1 of 1</span>
              <button class="astryx-btn btn-outline" id="btn-emp-next" style="height: 26px; padding: 0 0.6rem; font-size: 0.74rem;" onclick="changeEmployeePage(1)" disabled>Next &rarr;</button>
            </div>
          </div>
        </div>

        <div class="emp-table-keyboard-hints">
          <span><kbd>⌘K</kbd> Command Palette</span>
          <span><kbd>/</kbd> Filter Directory</span>
          <span><kbd>Space</kbd> Check/Uncheck</span>
          <span><kbd>Esc</kbd> Dismiss Drawers</span>
        </div>
      </div>

      <!-- Mode B: Visual Org Chart Tree -->
      <div id="emp-tree-view" style="display: none;">
        <div class="astryx-card">
          <div class="org-chart-viewport" id="org-chart-container">Loading interactive organizational chart...</div>
        </div>
      </div>

      <!-- Floating Linear-Grade Batch Actions Bar -->
      <div id="emp-batch-bar" class="emp-batch-bar" role="toolbar" aria-label="Batch Actions Toolbar">
        <span class="emp-batch-label"><span class="status-pulse-dot active"></span> <span id="batch-selected-count">0</span> Selected</span>
        <div class="emp-batch-actions-group">
          <button class="astryx-btn btn-outline emp-batch-btn" onclick="executeBatchAction('revoke')">${astryxIcons.shield} Revoke Sessions</button>
          <button class="astryx-btn btn-outline emp-batch-btn" onclick="executeBatchAction('suspend')">${astryxIcons.pause} Suspend</button>
          <button class="astryx-btn btn-primary emp-batch-btn" onclick="executeBatchAction('activate')">${astryxIcons.check} Activate</button>
          <button class="emp-batch-close-btn" title="Cancel selection (Esc)" onclick="clearBatchSelection()">&times;</button>
        </div>
      </div>
    </section>
  `;
}

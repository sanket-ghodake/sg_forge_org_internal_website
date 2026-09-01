/**
 * @forge/portal - Admin Team & Member Management View (2026 LTS)
 * Organization user roster, invite flows, IAM role assignment, and offboarding controls.
 */

import { astryxIcons } from '@forge/ui';
import { DIRECTORY_MEMBERS } from './ui-renderer-directory';

export function renderAdminMembersView(): string {
  return `
    <div id="view-admin-members" class="portal-page-view">
      <!-- Header -->
      <div class="portal-view-header">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="portal-view-badge" style="background: rgba(var(--forge-primary-rgb, 99, 102, 241), 0.15); color: var(--forge-primary);">
              <span class="badge-dot" style="background: var(--forge-primary);"></span>
              <span>Admin Console</span>
            </div>
            <span class="portal-view-audience" style="font-size: 0.74rem; color: var(--forge-text-subtle);">Audience: <strong style="color: var(--forge-text-muted); font-weight: 500;">Admins & HR Managers</strong></span>
          </div>
          <h1 class="portal-view-title">Team & Member Management</h1>
          <p class="portal-view-desc">
            Invite new colleagues, assign organizational departments, configure IAM roles, and handle departures.
          </p>
        </div>

        <div class="portal-view-actions">
          <button class="astryx-btn btn-outline" id="batch-import-btn">
            ${astryxIcons.upload || '↑'} Batch CSV
          </button>
          <button class="astryx-btn btn-primary" id="open-invite-modal-btn">
            ${astryxIcons.plus || '+'} Invite Colleague
          </button>
        </div>
      </div>

      <!-- Controls & Search -->
      <div class="admin-table-controls">
        <div class="canvas-search-input-wrap" style="width: 280px;">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="admin-member-search" placeholder="Search by name, email, or role..." />
        </div>
        <div class="table-summary-pill">
          Total Members: <strong>${DIRECTORY_MEMBERS.length}</strong>
        </div>
      </div>

      <!-- Members Data Table -->
      <div class="astryx-table-container">
        <table class="astryx-table" id="admin-members-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Department / Division</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>IAM Role</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${DIRECTORY_MEMBERS.map(m => `
              <tr data-id="${m.id}">
                <td>
                  <div class="table-user-cell">
                    <div class="table-user-avatar">${m.avatarInitial}</div>
                    <div>
                      <div class="table-user-name">${m.name}</div>
                      <div class="table-user-email">${m.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="table-dept-tag">${m.department}</div>
                  <div class="table-div-sub">${m.division}</div>
                </td>
                <td>${m.jobTitle}</td>
                <td>
                  <span class="astryx-badge badge-${m.status === 'ONLINE' ? 'online' : 'muted'}">
                    ${m.status}
                  </span>
                </td>
                <td>
                  <span class="iam-role-tag">${m.id === 'usr_sanket' ? 'Super Admin' : (m.id.includes('lead') || m.id === 'usr_alex' ? 'Dept Admin' : 'Employee')}</span>
                </td>
                <td style="text-align: right;">
                  <button class="astryx-btn btn-sm btn-ghost edit-role-btn" data-id="${m.id}" data-name="${m.name}" title="Edit IAM Roles">
                    ${astryxIcons.shield || '🛡️'}
                  </button>
                  <button class="astryx-btn btn-sm btn-ghost delete-user-btn" data-id="${m.id}" data-name="${m.name}" title="Suspend Account" style="color: var(--forge-danger);">
                    ${astryxIcons.slash || '⊘'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

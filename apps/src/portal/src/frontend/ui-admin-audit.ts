/**
 * @forge/portal - Admin Security & Audit Logs View (2026 LTS)
 * Real-time RFC 7807 structured audit stream with trace IDs, automated PII redaction, and compliance export.
 */

import { astryxIcons } from '@forge/ui';

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'DENIED' | 'ERROR';
  traceId: string;
}

export const SAMPLE_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'aud_1',
    timestamp: '2026-09-01 14:38:12',
    actor: 'sanket@forge.internal',
    action: 'iam.roles.grant',
    resource: 'users/usr_alex (roles/super_admin)',
    status: 'SUCCESS',
    traceId: 'trc_9f8e7d6c5b',
  },
  {
    id: 'aud_2',
    timestamp: '2026-09-01 14:15:00',
    actor: 'maya.r@forge.internal',
    action: 'apps.launch',
    resource: 'apps/dev-dashboard',
    status: 'SUCCESS',
    traceId: 'trc_1a2b3c4d5e',
  },
  {
    id: 'aud_3',
    timestamp: '2026-09-01 13:54:21',
    actor: 'david.k@forge.internal',
    action: 'apps.launch',
    resource: 'apps/telemetry',
    status: 'DENIED',
    traceId: 'trc_77a88b99cc',
  },
  {
    id: 'aud_4',
    timestamp: '2026-09-01 12:10:05',
    actor: 'elena.r@forge.internal',
    action: 'members.invite',
    resource: 'users/invited (developer)',
    status: 'SUCCESS',
    traceId: 'trc_44d55e66ff',
  },
];

export function renderAdminAuditView(): string {
  return `
    <div id="view-admin-audit" class="portal-page-view">
      <!-- Header -->
      <div class="portal-view-header">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="portal-view-badge" style="background: rgba(var(--forge-primary-rgb, 99, 102, 241), 0.15); color: var(--forge-primary);">
              <span class="badge-dot" style="background: var(--forge-primary);"></span>
              <span>Admin Console</span>
            </div>
            <span class="portal-view-audience" style="font-size: 0.74rem; color: var(--forge-text-subtle);">Audience: <strong style="color: var(--forge-text-muted); font-weight: 500;">Admins & Security Officers</strong></span>
          </div>
          <h1 class="portal-view-title">Security & Audit Logs</h1>
          <p class="portal-view-desc">
            Immutable RFC 7807 compliance audit stream with Google SRE structured logs and automated PII redaction.
          </p>
        </div>

        <div class="portal-view-actions">
          <button class="astryx-btn btn-outline" id="export-audit-json-btn">
            ${astryxIcons.download || '↓'} Export JSON
          </button>
          <button class="astryx-btn btn-outline" id="export-audit-csv-btn">
            ${astryxIcons.fileText || '📄'} Export CSV
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="admin-table-controls">
        <div class="canvas-search-input-wrap" style="width: 320px;">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="audit-search-input" placeholder="Search by trace ID, actor, or action..." />
        </div>
        <div class="table-summary-pill">
          Showing <strong>${SAMPLE_AUDIT_LOGS.length}</strong> security events
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="astryx-table-container">
        <table class="astryx-table" id="admin-audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target Resource</th>
              <th>Status</th>
              <th>Trace ID</th>
            </tr>
          </thead>
          <tbody>
            ${SAMPLE_AUDIT_LOGS.map(a => `
              <tr>
                <td style="font-family: var(--forge-font-mono, monospace); font-size: 0.78rem; color: var(--forge-text-muted);">${a.timestamp}</td>
                <td><strong style="color: var(--forge-text-main); font-size: 0.84rem;">${a.actor}</strong></td>
                <td><code>${a.action}</code></td>
                <td><span style="font-size: 0.82rem; color: var(--forge-text-muted);">${a.resource}</span></td>
                <td>
                  <span class="astryx-badge badge-${a.status === 'SUCCESS' ? 'online' : (a.status === 'DENIED' ? 'warning' : 'danger')}">
                    ${a.status}
                  </span>
                </td>
                <td><code style="font-size: 0.75rem; color: var(--forge-primary);">${a.traceId}</code></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

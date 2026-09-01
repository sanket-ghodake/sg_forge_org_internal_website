/**
 * @forge/portal - Apps & Tools Hub View Renderer (2026 LTS)
 * Displays Pinned Apps dock, active Micro-App cards with dual-probe latency, and Access Request drawers.
 */

import { astryxIcons } from '@forge/ui';

export interface MicroAppItem {
  id: string;
  name: string;
  category: string;
  description: string;
  ingressPath: string;
  port: number;
  iconSvg: string;
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  isPinned?: boolean;
  requiredRole?: string;
  isRestricted?: boolean;
}

export const REGISTERED_PORTAL_APPS: MicroAppItem[] = [
  {
    id: 'dev-dashboard',
    name: 'Developer Dashboard',
    category: 'Engineering & Ops',
    description: 'Centralized observability, system metrics, traffic analysis, and service management.',
    ingressPath: '/dev-dashboard',
    port: 3004,
    iconSvg: astryxIcons.traffic || '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
    status: 'ONLINE',
    latencyMs: 8,
    isPinned: true,
  },
  {
    id: 'dev-hub',
    name: 'Developer Hub',
    category: 'Engineering & Docs',
    description: 'SDK documentation, API schema explorer, code snippets, and integration blueprints.',
    ingressPath: '/dev-hub',
    port: 3003,
    iconSvg: astryxIcons.terminal || '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>',
    status: 'ONLINE',
    latencyMs: 12,
    isPinned: true,
  },
  {
    id: 'expenses',
    name: 'Expenses & Reimbursements',
    category: 'Finance & HR',
    description: 'Submit expense claims, mileage reports, travel receipts, and track approval status.',
    ingressPath: '/apps/expenses',
    port: 3010,
    iconSvg: astryxIcons.layers || '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
    status: 'ONLINE',
    latencyMs: 14,
    isPinned: true,
  },
  {
    id: 'billing',
    name: 'Enterprise Billing & Invoices',
    category: 'Finance & Accounts',
    description: 'Customer invoice ledger, subscription management, payment gateways, and tax reconciliation.',
    ingressPath: '/apps/billing',
    port: 3011,
    iconSvg: astryxIcons.table || '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
    status: 'ONLINE',
    latencyMs: 19,
    requiredRole: 'roles/billing.admin',
  },
  {
    id: 'telemetry',
    name: 'Platform Telemetry & APM',
    category: 'Infrastructure',
    description: 'Dual-probe health metrics, distributed request traces, log ingestion, and alert routing.',
    ingressPath: '/apps/telemetry',
    port: 3012,
    iconSvg: astryxIcons.cpu || '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect></svg>',
    status: 'ONLINE',
    latencyMs: 11,
    requiredRole: 'roles/super_admin',
    isRestricted: true,
  },
];

export function renderAppsView(isAdmin: boolean = false): string {
  const pinnedApps = REGISTERED_PORTAL_APPS.filter(a => a.isPinned);

  return `
    <div id="view-apps" class="portal-page-view">
      <!-- Header -->
      <div class="portal-view-header">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="portal-view-badge">
              <span class="badge-dot"></span>
              <span>Microservice Hub</span>
            </div>
            <span class="portal-view-audience" style="font-size: 0.74rem; color: var(--forge-text-subtle);">Audience: <strong style="color: var(--forge-text-muted); font-weight: 500;">All Employees & Staff</strong></span>
          </div>
          <h1 class="portal-view-title">My Apps & Tools Hub</h1>
          <p class="portal-view-desc">
            Launch internal tools, sandboxed micro-apps, and enterprise utilities with zero-reauth SSO pass-through.
          </p>
        </div>

        <div class="portal-view-actions">
          <div class="canvas-search-input-wrap" style="width: 240px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="apps-search-input" placeholder="Filter tools..." />
          </div>
          ${isAdmin ? `
            <button class="astryx-btn btn-primary" onclick="if(window.portalSPA){window.portalSPA.navigate('admin-apps');}">
              ${astryxIcons.plus || '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'}
              <span>Manage Catalog</span>
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Pinned Favorites Bar -->
      <div class="pinned-apps-container">
        <div class="section-sub-title">
          <span style="color: var(--forge-primary);">${astryxIcons.sparkles || '★'}</span>
          <span>Pinned Favorites</span>
        </div>
        <div class="pinned-apps-grid">
          ${pinnedApps.map(app => `
            <a href="${app.ingressPath}" class="pinned-app-chip" target="_self">
              <span class="app-chip-icon">${app.iconSvg}</span>
              <span class="app-chip-name">${app.name}</span>
              <span class="status-indicator status-online"></span>
            </a>
          `).join('')}
        </div>
      </div>

      <!-- All Microservices Grid -->
      <div class="section-sub-title" style="margin-top: 1.5rem;">
        <span>All Available Workspaces</span>
      </div>

      <div class="apps-catalog-grid" id="apps-catalog-grid">
        ${REGISTERED_PORTAL_APPS.map(app => `
          <div class="app-card-item" data-app-id="${app.id}" data-category="${app.category}">
            <div class="app-card-top">
              <div class="app-card-brand">
                <div class="app-card-icon-box">${app.iconSvg}</div>
                <div>
                  <h3 class="app-card-title">${app.name}</h3>
                  <span class="app-card-cat">${app.category}</span>
                </div>
              </div>
              <div class="app-health-badge badge-online">
                <span class="status-indicator status-online"></span>
                <span>${app.latencyMs}ms</span>
              </div>
            </div>

            <p class="app-card-desc">${app.description}</p>

            <div class="app-card-footer">
              <div class="app-port-tag">Port :${app.port}</div>
              <div class="app-card-actions">
                ${app.isRestricted && !isAdmin ? `
                  <button class="astryx-btn btn-sm btn-outline request-access-btn" data-app-name="${app.name}">
                    Request Access
                  </button>
                ` : `
                  <a href="${app.ingressPath}" class="astryx-btn btn-sm btn-primary" target="_self">
                    Launch App &rarr;
                  </a>
                `}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

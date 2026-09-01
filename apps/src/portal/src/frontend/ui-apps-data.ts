/**
 * @forge/portal - Forge Apps Catalog Data (2026 LTS)
 * Strictly Forge micro-apps located in forge-apps/:
 * - Expenses (/apps/expenses - Port 8085)
 * - Invoicing & Billing (/apps/billing - Port 8086) [Restricted]
 * - Platform Telemetry (/apps/telemetry - Port 8087) [Restricted]
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
  latencyMs?: number;
  isPinned?: boolean;
  requiredRole?: string;
  isRestricted?: boolean;
  departmentOwner?: string;
  approvalType?: string;
  tags?: string[];
}

export const REGISTERED_PORTAL_APPS: MicroAppItem[] = [
  {
    id: 'expenses',
    name: 'Expenses & Reimbursements',
    category: 'Finance',
    description: 'Submit employee expense claims, upload receipts, track mileage, and review payment status.',
    ingressPath: '/apps/expenses',
    port: 8085,
    iconSvg: astryxIcons.layers || '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    status: 'ONLINE',
    isPinned: true,
    departmentOwner: 'Finance Team',
    tags: ['Reimbursements', 'Receipts', 'SSO Active'],
  },
];

export const MARKETPLACE_APPS: MicroAppItem[] = [
  {
    id: 'billing',
    name: 'Invoicing & Billing Service',
    category: 'Finance',
    description: 'Customer invoice ledger, subscription management, payment reconciliation, and fiscal reporting.',
    ingressPath: '/apps/billing',
    port: 8086,
    iconSvg: astryxIcons.table || '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line></svg>',
    status: 'ONLINE',
    requiredRole: 'roles/billing.admin',
    isRestricted: true,
    departmentOwner: 'Finance Team',
    approvalType: 'Finance Lead Approval',
    tags: ['Invoicing', 'Subscriptions', 'Ledger'],
  },
  {
    id: 'telemetry',
    name: 'Live Telemetry Dashboard',
    category: 'Operations',
    description: 'Deep distributed request tracing, raw cluster telemetry, error log aggregation, and real-time APM.',
    ingressPath: '/apps/telemetry',
    port: 8087,
    iconSvg: astryxIcons.cpu || '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect></svg>',
    status: 'ONLINE',
    requiredRole: 'roles/super_admin',
    isRestricted: true,
    departmentOwner: 'Infrastructure & SRE',
    approvalType: 'Security & IT Approval',
    tags: ['Distributed Traces', 'APM', 'Logs'],
  },
];

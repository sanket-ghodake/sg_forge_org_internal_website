/**
 * @forge/portal - Page Overview Cards Component (2026 LTS)
 * Renders structured non-technical overview containers for all Employee and Admin views.
 */

import { astryxIcons } from '@forge/ui';

export interface PageDefinition {
  id: string;
  title: string;
  category: 'Workspace' | 'Admin Console';
  iconSvg: string;
  badge: string;
  summary: string;
  targetAudience: string;
  features: Array<{ iconSvg: string; title: string; desc: string }>;
  nextSteps: string[];
}

export const PORTAL_PAGES: PageDefinition[] = [
  // ── Employee Workspace Views ──
  {
    id: 'canvas',
    title: 'Company Map & Org Canvas',
    category: 'Workspace',
    iconSvg: astryxIcons.map,
    badge: 'Core Workspace',
    summary: 'An interactive visual map of the entire organization showing teams, departments, reporting lines, and who works where.',
    targetAudience: 'All Employees & Staff',
    features: [
      { iconSvg: astryxIcons.topology, title: '2D Visual Canvas', desc: 'Pan and zoom across Macro, Meso, and Micro organizational units smoothly.' },
      { iconSvg: astryxIcons.gitTree, title: 'Department Hierarchies', desc: 'Instantly see team leads, direct reports, and cross-functional project pods.' },
      { iconSvg: astryxIcons.search, title: 'Smart Search & Center', desc: 'Type any colleague name to automatically center the canvas on their node.' }
    ],
    nextSteps: ['Pan/zoom canvas engine integration', 'Real-time node positioning sync', 'Quick contact hover cards']
  },
  {
    id: 'apps',
    title: 'My Apps & Tools Hub',
    category: 'Workspace',
    iconSvg: astryxIcons.rocket,
    badge: 'App Drawer',
    summary: 'A central launchpad where team members can open all company tools, forms, and custom mini-apps in one window.',
    targetAudience: 'All Employees & Staff',
    features: [
      { iconSvg: astryxIcons.apps, title: 'Sandboxed Micro-Apps', desc: 'Launch internal tools securely inside an isolated, fast-loading sandbox.' },
      { iconSvg: astryxIcons.key, title: 'Zero-Reauth SSO', desc: 'Apps open pre-authenticated with your work identity and role tokens.' },
      { iconSvg: astryxIcons.sparkles, title: 'Pinned Favorites', desc: 'Pin your most-used tools to the top of your workspace for quick access.' }
    ],
    nextSteps: ['Connect Expenses & Billing Forge Apps', 'Add personal app pinning', 'Implement recent apps drawer']
  },
  {
    id: 'directory',
    title: 'People Directory',
    category: 'Workspace',
    iconSvg: astryxIcons.users,
    badge: 'Directory',
    summary: 'A searchable contact book of all colleagues with photos, job titles, department tags, email, and time zones.',
    targetAudience: 'All Employees & Staff',
    features: [
      { iconSvg: astryxIcons.zap, title: 'Instant Filtering', desc: 'Filter team members by department, office location, skills, or job title.' },
      { iconSvg: astryxIcons.clock, title: 'Local Time & Working Hours', desc: 'See coworkers’ current local time and availability before scheduling.' },
      { iconSvg: astryxIcons.messageSquare, title: 'One-Click Connect', desc: 'Quickly copy email, start a Slack chat, or view their reporting chain.' }
    ],
    nextSteps: ['Connect Turso employees table', 'Add timezone clock badge', 'Add direct Slack/email action triggers']
  },
  {
    id: 'profile',
    title: 'My Profile & Account',
    category: 'Workspace',
    iconSvg: astryxIcons.user,
    badge: 'Personal Space',
    summary: 'Personal page to view and update details, display name, contact info, working hours, active sessions, and theme preferences.',
    targetAudience: 'Individual User',
    features: [
      { iconSvg: astryxIcons.settings, title: 'Profile Customization', desc: 'Update display name, avatar photo, bio, and department info.' },
      { iconSvg: astryxIcons.shield, title: 'Security & Active Sessions', desc: 'View active browser logins and revoke old sessions with one click.' },
      { iconSvg: astryxIcons.key, title: 'Personal API Tokens', desc: 'Generate scoped API tokens for CLI tools and developer scripts.' }
    ],
    nextSteps: ['Profile photo upload integration', 'Session revocation endpoint', 'Personal token generator']
  },
  {
    id: 'notifications',
    title: 'Notifications & Announcements',
    category: 'Workspace',
    iconSvg: astryxIcons.bell,
    badge: 'Inbox',
    summary: 'A centralized inbox for company-wide announcements, team updates, role modifications, and system alerts.',
    targetAudience: 'All Employees & Staff',
    features: [
      { iconSvg: astryxIcons.bell, title: 'Company Announcements', desc: 'Important broadcast messages and policy updates from leadership and HR.' },
      { iconSvg: astryxIcons.zap, title: 'Activity Alerts', desc: 'Notifications when someone mentions you or when your requests are approved.' },
      { iconSvg: astryxIcons.mail, title: 'Unread Management', desc: 'Mark notifications as read or filter by high-priority action items.' }
    ],
    nextSteps: ['Broadcast announcement composer', 'Real-time WebSocket event listener', 'Email digest preferences']
  },

  // ── Admin Console Views ──
  {
    id: 'admin-members',
    title: 'Team & Member Management',
    category: 'Admin Console',
    iconSvg: astryxIcons.users,
    badge: 'Admin Suite',
    summary: 'Dashboard to invite new employees, deactivate accounts, assign job titles, and grant access levels.',
    targetAudience: 'Admins & HR Managers',
    features: [
      { iconSvg: astryxIcons.mail, title: 'Invite New Employees', desc: 'Send email invitations with pre-configured department, role, and manager.' },
      { iconSvg: astryxIcons.shield, title: 'Role & RBAC Assignment', desc: 'Assign Employee, Manager, HR Admin, or Super Admin roles in one click.' },
      { iconSvg: astryxIcons.slash, title: 'Instant Offboarding', desc: 'Immediately revoke system access and active sessions when an employee departs.' }
    ],
    nextSteps: ['Invite member modal workflow', 'Role assignment dropdown integration', 'CSV batch member import']
  },
  {
    id: 'admin-apps',
    title: 'App Store & Permissions',
    category: 'Admin Console',
    iconSvg: astryxIcons.layers,
    badge: 'Admin Suite',
    summary: 'Admin panel to register new mini-apps, assign tools to specific departments, and manage access policies.',
    targetAudience: 'Admins & IT Leads',
    features: [
      { iconSvg: astryxIcons.apps, title: 'App Catalog Registry', desc: 'Register internal Forge micro-apps with dedicated ports and ingress URLs.' },
      { iconSvg: astryxIcons.filter, title: 'Department Scoping', desc: 'Limit sensitive tools (e.g. Finance/HR) to authorized departments only.' },
      { iconSvg: astryxIcons.key, title: 'Connector & API Keys', desc: 'Manage environment variables and API integrations per micro-app.' }
    ],
    nextSteps: ['App registration form', 'Department permission matrix', 'App health & uptime metrics']
  },
  {
    id: 'admin-org',
    title: 'Organization Chart Builder',
    category: 'Admin Console',
    iconSvg: astryxIcons.gitTree,
    badge: 'Admin Suite',
    summary: 'Visual builder to create new departments, add teams, and update manager-employee reporting lines.',
    targetAudience: 'Admins & HR Leads',
    features: [
      { iconSvg: astryxIcons.topology, title: 'Drag & Drop Editor', desc: 'Reorganize teams and reporting chains visually on the 2D canvas.' },
      { iconSvg: astryxIcons.building, title: 'Department Creator', desc: 'Create new business units, assign budget codes, and designate team leads.' },
      { iconSvg: astryxIcons.check, title: 'Publish Changes', desc: 'Draft reorganization changes privately and publish live to the company.' }
    ],
    nextSteps: ['Draft vs Published org versioning', 'Canvas node drag-to-reparent', 'Team hierarchy export']
  },
  {
    id: 'admin-audit',
    title: 'Security & Audit Logs',
    category: 'Admin Console',
    iconSvg: astryxIcons.fileText,
    badge: 'Admin Suite',
    summary: 'A security timeline tracking who logged in, who made organizational changes, and when critical settings were updated.',
    targetAudience: 'Admins & Security Officers',
    features: [
      { iconSvg: astryxIcons.search, title: 'Live Audit Stream', desc: 'Structured JSON log viewer (RFC 7807) with trace ID search and filtering.' },
      { iconSvg: astryxIcons.shield, title: 'PII Redacted Logs', desc: 'Sensitive credentials and passwords automatically redacted before logging.' },
      { iconSvg: astryxIcons.traffic, title: 'Access Analytics', desc: 'Monitor login trends, failed authentication attempts, and permission changes.' }
    ],
    nextSteps: ['Structured log filter by severity', 'Export audit logs to CSV/JSON', 'Security alert webhooks']
  },
  {
    id: 'admin-settings',
    title: 'Company Settings & Security',
    category: 'Admin Console',
    iconSvg: astryxIcons.settings,
    badge: 'Admin Suite',
    summary: 'High-level workspace settings, company branding, single sign-on (SSO/Google login) setup, and domain policies.',
    targetAudience: 'Super Admins & Workspace Owners',
    features: [
      { iconSvg: astryxIcons.building, title: 'Company Identity & Branding', desc: 'Set company legal name, logo, custom portal domain, and timezone.' },
      { iconSvg: astryxIcons.key, title: 'SSO & OAuth Providers', desc: 'Configure Google Workspace, Microsoft Azure AD, and SAML 2.0 logins.' },
      { iconSvg: astryxIcons.database, title: 'Database & Backup Hub', desc: 'Inspect Turso libSQL connection state and manage isolated app databases.' }
    ],
    nextSteps: ['Company logo upload handler', 'SSO configuration form', 'Turso DB status check']
  }
];

export function renderPageCards(): string {
  return PORTAL_PAGES.map(page => `
    <div id="view-${page.id}" class="portal-page-view">
      <!-- Page Hero Header -->
      <div class="page-hero-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
              <span class="portal-card-icon" style="color: var(--forge-primary); display: flex; align-items: center;">${page.iconSvg}</span>
              <h2 style="margin: 0; font-size: 1.25rem; color: var(--forge-text-main); font-weight: 600; letter-spacing: -0.02em;">${page.title}</h2>
            </div>
            <p style="margin: 0; color: var(--forge-text-muted); font-size: 0.85rem; max-width: 750px; line-height: 1.5;">
              ${page.summary}
            </p>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
            <span class="astryx-badge badge-online">
              ${page.badge}
            </span>
            <span style="font-size: 0.74rem; color: var(--forge-text-subtle);">
              Audience: <strong style="color: var(--forge-text-muted); font-weight: 500;">${page.targetAudience}</strong>
            </span>
          </div>
        </div>

        <!-- Action Bar Preview -->
        <div style="display: flex; gap: 0.5rem; margin-top: 1.15rem; flex-wrap: wrap; align-items: center;">
          <button class="astryx-btn btn-primary" onclick="if(window.astryxToast){window.astryxToast.show('Action initialized for ${page.title}','info');}">
            ${astryxIcons.zap} Quick Action
          </button>
          <a href="#settings" class="astryx-btn btn-outline">
            Documentation &rarr;
          </a>
        </div>
      </div>

      <!-- Feature Capabilities Grid -->
      <h3 style="font-size: 0.95rem; margin: 1.25rem 0 0.65rem 0; color: var(--forge-text-main); font-weight: 600; letter-spacing: -0.01em; display: flex; align-items: center; gap: 0.4rem;">
        <span style="color: var(--forge-primary);">${astryxIcons.sparkles}</span> Key Capabilities & Workflows
      </h3>
      <div class="feature-grid">
        ${page.features.map(f => `
          <div class="feature-card">
            <h4><span style="color: var(--forge-primary); display: flex; align-items: center;">${f.iconSvg}</span> ${f.title}</h4>
            <p>${f.desc}</p>
          </div>
        `).join('')}
      </div>

      <!-- Implementation Roadmap / Next Steps -->
      <div class="astryx-card" style="margin-top: 1.25rem; background: var(--forge-bg-surface); border: 1px solid var(--forge-border);">
        <h4 style="margin: 0 0 0.65rem 0; font-size: 0.88rem; color: var(--forge-text-main); display: flex; align-items: center; gap: 0.45rem; font-weight: 600;">
          <span style="color: var(--forge-text-muted);">${astryxIcons.terminal}</span> First Version (V1) Roadmap
        </h4>
        <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.82rem; color: var(--forge-text-muted); line-height: 1.65;">
          ${page.nextSteps.map(step => `<li>${step}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

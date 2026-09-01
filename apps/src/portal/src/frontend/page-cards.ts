/**
 * @forge/portal - Page Overview Cards Component (2026 LTS)
 * Renders structured non-technical overview containers for all Employee and Admin views.
 */

export interface PageDefinition {
  id: string;
  title: string;
  category: 'Workspace' | 'Admin Console';
  icon: string;
  badge: string;
  summary: string;
  targetAudience: string;
  features: Array<{ icon: string; title: string; desc: string }>;
  nextSteps: string[];
}

export const PORTAL_PAGES: PageDefinition[] = [
  // ── Employee Workspace Views ──
  {
    id: 'canvas',
    title: 'Company Map & Org Canvas',
    category: 'Workspace',
    icon: '🗺️',
    badge: 'Core Workspace',
    summary: 'An interactive visual map of the entire organization showing teams, departments, reporting lines, and who works where.',
    targetAudience: 'All Employees & Staff',
    features: [
      { icon: '🌐', title: '2D Visual Canvas', desc: 'Pan and zoom across Macro, Meso, and Micro organizational units smoothly.' },
      { icon: '🧭', title: 'Department Hierarchies', desc: 'Instantly see team leads, direct reports, and cross-functional project pods.' },
      { icon: '🔍', title: 'Smart Search & Center', desc: 'Type any colleague name to automatically center the canvas on their node.' }
    ],
    nextSteps: ['Pan/zoom canvas engine integration', 'Real-time node positioning sync', 'Quick contact hover cards']
  },
  {
    id: 'apps',
    title: 'My Apps & Tools Hub',
    category: 'Workspace',
    icon: '🚀',
    badge: 'App Drawer',
    summary: 'A central launchpad where team members can open all company tools, forms, and custom mini-apps in one window.',
    targetAudience: 'All Employees & Staff',
    features: [
      { icon: '🧩', title: 'Sandboxed Micro-Apps', desc: 'Launch internal tools securely inside an isolated, fast-loading sandbox.' },
      { icon: '🔒', title: 'Zero-Reauth SSO', desc: 'Apps open pre-authenticated with your work identity and role tokens.' },
      { icon: '⭐', title: 'Pinned Favorites', desc: 'Pin your most-used tools to the top of your workspace for quick access.' }
    ],
    nextSteps: ['Connect Expenses & Billing Forge Apps', 'Add personal app pinning', 'Implement recent apps drawer']
  },
  {
    id: 'directory',
    title: 'People Directory',
    category: 'Workspace',
    icon: '👥',
    badge: 'Directory',
    summary: 'A searchable contact book of all colleagues with photos, job titles, department tags, email, and time zones.',
    targetAudience: 'All Employees & Staff',
    features: [
      { icon: '⚡', title: 'Instant Filtering', desc: 'Filter team members by department, office location, skills, or job title.' },
      { icon: '🕒', title: 'Local Time & Working Hours', desc: 'See coworkers’ current local time and availability before scheduling.' },
      { icon: '💬', title: 'One-Click Connect', desc: 'Quickly copy email, start a Slack chat, or view their reporting chain.' }
    ],
    nextSteps: ['Connect Turso employees table', 'Add timezone clock badge', 'Add direct Slack/email action triggers']
  },
  {
    id: 'profile',
    title: 'My Profile & Account',
    category: 'Workspace',
    icon: '👤',
    badge: 'Personal Space',
    summary: 'Personal page to view and update details, display name, contact info, working hours, active sessions, and theme preferences.',
    targetAudience: 'Individual User',
    features: [
      { icon: '🖼️', title: 'Profile Customization', desc: 'Update display name, avatar photo, bio, and department info.' },
      { icon: '🛡️', title: 'Security & Active Sessions', desc: 'View active browser logins and revoke old sessions with one click.' },
      { icon: '🔑', title: 'Personal API Tokens', desc: 'Generate scoped API tokens for CLI tools and developer scripts.' }
    ],
    nextSteps: ['Profile photo upload integration', 'Session revocation endpoint', 'Personal token generator']
  },
  {
    id: 'notifications',
    title: 'Notifications & Announcements',
    category: 'Workspace',
    icon: '🔔',
    badge: 'Inbox',
    summary: 'A centralized inbox for company-wide announcements, team updates, role modifications, and system alerts.',
    targetAudience: 'All Employees & Staff',
    features: [
      { icon: '📢', title: 'Company Announcements', desc: 'Important broadcast messages and policy updates from leadership and HR.' },
      { icon: '🔔', title: 'Activity Alerts', desc: 'Notifications when someone mentions you or when your requests are approved.' },
      { icon: '📬', title: 'Unread Management', desc: 'Mark notifications as read or filter by high-priority action items.' }
    ],
    nextSteps: ['Broadcast announcement composer', 'Real-time WebSocket event listener', 'Email digest preferences']
  },

  // ── Admin Console Views ──
  {
    id: 'admin-members',
    title: 'Team & Member Management',
    category: 'Admin Console',
    icon: '👥',
    badge: 'Admin Suite',
    summary: 'Dashboard to invite new employees, deactivate accounts, assign job titles, and grant access levels.',
    targetAudience: 'Admins & HR Managers',
    features: [
      { icon: '✉️', title: 'Invite New Employees', desc: 'Send email invitations with pre-configured department, role, and manager.' },
      { icon: '🛡️', title: 'Role & RBAC Assignment', desc: 'Assign Employee, Manager, HR Admin, or Super Admin roles in one click.' },
      { icon: '🚫', title: 'Instant Offboarding', desc: 'Immediately revoke system access and active sessions when an employee departs.' }
    ],
    nextSteps: ['Invite member modal workflow', 'Role assignment dropdown integration', 'CSV batch member import']
  },
  {
    id: 'admin-apps',
    title: 'App Store & Permissions',
    category: 'Admin Console',
    icon: '🗂️',
    badge: 'Admin Suite',
    summary: 'Admin panel to register new mini-apps, assign tools to specific departments, and manage access policies.',
    targetAudience: 'Admins & IT Leads',
    features: [
      { icon: '📦', title: 'App Catalog Registry', desc: 'Register internal Forge micro-apps with dedicated ports and ingress URLs.' },
      { icon: '🎯', title: 'Department Scoping', desc: 'Limit sensitive tools (e.g. Finance/HR) to authorized departments only.' },
      { icon: '🔌', title: 'Connector & API Keys', desc: 'Manage environment variables and API integrations per micro-app.' }
    ],
    nextSteps: ['App registration form', 'Department permission matrix', 'App health & uptime metrics']
  },
  {
    id: 'admin-org',
    title: 'Organization Chart Builder',
    category: 'Admin Console',
    icon: '🏗️',
    badge: 'Admin Suite',
    summary: 'Visual builder to create new departments, add teams, and update manager-employee reporting lines.',
    targetAudience: 'Admins & HR Leads',
    features: [
      { icon: '🧩', title: 'Drag & Drop Editor', desc: 'Reorganize teams and reporting chains visually on the 2D canvas.' },
      { icon: '🏢', title: 'Department Creator', desc: 'Create new business units, assign budget codes, and designate team leads.' },
      { icon: '🚀', title: 'Publish Changes', desc: 'Draft reorganization changes privately and publish live to the company.' }
    ],
    nextSteps: ['Draft vs Published org versioning', 'Canvas node drag-to-reparent', 'Team hierarchy export']
  },
  {
    id: 'admin-audit',
    title: 'Security & Audit Logs',
    category: 'Admin Console',
    icon: '📜',
    badge: 'Admin Suite',
    summary: 'A security timeline tracking who logged in, who made organizational changes, and when critical settings were updated.',
    targetAudience: 'Admins & Security Officers',
    features: [
      { icon: '🔍', title: 'Live Audit Stream', desc: 'Structured JSON log viewer (RFC 7807) with trace ID search and filtering.' },
      { icon: '🛡️', title: 'PII Redacted Logs', desc: 'Sensitive credentials and passwords automatically redacted before logging.' },
      { icon: '📊', title: 'Access Analytics', desc: 'Monitor login trends, failed authentication attempts, and permission changes.' }
    ],
    nextSteps: ['Structured log filter by severity', 'Export audit logs to CSV/JSON', 'Security alert webhooks']
  },
  {
    id: 'admin-settings',
    title: 'Company Settings & Security',
    category: 'Admin Console',
    icon: '⚙️',
    badge: 'Admin Suite',
    summary: 'High-level workspace settings, company branding, single sign-on (SSO/Google login) setup, and domain policies.',
    targetAudience: 'Super Admins & Workspace Owners',
    features: [
      { icon: '🏢', title: 'Company Identity & Branding', desc: 'Set company legal name, logo, custom portal domain, and timezone.' },
      { icon: '🔐', title: 'SSO & OAuth Providers', desc: 'Configure Google Workspace, Microsoft Azure AD, and SAML 2.0 logins.' },
      { icon: '💾', title: 'Database & Backup Hub', desc: 'Inspect Turso libSQL connection state and manage isolated app databases.' }
    ],
    nextSteps: ['Company logo upload handler', 'SSO configuration form', 'Turso DB status check']
  }
];

export function renderPageCards(): string {
  return PORTAL_PAGES.map((page, idx) => `
    <div id="view-${page.id}" class="portal-page-view ${idx === 0 ? 'active' : ''}">
      <!-- Page Hero Header -->
      <div class="page-hero-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
              <span style="font-size: 1.5rem;">${page.icon}</span>
              <h2 style="margin: 0; font-size: 1.4rem; color: var(--forge-text-main); font-weight: 700;">${page.title}</h2>
            </div>
            <p style="margin: 0; color: var(--forge-text-muted); font-size: 0.95rem; max-width: 750px; line-height: 1.5;">
              ${page.summary}
            </p>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem;">
            <span class="portal-badge-live" style="background: rgba(62, 207, 142, 0.1); border-color: var(--forge-primary); color: var(--forge-primary);">
              ${page.badge}
            </span>
            <span style="font-size: 0.75rem; color: var(--forge-text-muted);">
              Audience: <strong>${page.targetAudience}</strong>
            </span>
          </div>
        </div>

        <!-- Action Bar Preview -->
        <div style="display: flex; gap: 0.6rem; margin-top: 1.25rem; flex-wrap: wrap;">
          <button class="astryx-btn btn-primary" onclick="if(window.astryxToast){window.astryxToast.show('Action initialized for ${page.title}','info');}" style="font-size: 0.8rem; padding: 0.4rem 0.85rem;">
            ⚡ Quick Action
          </button>
          <a href="#settings" class="astryx-btn btn-outline" style="font-size: 0.8rem; padding: 0.4rem 0.85rem;">
            View Documentation &rarr;
          </a>
        </div>
      </div>

      <!-- Feature Capabilities Grid -->
      <h3 style="font-size: 1.05rem; margin: 1.25rem 0 0.5rem 0; color: var(--forge-text-main); font-weight: 600;">
        ✨ Key Capabilities & Workflows
      </h3>
      <div class="feature-grid">
        ${page.features.map(f => `
          <div class="feature-card">
            <h4><span>${f.icon}</span> ${f.title}</h4>
            <p>${f.desc}</p>
          </div>
        `).join('')}
      </div>

      <!-- Implementation Roadmap / Next Steps -->
      <div class="astryx-card" style="margin-top: 1.5rem; background: var(--forge-bg-surface); border: 1px solid var(--forge-border);">
        <h4 style="margin: 0 0 0.75rem 0; font-size: 0.9rem; color: var(--forge-text-main); display: flex; align-items: center; gap: 0.4rem;">
          <span>🛠️</span> First Version (V1) Roadmap
        </h4>
        <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.85rem; color: var(--forge-text-muted); line-height: 1.7;">
          ${page.nextSteps.map(step => `<li>${step}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

/**
 * @forge/portal - People Directory View Renderer (2026 LTS)
 * Searchable colleague contact book with live local timezone clocks, reporting chains, and filtering.
 */

import { astryxIcons } from '@forge/ui';

export interface ColleagueProfile {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  division: string;
  managerName: string;
  location: string;
  timezone: string;
  status: 'ONLINE' | 'BUSY' | 'AWAY' | 'OFFLINE';
  avatarInitial: string;
}

export const DIRECTORY_MEMBERS: ColleagueProfile[] = [
  {
    id: 'usr_sanket',
    name: 'Sanket Ghodake',
    email: 'sanket@forge.internal',
    jobTitle: 'Chief Executive Officer',
    department: 'Executive Leadership',
    division: 'Executive',
    managerName: 'Board of Directors',
    location: 'Mumbai, IN',
    timezone: 'Asia/Kolkata',
    status: 'ONLINE',
    avatarInitial: 'SG',
  },
  {
    id: 'usr_alex',
    name: 'Alex Laurent',
    email: 'alex.l@forge.internal',
    jobTitle: 'VP of Engineering',
    department: 'Engineering Core',
    division: 'Engineering',
    managerName: 'Sanket Ghodake',
    location: 'San Francisco, US',
    timezone: 'America/Los_Angeles',
    status: 'ONLINE',
    avatarInitial: 'AL',
  },
  {
    id: 'usr_maya',
    name: 'Maya Roberts',
    email: 'maya.r@forge.internal',
    jobTitle: 'Staff Platform Architect',
    department: 'Cloud & Infrastructure',
    division: 'Engineering',
    managerName: 'Alex Laurent',
    location: 'London, UK',
    timezone: 'Europe/London',
    status: 'ONLINE',
    avatarInitial: 'MR',
  },
  {
    id: 'usr_sarah',
    name: 'Sarah Connor',
    email: 'sarah.c@forge.internal',
    jobTitle: 'Head of Product',
    department: 'Product Strategy',
    division: 'Product',
    managerName: 'Sanket Ghodake',
    location: 'New York, US',
    timezone: 'America/New_York',
    status: 'BUSY',
    avatarInitial: 'SC',
  },
  {
    id: 'usr_elena',
    name: 'Elena Rostova',
    email: 'elena.r@forge.internal',
    jobTitle: 'Director of People Ops',
    department: 'Human Resources',
    division: 'People Ops',
    managerName: 'Sanket Ghodake',
    location: 'Berlin, DE',
    timezone: 'Europe/Berlin',
    status: 'ONLINE',
    avatarInitial: 'ER',
  },
  {
    id: 'usr_david',
    name: 'David Kim',
    email: 'david.k@forge.internal',
    jobTitle: 'Senior Security Engineer',
    department: 'Application Security',
    division: 'Engineering',
    managerName: 'Alex Laurent',
    location: 'Seoul, KR',
    timezone: 'Asia/Seoul',
    status: 'AWAY',
    avatarInitial: 'DK',
  },
];

export function renderDirectoryView(): string {
  return `
    <div id="view-directory" class="portal-page-view">
      <!-- Top Control Bar -->
      <div class="portal-view-header">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="portal-view-badge">
              <span class="badge-dot"></span>
              <span>People & Teams</span>
            </div>
            <span class="portal-view-audience" style="font-size: 0.74rem; color: var(--forge-text-subtle);">Audience: <strong style="color: var(--forge-text-muted); font-weight: 500;">All Employees & Staff</strong></span>
          </div>
          <h1 class="portal-view-title">People Directory</h1>
          <p class="portal-view-desc">
            Search colleagues, view reporting lines, discover team expertise, and check local time zones.
          </p>
        </div>

        <div class="portal-view-actions">
          <div class="canvas-search-input-wrap" style="width: 260px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="directory-search-input" placeholder="Search by name, role, or skill..." />
          </div>
        </div>
      </div>

      <!-- Filters Strip -->
      <div class="directory-filter-bar">
        <div class="filter-group">
          <label>Division:</label>
          <select id="dir-filter-division" class="astryx-select">
            <option value="all">All Divisions</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="People Ops">People Ops</option>
            <option value="Executive">Executive</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Status:</label>
          <select id="dir-filter-status" class="astryx-select">
            <option value="all">Any Status</option>
            <option value="ONLINE">Online Now</option>
            <option value="BUSY">In Meeting</option>
            <option value="AWAY">Away</option>
          </select>
        </div>

        <div class="directory-stats-label" id="directory-count-label">
          Showing <strong>${DIRECTORY_MEMBERS.length}</strong> colleagues
        </div>
      </div>

      <!-- Colleague Cards Grid -->
      <div class="directory-grid" id="directory-grid">
        ${DIRECTORY_MEMBERS.map(m => `
          <div class="colleague-card" data-member-id="${m.id}" data-division="${m.division}" data-status="${m.status}" data-name="${m.name.toLowerCase()}">
            <div class="colleague-card-header">
              <div class="colleague-avatar-wrap">
                <div class="colleague-avatar">${m.avatarInitial}</div>
                <span class="status-indicator status-${m.status.toLowerCase()}" title="${m.status}"></span>
              </div>
              <div class="colleague-meta">
                <h3 class="colleague-name">${m.name}</h3>
                <span class="colleague-role">${m.jobTitle}</span>
              </div>
            </div>

            <div class="colleague-dept-badge">${m.department}</div>

            <div class="colleague-details-list">
              <div class="detail-row">
                <span class="detail-label">Location</span>
                <span class="detail-val">${m.location}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Local Time</span>
                <span class="detail-val tz-live-clock" data-tz="${m.timezone}">--:--</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Reports To</span>
                <span class="detail-val manager-link">${m.managerName}</span>
              </div>
            </div>

            <div class="colleague-card-actions">
              <button class="astryx-btn btn-sm btn-outline copy-email-btn" data-email="${m.email}">
                ${astryxIcons.mail || '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>'}
                <span>Email</span>
              </button>
              <button class="astryx-btn btn-sm btn-ghost view-on-canvas-btn" data-name="${m.name}">
                ${astryxIcons.map || '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>'}
                <span>Map</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

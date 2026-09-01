/**
 * @forge/portal - Announcements & Inbox View Renderer (2026 LTS)
 * Company-wide broadcasts, role notifications, and direct mention alerts.
 */

import { astryxIcons } from '@forge/ui';

export interface NotificationItem {
  id: string;
  type: 'BROADCAST' | 'SECURITY' | 'ACCESS' | 'MENTION';
  title: string;
  message: string;
  sender: string;
  timestamp: string;
  isUnread: boolean;
  priority?: 'HIGH' | 'NORMAL';
}

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'BROADCAST',
    title: 'Q3 All-Hands Meeting & Product Roadmap Reveal',
    message: 'Join us this Thursday at 16:00 UTC for the quarterly company all-hands and live demo of Meta Astryx 2.0.',
    sender: 'Sanket Ghodake (CEO)',
    timestamp: '2 hours ago',
    isUnread: true,
    priority: 'HIGH',
  },
  {
    id: 'notif_2',
    type: 'ACCESS',
    title: 'Developer Dashboard Clearance Granted',
    message: 'Your account was granted the "roles/developer" scope by Alex Laurent. You can now launch Dev Dashboard.',
    sender: 'IT Access Engine',
    timestamp: 'Yesterday at 14:22',
    isUnread: true,
  },
  {
    id: 'notif_3',
    type: 'SECURITY',
    title: 'New Login from Mumbai, India',
    message: 'A new session was established from Chrome on Linux. If this was not you, revoke the session immediately.',
    sender: 'Security Monitor',
    timestamp: '2 days ago',
    isUnread: false,
  },
];

export function renderInboxView(): string {
  return `
    <div id="view-notifications" class="portal-page-view">
      <!-- Header -->
      <div class="portal-view-header">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="portal-view-badge">
              <span class="badge-dot"></span>
              <span>Notifications & Feed</span>
            </div>
            <span class="portal-view-audience" style="font-size: 0.74rem; color: var(--forge-text-subtle);">Audience: <strong style="color: var(--forge-text-muted); font-weight: 500;">All Employees & Staff</strong></span>
          </div>
          <h1 class="portal-view-title">Notifications & Announcements</h1>
          <p class="portal-view-desc">
            Stay updated with organization broadcasts, access grants, mentions, and security notifications.
          </p>
        </div>

        <div class="portal-view-actions">
          <button class="astryx-btn btn-outline" id="mark-all-read-btn">
            ${astryxIcons.check || '✓'} Mark All as Read
          </button>
        </div>
      </div>

      <!-- Notification Filter Tabs -->
      <div class="inbox-filter-bar">
        <div class="inbox-tabs">
          <button class="inbox-tab active" data-type="all">All (3)</button>
          <button class="inbox-tab" data-type="BROADCAST">Announcements</button>
          <button class="inbox-tab" data-type="ACCESS">Access & Roles</button>
          <button class="inbox-tab" data-type="SECURITY">Security</button>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="notifications-feed-list" id="notifications-feed-list">
        ${SAMPLE_NOTIFICATIONS.map(n => `
          <div class="notification-card-item ${n.isUnread ? 'is-unread' : ''}" data-id="${n.id}" data-type="${n.type}">
            <div class="notification-icon-wrap type-${n.type.toLowerCase()}">
              ${n.type === 'BROADCAST' ? (astryxIcons.bell || '📢') : ''}
              ${n.type === 'ACCESS' ? (astryxIcons.key || '🔑') : ''}
              ${n.type === 'SECURITY' ? (astryxIcons.shield || '🛡️') : ''}
            </div>

            <div class="notification-content">
              <div class="notification-top-row">
                <h3 class="notification-title">${n.title}</h3>
                <div class="notification-meta-time">
                  ${n.priority === 'HIGH' ? '<span class="astryx-badge badge-warning">High Priority</span>' : ''}
                  <span class="time-text">${n.timestamp}</span>
                </div>
              </div>

              <p class="notification-text">${n.message}</p>

              <div class="notification-bottom-row">
                <span class="notification-sender">From: <strong>${n.sender}</strong></span>
                <button class="astryx-btn btn-sm btn-ghost dismiss-notif-btn" data-id="${n.id}">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

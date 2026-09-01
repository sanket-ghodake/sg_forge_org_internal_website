/**
 * @forge/portal - Live Real-Time Notifications & Bulletin Backend Service (2026 LTS)
 * Zero-hardcoding: Database-backed SQLite / Turso storage for real notifications.
 * Clean initial state with zero hardcoded announcements.
 */

import { Database } from 'bun:sqlite';
import { resolveAuthDbPath } from './org-tree-service';
import { createLogger } from '@forge/sdk';

const logger = createLogger('portal-inbox-service');

export interface LiveNotificationItem {
  id: string;
  userId: string | null;
  orgId: string | null;
  type: 'ACTION' | 'BROADCAST' | 'CELEBRATION' | 'MENTION' | 'SECURITY';
  title: string;
  message: string;
  sender: string;
  senderRole?: string;
  timestamp: string;
  isUnread: boolean;
  priority?: 'HIGH' | 'NORMAL';
  actionLabel?: string;
  actionType?: string;
  categoryTag: string;
  createdAt: number;
}

export interface LiveCompanyEvent {
  id: string;
  title: string;
  date: string;
  type: 'HOLIDAY' | 'ALL_HANDS' | 'SOCIAL';
  relativeTime: string;
}

function getDatabase(): Database {
  const dbPath = resolveAuthDbPath();
  const db = new Database(dbPath, { create: true });
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');
  initInboxTables(db);
  return db;
}

function initInboxTables(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS portal_notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      org_id TEXT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      sender TEXT NOT NULL,
      sender_role TEXT,
      timestamp_text TEXT NOT NULL,
      is_unread INTEGER NOT NULL DEFAULT 1,
      priority TEXT DEFAULT 'NORMAL',
      action_label TEXT,
      action_type TEXT,
      category_tag TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS portal_company_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date_text TEXT NOT NULL,
      event_type TEXT NOT NULL,
      relative_time TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS portal_user_preferences (
      user_id TEXT PRIMARY KEY,
      digest_pref TEXT NOT NULL DEFAULT 'instant',
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS portal_notification_reactions (
      id TEXT PRIMARY KEY,
      notification_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      reaction_type TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (notification_id) REFERENCES portal_notifications(id) ON DELETE CASCADE
    );
  `);
}

export function clearAllNotifications(): void {
  const db = getDatabase();
  db.exec('DELETE FROM portal_notifications;');
}

export function getLiveNotifications(userId?: string, orgId?: string): LiveNotificationItem[] {
  const db = getDatabase();
  try {
    const rows = db.query<any, [string | null]>(`
      SELECT id, user_id, org_id, type, title, message, sender, sender_role,
             timestamp_text, is_unread, priority, action_label, action_type, category_tag, created_at
      FROM portal_notifications
      WHERE user_id IS NULL OR user_id = ?
      ORDER BY created_at DESC
    `).all(userId || null);

    return rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      orgId: r.org_id,
      type: r.type,
      title: r.title,
      message: r.message,
      sender: r.sender,
      senderRole: r.sender_role,
      timestamp: r.timestamp_text,
      isUnread: Boolean(r.is_unread),
      priority: r.priority,
      actionLabel: r.action_label,
      actionType: r.action_type,
      categoryTag: r.category_tag,
      createdAt: r.created_at,
    }));
  } catch (err: any) {
    logger.error('Failed to query notifications from database', err);
    return [];
  }
}

export function createNotification(notif: Omit<LiveNotificationItem, 'createdAt'>): boolean {
  const db = getDatabase();
  try {
    const stmt = db.prepare(`
      INSERT INTO portal_notifications (
        id, user_id, org_id, type, title, message, sender, sender_role,
        timestamp_text, is_unread, priority, action_label, action_type, category_tag, created_at
      ) VALUES (
        $id, $user_id, $org_id, $type, $title, $message, $sender, $sender_role,
        $timestamp_text, $is_unread, $priority, $action_label, $action_type, $category_tag, $created_at
      )
    `);

    stmt.run({
      $id: notif.id,
      $user_id: notif.userId || null,
      $org_id: notif.orgId || null,
      $type: notif.type,
      $title: notif.title,
      $message: notif.message,
      $sender: notif.sender,
      $sender_role: notif.senderRole || null,
      $timestamp_text: notif.timestamp,
      $is_unread: notif.isUnread ? 1 : 0,
      $priority: notif.priority || 'NORMAL',
      $action_label: notif.actionLabel || null,
      $action_type: notif.actionType || null,
      $category_tag: notif.categoryTag,
      $created_at: Date.now(),
    });
    return true;
  } catch (err: any) {
    logger.error('Failed to create notification', err);
    return false;
  }
}

export function markAllNotificationsAsRead(userId?: string): boolean {
  const db = getDatabase();
  try {
    if (userId) {
      db.run('UPDATE portal_notifications SET is_unread = 0 WHERE user_id IS NULL OR user_id = ?', [userId]);
    } else {
      db.run('UPDATE portal_notifications SET is_unread = 0');
    }
    return true;
  } catch (err: any) {
    logger.error('Failed to mark notifications as read', err);
    return false;
  }
}

export function dismissNotification(notificationId: string): boolean {
  const db = getDatabase();
  try {
    db.run('DELETE FROM portal_notifications WHERE id = ?', [notificationId]);
    return true;
  } catch (err: any) {
    logger.error('Failed to dismiss notification', err);
    return false;
  }
}

export function recordCelebration(notificationId: string, userId: string): boolean {
  const db = getDatabase();
  try {
    db.run(
      'INSERT OR IGNORE INTO portal_notification_reactions (id, notification_id, user_id, reaction_type, created_at) VALUES (?, ?, ?, ?, ?)',
      [`rx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, notificationId, userId, 'CELEBRATE', Date.now()]
    );
    return true;
  } catch (err: any) {
    logger.error('Failed to record celebration reaction', err);
    return false;
  }
}

export function getLiveCompanyEvents(): LiveCompanyEvent[] {
  const db = getDatabase();
  try {
    const rows = db.query<any, []>('SELECT id, title, date_text, event_type, relative_time FROM portal_company_events ORDER BY created_at ASC').all();
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      date: r.date_text,
      type: r.event_type,
      relativeTime: r.relative_time,
    }));
  } catch (err: any) {
    logger.error('Failed to query company events', err);
    return [];
  }
}

export function getUserDeliveryPreference(userId: string): string {
  const db = getDatabase();
  try {
    const row = db.query<{ digest_pref: string }, [string]>('SELECT digest_pref FROM portal_user_preferences WHERE user_id = ?').get(userId);
    return row?.digest_pref || 'instant';
  } catch {
    return 'instant';
  }
}

export function setUserDeliveryPreference(userId: string, pref: string): boolean {
  const db = getDatabase();
  try {
    db.run(`
      INSERT INTO portal_user_preferences (user_id, digest_pref, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET digest_pref = excluded.digest_pref, updated_at = excluded.updated_at
    `, [userId, pref, Date.now()]);
    return true;
  } catch (err: any) {
    logger.error('Failed to save user delivery preference', err);
    return false;
  }
}

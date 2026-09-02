/**
 * @forge/auth - Security Audit Logger & Activity Engine (2026 LTS)
 * Records tamper-evident security telemetry for logins, password changes, and access grants.
 */

import { getAuthDb } from '../db/db';
import { generateSecureToken, hashToken } from './crypto';

export type AuditAction =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_PASSWORD_CHANGED'
  | 'AUTH_MFA_ENROLLED'
  | 'AUTH_SESSION_REVOKED'
  | 'AUTH_RATE_LIMITED'
  | 'EMPLOYEE_CREATED'
  | 'EMPLOYEE_UPDATED'
  | 'EMPLOYEE_REVOKED'
  | 'EMPLOYEE_BULK_ACTION'
  | 'EMPLOYEE_BATCH_IMPORTED';

export interface AuditEventParams {
  orgId: string;
  actorId: string;
  action: AuditAction;
  resource: string;
  status: 'SUCCESS' | 'DENIED' | 'ERROR';
  details?: Record<string, unknown>;
  ip?: string;
}

export function logAuditEvent(params: AuditEventParams): void {
  try {
    const db = getAuthDb();
    const id = `aud_${generateSecureToken(16)}`;
    const ipHash = params.ip ? hashToken(params.ip).slice(0, 16) : null;
    const detailsJson = JSON.stringify(params.details || {});
    const now = Date.now();

    db.run(
      `INSERT INTO auth_audit_logs (id, org_id, actor_id, action, resource, status, details, ip_hash, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        params.orgId,
        params.actorId,
        params.action,
        params.resource,
        params.status,
        detailsJson,
        ipHash,
        now,
      ]
    );
  } catch {
    // Fail-safe: Audit logger should not crash main request pipeline
  }
}

export function getUserAuditHistory(userId: string, limit: number = 20): Array<{
  id: string;
  action: string;
  status: string;
  details: Record<string, unknown>;
  timestamp: number;
}> {
  const db = getAuthDb();
  const rows = db
    .query(
      `SELECT id, action, status, details, timestamp
       FROM auth_audit_logs
       WHERE actor_id = ?
       ORDER BY timestamp DESC
       LIMIT ?;`
    )
    .all(userId, limit) as any[];

  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    status: r.status,
    details: JSON.parse(r.details || '{}'),
    timestamp: r.timestamp,
  }));
}

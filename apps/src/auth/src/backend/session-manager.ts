/**
 * @forge/auth - Session Manager & Refresh Token Rotation (2026 LTS)
 * ASVS 5.0 Compliant: Refresh Token Rotation (RTR) & Replay Attack Defense.
 */

import { getAuthDb } from '../db/db';
import { generateSecureToken, hashToken, signJwt } from './crypto';
import { evaluateUserPermissions } from './iam-engine';
import { createLogger } from '@forge/sdk';

const logger = createLogger('auth-session');

const REFRESH_TOKEN_EXPIRY_SECONDS = Number(
  process.env.JWT_REFRESH_TOKEN_EXPIRY_SECONDS || 7 * 24 * 3600
); // 7 days default
const ACCESS_TOKEN_EXPIRY_SECONDS = Number(
  process.env.JWT_ACCESS_TOKEN_EXPIRY_SECONDS || process.env.JWT_EXPIRY_SECONDS || 900
); // 15 minutes default

export interface SessionIssueResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    displayName: string;
    principalType: string;
    orgId: string;
    roles: string[];
    permissions: string[];
  };
}

export function createSession(
  userId: string,
  userAgent: string | null = null,
  ipHash: string | null = null
): SessionIssueResult | null {
  const db = getAuthDb();

  const user = db
    .query(
      `SELECT id, org_id, email, display_name, principal_type, status, token_version
       FROM auth_users WHERE id = ? AND status = 'ACTIVE';`
    )
    .get(userId) as any;

  if (!user) return null;

  const { roles, permissions } = evaluateUserPermissions(user.id, user.org_id);
  const rawRefreshToken = generateSecureToken(48);
  const tokenHash = hashToken(rawRefreshToken);
  const familyId = `fam_${generateSecureToken(16)}`;
  const sessionId = `sess_${generateSecureToken(16)}`;
  const now = Date.now();
  const expiresAt = now + REFRESH_TOKEN_EXPIRY_SECONDS * 1000;

  db.run(
    `INSERT INTO auth_sessions (id, user_id, org_id, refresh_token_hash, family_id, is_revoked, user_agent, ip_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?);`,
    [sessionId, user.id, user.org_id, tokenHash, familyId, userAgent, ipHash, expiresAt, now]
  );

  const accessToken = signJwt(
    {
      iss: 'https://forge.internal/auth',
      sub: user.id,
      email: user.email,
      display_name: user.display_name,
      principal_type: user.principal_type,
      org_id: user.org_id,
      roles,
      permissions,
      token_version: user.token_version,
    },
    ACCESS_TOKEN_EXPIRY_SECONDS
  );

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      principalType: user.principal_type,
      orgId: user.org_id,
      roles,
      permissions,
    },
  };
}

export function rotateRefreshToken(
  rawRefreshToken: string,
  userAgent: string | null = null,
  ipHash: string | null = null
): SessionIssueResult | { error: string } {
  const db = getAuthDb();
  const tokenHash = hashToken(rawRefreshToken);

  const session = db
    .query(
      `SELECT s.id, s.user_id, s.org_id, s.family_id, s.is_revoked, s.expires_at,
              u.email, u.display_name, u.principal_type, u.status, u.token_version
       FROM auth_sessions s
       JOIN auth_users u ON s.user_id = u.id
       WHERE s.refresh_token_hash = ?;`
    )
    .get(tokenHash) as any;

  if (!session) {
    return { error: 'Invalid refresh token' };
  }

  // REPLAY ATTACK DETECTION: If token was already revoked, kill the entire family!
  if (session.is_revoked === 1) {
    logger.warn(`Security alert: Replay attempt detected for family ${session.family_id}. Revoking family.`);
    db.run(`UPDATE auth_sessions SET is_revoked = 1 WHERE family_id = ?;`, [session.family_id]);
    return { error: 'Session compromised. All sessions revoked.' };
  }

  if (Date.now() > session.expires_at || session.status !== 'ACTIVE') {
    db.run(`UPDATE auth_sessions SET is_revoked = 1 WHERE id = ?;`, [session.id]);
    return { error: 'Session expired or user inactive' };
  }

  // Revoke the current single refresh token
  db.run(`UPDATE auth_sessions SET is_revoked = 1 WHERE id = ?;`, [session.id]);

  // Issue new rotated token in the same family
  const newRawRefreshToken = generateSecureToken(48);
  const newTokenHash = hashToken(newRawRefreshToken);
  const newSessionId = `sess_${generateSecureToken(16)}`;
  const now = Date.now();
  const expiresAt = now + REFRESH_TOKEN_EXPIRY_SECONDS * 1000;

  db.run(
    `INSERT INTO auth_sessions (id, user_id, org_id, refresh_token_hash, family_id, is_revoked, user_agent, ip_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?);`,
    [newSessionId, session.user_id, session.org_id, newTokenHash, session.family_id, userAgent, ipHash, expiresAt, now]
  );

  const { roles, permissions } = evaluateUserPermissions(session.user_id, session.org_id);

  const accessToken = signJwt(
    {
      iss: 'https://forge.internal/auth',
      sub: session.user_id,
      email: session.email,
      display_name: session.display_name,
      principal_type: session.principal_type,
      org_id: session.org_id,
      roles,
      permissions,
      token_version: session.token_version,
    },
    ACCESS_TOKEN_EXPIRY_SECONDS
  );

  return {
    accessToken,
    refreshToken: newRawRefreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
    user: {
      id: session.user_id,
      email: session.email,
      displayName: session.display_name,
      principalType: session.principal_type,
      orgId: session.org_id,
      roles,
      permissions,
    },
  };
}

export function revokeSession(rawRefreshToken: string): boolean {
  const db = getAuthDb();
  const tokenHash = hashToken(rawRefreshToken);
  const res = db.run(`UPDATE auth_sessions SET is_revoked = 1 WHERE refresh_token_hash = ?;`, [tokenHash]);
  return res.changes > 0;
}

export function getUserActiveSessions(userId: string): Array<{
  id: string;
  userAgent: string | null;
  ipHash: string | null;
  createdAt: number;
  expiresAt: number;
}> {
  const db = getAuthDb();
  const now = Date.now();
  const rows = db
    .query(
      `SELECT id, user_agent, ip_hash, created_at, expires_at
       FROM auth_sessions
       WHERE user_id = ? AND is_revoked = 0 AND expires_at > ?
       ORDER BY created_at DESC;`
    )
    .all(userId, now) as any[];

  return rows.map((r) => ({
    id: r.id,
    userAgent: r.user_agent,
    ipHash: r.ip_hash,
    createdAt: r.created_at,
    expiresAt: r.expires_at,
  }));
}

export function revokeOtherSessions(userId: string, currentRawRefreshToken: string): number {
  const db = getAuthDb();
  const currentTokenHash = hashToken(currentRawRefreshToken);
  const res = db.run(
    `UPDATE auth_sessions
     SET is_revoked = 1
     WHERE user_id = ? AND refresh_token_hash != ? AND is_revoked = 0;`,
    [userId, currentTokenHash]
  );
  return res.changes;
}

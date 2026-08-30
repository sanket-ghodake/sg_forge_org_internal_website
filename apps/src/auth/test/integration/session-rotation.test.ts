/**
 * @forge/auth/test/integration - Session Rotation & Multi-Device Revocation (Tier 2)
 * 3A Pattern (Arrange, Act, Assert)
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { seedAuthDatabase } from '../../src/db/seed';
import {
  createSession,
  rotateRefreshToken,
  getUserActiveSessions,
  revokeOtherSessions,
  revokeSession,
} from '../../src/backend/session-manager';

describe('Tier 2 Integration: Session Rotation & Device Management', () => {
  beforeEach(() => {
    seedAuthDatabase(true);
  });

  it('should rotate refresh tokens and revoke on logout', () => {
    // 1. Arrange: Create initial session
    const session = createSession('usr-superadmin', 'Mozilla/5.0 Mac', '127.0.0.1');
    expect(session).toBeDefined();

    // 2. Act: Rotate refresh token
    const rotated = rotateRefreshToken(session!.refreshToken, 'Mozilla/5.0 Mac', '127.0.0.1');
    expect('error' in rotated).toBe(false);

    if (!('error' in rotated)) {
      expect(rotated.refreshToken).not.toBe(session!.refreshToken);

      // 3. Act: Explicit logout
      const revoked = revokeSession(rotated.refreshToken);
      expect(revoked).toBe(true);

      // Verify old token fails
      const failedRotate = rotateRefreshToken(rotated.refreshToken, 'Mozilla/5.0 Mac', '127.0.0.1');
      expect('error' in failedRotate).toBe(true);
    }
  });

  it('should list active device sessions and support remote revocation of other sessions', () => {
    // 1. Arrange: Create multiple device sessions for the same user
    const laptop = createSession('usr-superadmin', 'Chrome / macOS Laptop', '192.168.1.10');
    const phone = createSession('usr-superadmin', 'Safari / iPhone', '192.168.1.15');
    const workPc = createSession('usr-superadmin', 'Firefox / Linux Desktop', '192.168.1.20');

    // 2. Act: Query active sessions
    const active = getUserActiveSessions('usr-superadmin');
    expect(active.length).toBe(3);

    // 3. Act: Laptop user clicks "Log Out Everywhere Else"
    const revokedCount = revokeOtherSessions('usr-superadmin', laptop!.refreshToken);
    expect(revokedCount).toBe(2);

    // 4. Assert: Only laptop remains active
    const remaining = getUserActiveSessions('usr-superadmin');
    expect(remaining.length).toBe(1);
    expect(remaining[0].userAgent).toContain('macOS');
  });
});

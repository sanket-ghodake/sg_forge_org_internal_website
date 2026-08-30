/**
 * @forge/auth/test/security - Anti-Brute-Force & Sliding Window Tests (Tier 3)
 * 3A Pattern (Arrange, Act, Assert)
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { seedAuthDatabase } from '../../src/db/seed';
import { handleLogin } from '../../src/backend/api-handlers';
import { resetAttempts } from '../../src/backend/rate-limiter';

describe('Tier 3 Security: Anti-Brute-Force Rate Limiting', () => {
  beforeEach(() => {
    seedAuthDatabase(true);
    resetAttempts('10.0.0.1', 'target.victim@forge.internal');
  });

  it('should block rapid credential stuffing attacks with HTTP 429 after 5 failed attempts', async () => {
    // 1. Arrange: Send 5 failed login attempts
    for (let i = 0; i < 5; i++) {
      const badReq = new Request('http://localhost:3004/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.1' },
        body: JSON.stringify({
          email: 'target.victim@forge.internal',
          password: `BadAttempt${i}!`,
        }),
      });
      const res = await handleLogin(badReq);
      expect(res.status).toBe(401);
    }

    // 2. Act: 6th attempt (even with correct password)
    const blockedReq = new Request('http://localhost:3004/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.1' },
      body: JSON.stringify({
        email: 'target.victim@forge.internal',
        password: 'password123',
      }),
    });
    const blockedRes = await handleLogin(blockedReq);
    const blockedData = await blockedRes.json();

    // 3. Assert: Blocked by rate limiter shield
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.headers.get('retry-after')).toBeDefined();
    expect(blockedData.title).toBe('Too Many Requests');
  });
});

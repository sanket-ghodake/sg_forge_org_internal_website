/**
 * @forge/auth/test/integration - Auth Lifecycle & Password Setup (Tier 2)
 * 3A Pattern (Arrange, Act, Assert)
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { seedAuthDatabase } from '../../src/db/seed';
import { handleLogin, handleSetPassword } from '../../src/backend/api-handlers';

describe('Tier 2 Integration: Auth Lifecycle & First-Time Password Setup', () => {
  beforeEach(() => {
    seedAuthDatabase(true);
  });

  it('should enforce MUST_CHANGE_PASSWORD on first login and complete password setup', async () => {
    // 1. Arrange & Act: Login with default password
    const loginReq = new Request('http://localhost:3004/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'superadmin@forge.internal',
        password: 'password123',
      }),
    });

    const loginRes = await handleLogin(loginReq);
    const loginData = await loginRes.json();

    // Assert Intercept
    expect(loginRes.status).toBe(200);
    expect(loginData.status).toBe('MUST_CHANGE_PASSWORD');
    expect(loginData.tempToken).toBeDefined();

    // 2. Act: Complete Password Setup
    const setPwdReq = new Request('http://localhost:3004/api/v1/auth/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tempToken: loginData.tempToken,
        newPassword: 'MyNewUltraSecurePassword2026!',
      }),
    });

    const setPwdRes = await handleSetPassword(setPwdReq);
    const setPwdData = await setPwdRes.json();

    // Assert Completion
    expect(setPwdRes.status).toBe(200);
    expect(setPwdData.status).toBe('SUCCESS');
    expect(setPwdData.accessToken).toBeDefined();
    expect(setPwdData.user.email).toBe('superadmin@forge.internal');

    // 3. Act: Login with newly established password
    const newLoginReq = new Request('http://localhost:3004/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'superadmin@forge.internal',
        password: 'MyNewUltraSecurePassword2026!',
      }),
    });

    const newLoginRes = await handleLogin(newLoginReq);
    const newLoginData = await newLoginRes.json();

    // Assert Normal Login
    expect(newLoginRes.status).toBe(200);
    expect(newLoginData.status).toBe('SUCCESS');
    expect(newLoginData.accessToken).toBeDefined();
  });
});

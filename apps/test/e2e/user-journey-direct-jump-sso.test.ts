/**
 * @forge/platform - Direct-Jump Microservice SSO & RBAC Journey (Tier 5)
 * Live Network Loopback Test (Testing for Truth - Google & Meta SRE Standard)
 * 3A Pattern (Arrange, Act, Assert)
 */

import { describe, expect, it, beforeEach, afterEach } from 'bun:test';
import { seedAuthDatabase } from '../../src/auth/src/db/seed';
import { handleLogin, handleSetPassword } from '../../src/auth/src/backend/api-handlers';
import { startExpensesServer } from '../../../forge-apps/expenses/src/server';
import { startBillingServer } from '../../../forge-apps/billing/src/server';
import { startTelemetryServer } from '../../../forge-apps/telemetry/src/server';
import { createSafeHandler } from '@forge/sdk';

describe('Tier 5 E2E Journey: Direct-Jump Microservice SSO & RBAC Access Enforcement', () => {
  let authServer: any = null;
  let expensesServer: any = null;
  let billingServer: any = null;
  let telemetryServer: any = null;

  beforeEach(() => {
    seedAuthDatabase(true);
  });

  afterEach(() => {
    if (authServer) authServer.stop(true);
    if (expensesServer) expensesServer.stop(true);
    if (billingServer) billingServer.stop(true);
    if (telemetryServer) telemetryServer.stop(true);
  });

  it('should redirect unauthenticated jump, establish SSO session, enforce RBAC, and serve public apps without auth', async () => {
    // 1. Arrange: Start live HTTP listeners on ephemeral ports
    const authHandler = createSafeHandler('auth-live-test', async (req) => {
      const url = new URL(req.url);
      if (url.pathname === '/api/v1/auth/login') return handleLogin(req);
      if (url.pathname === '/api/v1/auth/set-password') return handleSetPassword(req);
      return new Response('Not Found', { status: 404 });
    });

    authServer = Bun.serve({ port: 0, fetch: authHandler });
    expensesServer = startExpensesServer(0);
    billingServer = startBillingServer(0);
    telemetryServer = startTelemetryServer(0);

    const expensesUrl = `http://localhost:${expensesServer.port}/apps/expenses`;
    const billingUrl = `http://localhost:${billingServer.port}/apps/billing`;
    const telemetryUrl = `http://localhost:${telemetryServer.port}/apps/telemetry`;

    // 2. Act - Step 1: Public App access (Telemetry) requires NO auth
    const publicRes = await fetch(telemetryUrl);
    expect(publicRes.status).toBe(200);
    const publicHtml = await publicRes.text();
    expect(publicHtml).toContain('PUBLIC ACCESS');

    // 3. Act - Step 2: Unauthenticated jump to Expenses
    const initialExpensesRes = await fetch(expensesUrl, { redirect: 'manual' });
    expect(initialExpensesRes.status).toBe(302);
    const redirectLocation = initialExpensesRes.headers.get('location');
    expect(redirectLocation).toContain('/auth/login?return_url=');

    // 4. Act - Step 3: Login as standard employee (Alice)
    const loginRes = await fetch(`http://localhost:${authServer.port}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice.eng@forge.internal', password: 'password123' }),
    });
    const loginData = await loginRes.json();

    const setPwdRes = await fetch(`http://localhost:${authServer.port}/api/v1/auth/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempToken: loginData.tempToken, newPassword: 'AliceNewSecurePass9988!#' }),
    });
    const setCookie = setPwdRes.headers.get('set-cookie') || '';
    const match = setCookie.match(/forge_session=([^;]+)/);
    expect(match).not.toBeNull();
    const aliceSession = match![1];

    // 5. Act - Step 4: Access Expenses with Alice's session cookie
    const authedExpensesRes = await fetch(expensesUrl, {
      headers: { Cookie: `forge_session=${aliceSession}` },
      redirect: 'manual',
    });
    expect(authedExpensesRes.status).toBe(200);
    const expensesHtml = await authedExpensesRes.text();
    expect(expensesHtml).toContain('alice.eng@forge.internal');
    expect(expensesHtml).toContain('Expense Approval Engine');

    // 6. Act - Step 5: Jump to Billing with same session (Alice lacks billing.admin role)
    const forbiddenBillingRes = await fetch(billingUrl, {
      headers: { Cookie: `forge_session=${aliceSession}` },
      redirect: 'manual',
    });
    expect(forbiddenBillingRes.status).toBe(403);
    const forbiddenHtml = await forbiddenBillingRes.text();
    expect(forbiddenHtml).toContain('403');
    expect(forbiddenHtml).toContain('Access Restricted');
    expect(forbiddenHtml).toContain('alice.eng@forge.internal');

    // 7. Act - Step 6: Login as Billing Admin (Marcus)
    const marcusLogin = await fetch(`http://localhost:${authServer.port}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'billing.admin@forge.internal', password: 'password123' }),
    });
    const marcusData = await marcusLogin.json();

    const marcusSetPwd = await fetch(`http://localhost:${authServer.port}/api/v1/auth/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempToken: marcusData.tempToken, newPassword: 'MarcusBillingAdminPass2026!#' }),
    });
    const marcusCookie = (marcusSetPwd.headers.get('set-cookie') || '').match(/forge_session=([^;]+)/)![1];

    // 8. Act - Step 7: Access Billing with Marcus's session -> 200 OK
    const billingOkRes = await fetch(billingUrl, {
      headers: { Cookie: `forge_session=${marcusCookie}` },
      redirect: 'manual',
    });
    expect(billingOkRes.status).toBe(200);
    const billingHtml = await billingOkRes.text();
    expect(billingHtml).toContain('billing.admin@forge.internal');
    expect(billingHtml).toContain('Invoicing & Billing Service');
  });
});

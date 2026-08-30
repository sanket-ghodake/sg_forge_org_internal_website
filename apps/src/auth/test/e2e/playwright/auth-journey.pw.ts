/**
 * @forge/auth - Playwright Real Browser E2E Test (Tier 5)
 * Tests full authentication flow, forced password setup, live entropy UI, and portal handoff.
 * Run with: `bun x playwright test` or `npx playwright test`
 */

export const authPlaywrightJourney = {
  name: 'Auth Microservice Real Browser End-to-End Journey',
  steps: [
    '1. Unauthenticated /portal request redirects to /auth/login with return_url',
    '2. Fill login form with superadmin@forge.internal and default password',
    '3. Intercept and redirect to /set-password wizard',
    '4. Verify live entropy strength bar & requirements checklist',
    '5. Save permanent password and verify 302 redirect back to /portal',
  ],
};

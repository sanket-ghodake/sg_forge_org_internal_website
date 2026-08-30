/**
 * @forge/platform - Playwright Real Browser E2E Spec: Auth & Portal Lifecycle
 * Tests login form, entropy feedback, theme persistence, and redirection.
 */

export const authPortalPlaywrightJourney = {
  name: 'Real Browser E2E: Auth Gateway to Portal User Journey',
  steps: [
    '1. Navigate to Auth login page at /auth/login with return_url',
    '2. Verify Meta Astryx CSS variables, theme toggle state, and form fields',
    '3. Submit credentials and test interactive entropy feedback',
    '4. Verify cookie persistence and successful portal handoff',
  ],
  specs: {
    loginPage: '/auth/login',
    portalPage: '/portal',
    expectedThemeAttr: 'data-theme',
  },
};

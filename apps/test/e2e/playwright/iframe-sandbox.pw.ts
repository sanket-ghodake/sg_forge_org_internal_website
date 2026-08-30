/**
 * @forge/platform - Playwright Real Browser E2E Spec: Micro-App Iframe Sandboxing
 * Validates sandbox security attributes and postMessage protocol boundaries.
 */

export const iframeSandboxPlaywrightJourney = {
  name: 'Real Browser E2E: Micro-App Iframe Sandboxing & postMessage Protocol',
  requiredSandboxDirectives: ['allow-scripts', 'allow-same-origin', 'allow-forms'],
  disallowedSandboxDirectives: ['allow-top-navigation-by-user-activation allow-same-origin allow-top-navigation'],
  protocols: {
    init: 'FORGE_APP_INIT',
    context: 'FORGE_APP_CONTEXT',
  },
};

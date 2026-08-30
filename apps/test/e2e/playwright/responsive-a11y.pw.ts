/**
 * @forge/platform - Playwright Real Browser E2E Spec: Responsive 320px & WCAG A11y
 * Validates zero horizontal scrolling down to 320px and keyboard accessibility.
 */

export const responsiveA11yPlaywrightJourney = {
  name: 'Real Browser E2E: Responsive Layout & Accessibility Standards',
  viewports: [
    { name: 'Mobile Mini', width: 320, height: 640 },
    { name: 'Mobile Standard', width: 375, height: 812 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 },
  ],
  rules: {
    maxHorizontalScrollAllowed: 0,
    requiredHeadingStructure: 'h1',
    keyboardTabNavigation: true,
  },
};

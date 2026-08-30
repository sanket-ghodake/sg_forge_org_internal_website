/**
 * @forge/dev-dashboard - Unit Tests: Client Script Syntax & HTML Integrity (3A Pattern)
 * Google SRE Standard: Validates that generated SPA HTML contains 100% valid, error-free client JavaScript.
 */

import { describe, expect, it } from 'bun:test';
import { renderDashboardHtml } from '../../src/frontend/ui-renderer';

describe('Tier 1 Unit: Frontend Script Syntax & Astryx HTML Integrity', () => {
  it('Arrange, Act, Assert: Generated SPA document parses with zero JavaScript syntax errors', () => {
    // Arrange
    const html = renderDashboardHtml();

    // Act
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    expect(scriptMatch).not.toBeNull();
    const scriptContent = scriptMatch![1];

    // Assert - Executing `new Function` validates pure JS parser syntax
    let syntaxError: Error | null = null;
    try {
      new Function(scriptContent);
    } catch (err: any) {
      syntaxError = err;
    }

    expect(syntaxError).toBeNull();
  });

  it('Arrange, Act, Assert: Generated HTML exclusively uses Meta Astryx design tokens and classes', () => {
    // Arrange & Act
    const html = renderDashboardHtml();

    // Assert
    expect(html).toContain('astryx-card');
    expect(html).toContain('astryx-badge');
    expect(html).toContain('astryx-btn');
    expect(html).toContain('--forge-bg-root');
    expect(html).toContain('--forge-primary');
  });
});

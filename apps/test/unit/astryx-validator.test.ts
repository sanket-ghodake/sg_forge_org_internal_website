/**
 * @forge/ui - Meta Astryx Validator & Compliance Test Suite (2026 LTS Baseline)
 * 3A Pattern (Arrange, Act, Assert) for UI Token Governance & AST Compliance
 */
import { describe, expect, it } from 'bun:test';
import { themeTokens } from '@forge/ui';
import { validateAstryx } from '../../../portables/astryx/bin/astryx';

describe('Meta Astryx UI Validator & Token Governance Engine', () => {
  it('validates entire active monorepo with 100% Astryx token compliance', () => {
    // Arrange & Act
    const result = validateAstryx();

    // Assert
    expect(result.valid).toBe(true);
    expect(result.violations.length).toBe(0);
    expect(result.fileCount).toBeGreaterThanOrEqual(15);
  });

  it('guarantees complete token symmetry between dark and light themes', () => {
    // Arrange
    const darkKeys = Object.keys(themeTokens.dark).sort();
    const lightKeys = Object.keys(themeTokens.light).sort();

    // Act & Assert
    expect(darkKeys).toEqual(lightKeys);
    expect(darkKeys.length).toBeGreaterThanOrEqual(10);
    expect(themeTokens.dark.primaryGradient).toContain('linear-gradient');
    expect(themeTokens.light.primaryGradient).toContain('linear-gradient');
  });

  it('enforces mandatory CSS variables across all core tokens', () => {
    // Arrange & Act
    const { getAstryxStyles } = require('../../src/ui/src/index');
    const css = getAstryxStyles();

    // Assert
    expect(css).toContain('--forge-bg-root');
    expect(css).toContain('--forge-bg-surface');
    expect(css).toContain('--forge-bg-card');
    expect(css).toContain('--forge-border');
    expect(css).toContain('--forge-primary');
    expect(css).toContain('--forge-accent');
    expect(css).toContain('--forge-text-main');
    expect(css).toContain('--forge-text-muted');
    expect(css).toContain('--forge-transition');
  });
});

/**
 * @forge/landing - Tier 1 Unit: Catalog Grouping & Metadata Resolution
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { loadServiceRegistry, type ServiceEntry } from '@forge/sdk';

describe('Tier 1 Unit: Landing Catalog Grouping', () => {
  it('groups registered services into structured categories', () => {
    // Arrange
    const services = loadServiceRegistry();

    // Act
    const categories: Record<string, ServiceEntry[]> = {};
    for (const s of services) {
      if (!categories[s.category]) categories[s.category] = [];
      categories[s.category].push(s);
    }

    // Assert
    expect(Object.keys(categories).length).toBeGreaterThan(0);
    expect(categories['Core Enterprise Services']).toBeDefined();
    expect(categories['Isolated Polyglot Forge Micro-Apps']).toBeDefined();
  });
});

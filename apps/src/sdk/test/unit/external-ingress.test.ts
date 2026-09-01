/**
 * @forge/sdk - Tier 1 Unit: External Upstream & Remote Service Ingress Test
 */

import { describe, expect, it } from 'bun:test';
import { loadServiceRegistry } from '../../src/registry';

describe('Tier 1 Unit: External Service & Remote Ingress Resolution', () => {
  it('should resolve standard container upstreams and custom external hosts', () => {
    const services = loadServiceRegistry();
    const expenses = services.find((s) => s.id === 'expenses');

    expect(expenses).toBeDefined();
    expect(expenses?.upstreamUrl).toContain(':8085');
    expect(expenses?.path).toBe('/apps/expenses');
  });
});

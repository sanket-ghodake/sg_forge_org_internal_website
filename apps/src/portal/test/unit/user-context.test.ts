/**
 * @forge/portal - Tier 1 Unit: User Context & Role-Based App Clearance
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { getPortalApps } from '../../src/frontend/ui-apps-data';

describe('Tier 1 Unit: Portal User Context & Role Clearance', () => {
  it('Arrange, Act, Assert: restricts privileged apps for standard employee roles', () => {
    // Arrange: User with only standard employee roles
    const employeeRoles = ['roles/employee'];

    // Act
    const { activeApps, marketplaceApps } = getPortalApps(employeeRoles);

    // Assert: Expenses is active, while restricted Billing is in marketplace / requests
    expect(activeApps.length).toBeGreaterThanOrEqual(1);
    const activeIds = activeApps.map((a) => a.id);
    expect(activeIds).toContain('expenses');
    expect(activeIds).not.toContain('billing');

    const marketplaceIds = marketplaceApps.map((a) => a.id);
    expect(marketplaceIds).toContain('billing');
  });

  it('Arrange, Act, Assert: grants full active access to billing.admin role', () => {
    // Arrange: User with billing admin role
    const adminRoles = ['roles/employee', 'roles/billing.admin'];

    // Act
    const { activeApps } = getPortalApps(adminRoles);

    // Assert: Billing is now actively unlocked
    const activeIds = activeApps.map((a) => a.id);
    expect(activeIds).toContain('billing');
  });

  it('Arrange, Act, Assert: unlocks all restricted apps for super_admin role', () => {
    // Arrange: Superadmin
    const superRoles = ['roles/super_admin'];

    // Act
    const { activeApps, marketplaceApps } = getPortalApps(superRoles);

    // Assert: All registered apps are active
    const activeIds = activeApps.map((a) => a.id);
    expect(activeIds).toContain('billing');
    expect(activeIds).toContain('expenses');
    expect(marketplaceApps.length).toBe(0);
  });
});

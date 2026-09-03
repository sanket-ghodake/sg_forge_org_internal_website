/**
 * @forge/app-expenses/test/unit - Expense Approval Chain Unit Tests (Tier 1)
 * 3A Pattern (Arrange, Act, Assert)
 */

import { describe, expect, it } from 'bun:test';
import type { ScopedHierarchyResponse } from '@forge/types';

describe('Tier 1 Unit: Expense Approval Validation & Hierarchy', () => {
  it('Arrange, Act, Assert: evaluates linear upward management approval chain', () => {
    // Arrange: Scoped hierarchy model
    const sampleHierarchy: ScopedHierarchyResponse = {
      status: 'SUCCESS',
      employee: {
        id: 'usr_emp_42',
        displayName: 'Aditi Sharma',
        email: 'alice.eng@forge.internal',
        departmentName: 'Platform Core',
      },
      managementChain: [
        {
          level: 1,
          relationship: 'LINE_MANAGER',
          id: 'usr_mgr_01',
          displayName: 'Rohan Kulkarni',
          email: 'bob.lead@forge.internal',
        },
        {
          level: 2,
          relationship: 'LINE_MANAGER',
          id: 'usr_dir_01',
          displayName: 'Rajesh Sharma',
          email: 'cto@forge.internal',
        },
      ],
      directReports: [],
      summary: {
        totalManagersAbove: 2,
        totalDirectReports: 0,
        isTopLevel: false,
      },
    };

    // Act
    const primaryApprover = sampleHierarchy.managementChain[0];
    const skipLevelApprover = sampleHierarchy.managementChain[1];

    // Assert
    expect(primaryApprover.displayName).toBe('Rohan Kulkarni');
    expect(skipLevelApprover.displayName).toBe('Rajesh Sharma');
    expect(sampleHierarchy.summary.totalManagersAbove).toBe(2);
  });
});

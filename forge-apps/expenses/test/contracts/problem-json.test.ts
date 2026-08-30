/**
 * @forge/app-expenses - Tier 4 Contract: Health & Problem Contracts
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { startExpensesServer } from '../../src/server';

describe('Tier 4 Contract: Expenses Health Probe Schema', () => {
  it('returns valid JSON health specification on /health', async () => {
    // Arrange
    const server = startExpensesServer(3199);

    try {
      // Act
      const res = await fetch('http://localhost:3199/health');
      const json: any = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(json.status).toBe('ok');
      expect(json.app).toBe('expenses');
    } finally {
      server.stop();
    }
  });
});

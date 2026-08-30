/**
 * @forge/app-expenses - Tier 2 Integration: Dedicated Turso DB & Logging Isolation
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { startExpensesServer } from '../../src/server';

describe('Tier 2 Integration: Expenses Dedicated Database & Observability', () => {
  it('serves expenses health probe with memory metrics and dual-probe signals', async () => {
    // Arrange
    const server = startExpensesServer(3198);

    try {
      // Act
      const res = await fetch('http://localhost:3198/health');
      const json: any = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(json.status).toBe('ok');
      expect(json.app).toBe('expenses');
      expect(json.livez).toBe(true);
      expect(json.readyz).toBe(true);
      expect(typeof json.memoryMb).toBe('number');
    } finally {
      server.stop();
    }
  });
});

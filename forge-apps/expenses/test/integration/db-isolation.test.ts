/**
 * @forge/app-expenses - Tier 2 Integration: Dedicated Turso DB & Logging Isolation
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { createInternalServiceToken } from '@forge/sdk';
import { startExpensesServer } from '../../src/server';

describe('Tier 2 Integration: Expenses Dedicated Database & Observability', () => {
  it('Arrange, Act, Assert: serves expenses health probe with memory metrics and dual-probe signals', async () => {
    // Arrange: Start on ephemeral port 0
    const server = startExpensesServer(0);

    try {
      // Act
      const res = await fetch(`http://localhost:${server.port}/health`);
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

  it('Arrange, Act, Assert: serves browser telemetry event log ingestion endpoint', async () => {
    const server = startExpensesServer(0);

    try {
      const res = await fetch(`http://localhost:${server.port}/api/logs/browser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ severity: 'INFO', message: 'Client approval action' }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('ok');
    } finally {
      server.stop();
    }
  });
});

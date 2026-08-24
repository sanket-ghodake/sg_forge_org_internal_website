/**
 * @forge/dev-dashboard Colocated Test Suite (2026 LTS)
 * 3A Pattern (Arrange, Act, Assert) Testing Suite for Dev Dashboard Modules
 */

import { describe, expect, it } from 'bun:test';
import { platformDb, telemetryEngine, servicesController, startDevDashboardServer } from '../src';

describe('Developer Dashboard Colocated Module Tests', () => {
  it('initializes platform_core.db and accesses apps_registry', () => {
    // Arrange & Act
    const apps = platformDb.getAppsRegistry();

    // Assert
    expect(Array.isArray(apps)).toBe(true);
    expect(apps.length).toBeGreaterThan(0);
  });

  it('verifies safe query execution with read-only protection', () => {
    // Arrange
    const query = 'SELECT COUNT(*) as count FROM apps_registry';

    // Act
    const result = platformDb.executeQuery('platform_core.db', query, true);

    // Assert
    expect(result.error).toBeUndefined();
    expect(result.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('verifies in-memory ring buffer logging', () => {
    // Arrange
    const msg = 'Colocated test log';

    // Act
    telemetryEngine.pushLog('dev-dashboard', 'INFO', msg);
    const logs = telemetryEngine.getRecentLogs(10, 'dev-dashboard');

    // Assert
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[logs.length - 1].message).toBe(msg);
  });

  it('calculates real services vitals summary for the 4 golden cards', () => {
    // Arrange & Act
    const summary = servicesController.getServicesVitalsSummary();

    // Assert
    expect(summary.totalServices).toBeGreaterThan(0);
    expect(summary.onlineCount).toBeGreaterThanOrEqual(0);
    expect(summary.sloAvailabilityPercent).toBeGreaterThanOrEqual(0);
    expect(summary.avgCpuPercent).toBeGreaterThanOrEqual(0);
    expect(summary.storageSizeBytes).toBeGreaterThan(0);
    expect(summary.autoVacuum).toBe('ACTIVE');
  });

  it('verifies in-table rolling sparklines and dual-probe health indicators', () => {
    // Arrange & Act
    const statuses = servicesController.getAllHealthStatuses();

    // Assert
    expect(statuses.length).toBeGreaterThan(0);
    const first = statuses[0];
    expect(first.livez).toBeDefined();
    expect(first.readyz).toBeDefined();
    expect(Array.isArray(first.cpuSparkline)).toBe(true);
    expect(Array.isArray(first.ramSparkline)).toBe(true);
    expect(first.cpuSparkline.length).toBeGreaterThan(0);
    expect(first.ramSparkline.length).toBeGreaterThan(0);
  });

  it('verifies service lifecycle toggle (start / stop) and status transitions', async () => {
    // Arrange & Act
    const stopResult = await servicesController.toggleService('landing', 'stop');
    expect(stopResult.success).toBe(true);

    const startResult = await servicesController.toggleService('landing', 'start');
    expect(startResult.success).toBe(true);
  });

  it('runs HTTP server with dual-probe health checks and services endpoint', async () => {
    // Arrange
    const server = startDevDashboardServer(3098);

    try {
      // Act 1: Health check
      const resHealth = await fetch('http://localhost:3098/health');
      const jsonHealth: any = await resHealth.json();

      // Assert 1
      expect(resHealth.status).toBe(200);
      expect(jsonHealth.status).toBe('ok');

      // Act 2: Services & Summary endpoint
      const resServices = await fetch('http://localhost:3098/api/services');
      const jsonServices: any = await resServices.json();

      // Assert 2
      expect(resServices.status).toBe(200);
      expect(jsonServices.status).toBe('ok');
      expect(jsonServices.summary).toBeDefined();
      expect(jsonServices.services.length).toBeGreaterThan(0);

      // Act 3: DB Snapshot Backup endpoint
      const resBackup = await fetch('http://localhost:3098/api/db/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbName: 'platform_core.db' }),
      });
      const jsonBackup: any = await resBackup.json();

      // Assert 3
      expect(resBackup.status).toBe(200);
      expect(jsonBackup.success).toBe(true);

      // Act 4: Latency Benchmark endpoint
      const resBench = await fetch('http://localhost:3098/api/benchmark', { method: 'POST' });
      const jsonBench: any = await resBench.json();

      // Assert 4
      expect(resBench.status).toBe(200);
      expect(jsonBench.status).toBe('ok');
      expect(jsonBench.samples).toBe(15);
      expect(jsonBench.p50Ms).toBeDefined();
    } finally {
      server.stop();
    }
  });
});

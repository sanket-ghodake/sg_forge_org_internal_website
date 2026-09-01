/**
 * @forge/dev-dashboard Unit & Integration Tests (2026 LTS)
 * 3A Pattern (Arrange, Act, Assert) Testing Suite for Dev Dashboard
 */

import { describe, expect, it } from 'bun:test';
import { loadBrandConfig } from '@forge/sdk';
import { platformDb, telemetryEngine, servicesController, startDevDashboardServer } from '../../src/dev-dashboard/src';

describe('Developer Dashboard Platform Engine', () => {
  it('initializes platform_core.db and retrieves seeded apps registry', () => {
    // Arrange & Act
    const apps = platformDb.getAppsRegistry();

    // Assert
    expect(Array.isArray(apps)).toBe(true);
    expect(apps.length).toBeGreaterThan(0);
    const landing = apps.find((a) => a.id === 'landing');
    expect(landing).toBeDefined();
    expect(landing?.port).toBe(3000);
  });

  it('safely executes SQL queries in read-only sandbox mode and blocks mutations', () => {
    // Arrange
    const selectQuery = 'SELECT COUNT(*) as count FROM apps_registry';
    const deleteQuery = 'DELETE FROM apps_registry';

    // Act
    const selectResult = platformDb.executeQuery('platform_core.db', selectQuery, true);
    const deleteResult = platformDb.executeQuery('platform_core.db', deleteQuery, true);

    // Assert
    expect(selectResult.error).toBeUndefined();
    expect(selectResult.rows.length).toBeGreaterThanOrEqual(1);
    expect(deleteResult.error).toContain('READ_ONLY sandbox mode');
  });

  it('pushes and retrieves logs from in-memory ring buffer without disk churn', () => {
    // Arrange
    const testService = 'test-service';
    const testMsg = 'Test log entry for ring buffer';

    // Act
    telemetryEngine.pushLog(testService, 'INFO', testMsg);
    const logs = telemetryEngine.getRecentLogs(10, testService);

    // Assert
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[logs.length - 1].message).toBe(testMsg);
  });

  it('retrieves accurate host vitals with CPU and RAM statistics', () => {
    // Act
    const vitals = telemetryEngine.getSystemVitals();

    // Assert
    expect(vitals.totalMemBytes).toBeGreaterThan(0);
    expect(vitals.memPercent).toBeGreaterThanOrEqual(0);
    expect(vitals.cpuCount).toBeGreaterThan(0);
    expect(Array.isArray(vitals.cpuLoad)).toBe(true);
  });

  it('serves dashboard HTML and JSON endpoints with dual-probe health checks', async () => {
    // Arrange
    const server = startDevDashboardServer(3099);

    try {
      // Act
      const healthResp = await fetch('http://localhost:3099/health');
      const healthJson: any = await healthResp.json();

      const metricsResp = await fetch('http://localhost:3099/api/system/metrics');
      const metricsJson: any = await metricsResp.json();

      const htmlResp = await fetch('http://localhost:3099/');
      const htmlText = await htmlResp.text();

      // Assert
      expect(healthResp.status).toBe(200);
      expect(healthJson.status).toBe('ok');

      expect(metricsResp.status).toBe(200);
      expect(metricsJson.vitals).toBeDefined();

      const brand = loadBrandConfig();
      expect(htmlResp.status).toBe(200);
      expect(htmlText).toContain(brand.name);
      expect(htmlText).toContain('Cluster Architecture & Ingress Pipeline');
    } finally {
      server.stop();
    }
  });
});

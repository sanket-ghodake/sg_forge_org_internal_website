/**
 * @forge/dev-dashboard - Integration Tests: Database Explorer & Tools Endpoints (3A Pattern)
 * Google SRE & Astryx Enterprise Standard
 */

import { describe, expect, it } from 'bun:test';
import { handleApiRequest } from '../../src/backend/api-handlers';

describe('Tier 2 Integration: Database Explorer & Diagnostics Endpoints', () => {
  it('Arrange, Act, Assert: GET /api/db/schema returns schema and DDL', async () => {
    // Arrange
    const url = new URL('http://localhost:3002/api/db/schema?db=platform_core.db&table=apps_registry');
    const req = new Request(url.toString(), { method: 'GET' });

    // Act
    const res = await handleApiRequest(req, url);

    // Assert
    expect(res).not.toBeNull();
    const data: any = await res!.json();
    expect(data.status).toBe('ok');
    expect(Array.isArray(data.schema)).toBe(true);
    expect(data.ddl).toContain('CREATE TABLE');
  });

  it('Arrange, Act, Assert: GET /api/db/rows returns paginated table rows', async () => {
    // Arrange
    const url = new URL('http://localhost:3002/api/db/rows?db=platform_core.db&table=apps_registry&page=1&limit=10');
    const req = new Request(url.toString(), { method: 'GET' });

    // Act
    const res = await handleApiRequest(req, url);

    // Assert
    expect(res).not.toBeNull();
    const data: any = await res!.json();
    expect(data.status).toBe('ok');
    expect(data.page).toBe(1);
    expect(Array.isArray(data.rows)).toBe(true);
  });

  it('Arrange, Act, Assert: POST /api/db/integrity returns integrity diagnostics', async () => {
    // Arrange
    const url = new URL('http://localhost:3002/api/db/integrity');
    const req = new Request(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dbName: 'platform_core.db' }),
    });

    // Act
    const res = await handleApiRequest(req, url);

    // Assert
    expect(res).not.toBeNull();
    const data: any = await res!.json();
    expect(data.status).toBe('ok');
    expect(data.success).toBe(true);
  });

  it('Arrange, Act, Assert: GET /api/routes/registry returns microservice endpoints', async () => {
    // Arrange
    const url = new URL('http://localhost:3002/api/routes/registry');
    const req = new Request(url.toString(), { method: 'GET' });

    // Act
    const res = await handleApiRequest(req, url);

    // Assert
    expect(res).not.toBeNull();
    const data: any = await res!.json();
    expect(data.status).toBe('ok');
    expect(Array.isArray(data.endpoints)).toBe(true);
    expect(data.endpoints.length).toBeGreaterThan(0);
  });

  it('Arrange, Act, Assert: GET /api/export/csv streams CSV content with headers', async () => {
    // Arrange
    const url = new URL('http://localhost:3002/api/export/csv?type=traffic');
    const req = new Request(url.toString(), { method: 'GET' });

    // Act
    const res = await handleApiRequest(req, url);

    // Assert
    expect(res).not.toBeNull();
    expect(res!.headers.get('Content-Type')).toContain('text/csv');
    const text = await res!.text();
    expect(text).toContain('Timestamp,App,Path,Method,StatusCode,DurationMs');
  });
});

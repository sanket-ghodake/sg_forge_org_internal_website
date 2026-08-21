import { describe, expect, it } from 'bun:test';
import { themeTokens, ASTRYX_VERSION } from '@forge/ui';
import { createLogger, createSafeHandler, loadServiceRegistry } from '@forge/sdk';

describe('SG Forge Base Sanity', () => {
  it('loads UI theme tokens accurately across dark and light modes', () => {
    expect(ASTRYX_VERSION).toBe('2.0.0');
    expect(themeTokens.dark.primary).toBeDefined();
    expect(themeTokens.dark.bgRoot).toBeDefined();
    expect(themeTokens.light.primary).toBeDefined();
    expect(themeTokens.light.bgRoot).toBeDefined();
  });

  it('initializes centralized structured logger without errors', () => {
    const logger = createLogger('test-service');
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('safely wraps handlers and catches errors with RFC 7807 problem responses', async () => {
    const brokenHandler = createSafeHandler('test-service', async () => {
      throw new Error('Test explosion');
    });

    const response = await brokenHandler(new Request('http://localhost/test'));
    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toContain('application/problem+json');

    const body = await response.json();
    expect(body.title).toBe('Internal Server Error');
    expect(body.service).toBe('test-service');
  });

  it('dynamically parses service registry from environment variables', () => {
    const services = loadServiceRegistry();
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThanOrEqual(5);

    const portal = services.find((s) => s.id === 'portal');
    expect(portal).toBeDefined();
    expect(portal?.port).toBe(3001);
    expect(portal?.path).toBe('/portal');

    const expenses = services.find((s) => s.id === 'expenses');
    expect(expenses).toBeDefined();
    expect(expenses?.port).toBe(8085);
    expect(expenses?.path).toBe('/apps/expenses');
  });
});

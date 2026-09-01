/**
 * @forge-apps/template - Tier 4 Contract: Health Schema Specification
 */

import { describe, expect, it } from 'bun:test';
import { startTemplateServer } from '../../src/server';

describe('Tier 4 Contract: App Template Health Schema', () => {
  it('returns valid JSON health specification on /health', async () => {
    const server = startTemplateServer(3283);

    try {
      const res = await fetch('http://localhost:3283/health');
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(typeof data.status).toBe('string');
      expect(typeof data.app).toBe('string');
      expect(typeof data.livez).toBe('boolean');
      expect(typeof data.readyz).toBe('boolean');
      expect(typeof data.uptime).toBe('number');
    } finally {
      server.stop();
    }
  });
});

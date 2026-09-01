/**
 * @forge-apps/template - Tier 2 Integration: Health Check Probe
 */

import { describe, expect, it } from 'bun:test';
import { startTemplateServer } from '../../src/server';

describe('Tier 2 Integration: App Template Health Probes', () => {
  it('responds with operational livez and readyz signals on /health', async () => {
    const server = startTemplateServer(3281);

    try {
      const res = await fetch('http://localhost:3281/health');
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.status).toBe('ok');
      expect(data.app).toBe('app-template');
      expect(data.livez).toBe(true);
      expect(data.readyz).toBe(true);
    } finally {
      server.stop();
    }
  });
});

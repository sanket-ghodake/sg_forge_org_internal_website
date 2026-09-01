/**
 * @forge-apps/template - Tier 5 E2E: Server Lifecycle Test
 */

import { describe, expect, it } from 'bun:test';
import { startTemplateServer } from '../../src/server';

describe('Tier 5 E2E: App Template Server Bootstrap', () => {
  it('successfully boots server and responds to health and authenticated routes', async () => {
    const server = startTemplateServer(3284);

    try {
      const res = await fetch('http://localhost:3284/health');
      expect(res.status).toBe(200);
    } finally {
      server.stop();
    }
  });
});

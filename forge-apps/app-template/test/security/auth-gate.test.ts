/**
 * @forge-apps/template - Tier 3 Security: Zero-Trust Auth Guard Verification
 */

import { describe, expect, it } from 'bun:test';
import { startTemplateServer } from '../../src/server';

describe('Tier 3 Security: App Template Zero-Trust Auth Gate', () => {
  it('blocks unauthenticated requests with 302 redirect to /auth/login', async () => {
    const server = startTemplateServer(3282);

    try {
      const res = await fetch('http://localhost:3282/', { redirect: 'manual' });
      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toContain('/auth/login');
    } finally {
      server.stop();
    }
  });
});

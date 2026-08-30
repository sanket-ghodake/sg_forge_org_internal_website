/**
 * @forge/portal - Tier 5 E2E: Full Server Bootstrap & Responsive Layout
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { signJwt } from '@forge/auth';
import { startPortalServer } from '../../src/server';

describe('Tier 5 E2E: Portal Server Bootstrap & Astryx UI Lifecycle', () => {
  it('serves full authenticated portal page with Astryx header and tabs', async () => {
    // Arrange
    const server = startPortalServer(3189);
    const token = signJwt({
      sub: 'usr_e2e_portal',
      email: 'alex@forge.internal',
      display_name: 'Alex Chen',
      principal_type: 'human_user',
      roles: ['Core Enterprise Services'],
    });

    try {
      // Act
      const res = await fetch('http://localhost:3189/', {
        headers: {
          Cookie: `forge_session=${token}`,
        },
      });
      const html = await res.text();

      // Assert
      expect(res.status).toBe(200);
      expect(html).toContain('SG Forge Portal');
      expect(html).toContain('astryx-container');
      expect(html).toContain('logout-btn');
    } finally {
      server.stop();
    }
  });
});

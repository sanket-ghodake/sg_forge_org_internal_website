/**
 * @forge/portal - Tier 2 Integration: ASVS 5.0 Authentication Gate
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { signJwt } from '@forge/auth';
import { startPortalServer } from '../../src/server';

describe('Tier 2 Integration: Portal Auth Gate & JWT Session Validation', () => {
  it('authenticates valid JWT cookie and serves full portal workspace', async () => {
    // Arrange
    const server = startPortalServer(3185);
    const validToken = signJwt({
      sub: 'usr_portal_test',
      email: 'employee@forge.internal',
      display_name: 'Jane Doe',
      principal_type: 'EMPLOYEE',
      org_id: 'org-test',
      roles: ['roles/employee'],
      permissions: ['portal.workspace.access'],
      token_version: 1,
    });

    try {
      // Act
      const res = await fetch('http://localhost:3185/portal', {
        headers: {
          Cookie: `forge_session=${validToken}`,
        },
      });
      const html = await res.text();

      // Assert
      expect(res.status).toBe(200);
      expect(html).toContain('Jane Doe');
      expect(html).toContain('SG Forge Portal');
      expect(html).toContain('portal-nav-item');
      expect(html).toContain('portal-sidebar');
    } finally {
      server.stop();
    }
  });
});

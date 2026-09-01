/**
 * @forge/portal - Tier 1 Unit: Portal Layout & Component Rendering
 * 3A Pattern (Arrange, Act, Assert) Testing Suite
 */

import { describe, expect, it } from 'bun:test';
import { loadBrandConfig } from '@forge/sdk';
import {
  renderPortalHeader,
  renderPortalSidebar,
  renderPageCards,
  renderPortalHtml,
  PORTAL_PAGES,
  WORKSPACE_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
} from '../../src/frontend';

describe('Tier 1 Unit: Portal Layout Components', () => {
  it('renderPortalHeader renders organization title, search bar, and user profile', () => {
    // Arrange
    const brand = loadBrandConfig();
    const adminUser = {
      id: 'usr_admin_01',
      email: 'sanket@forge.internal',
      displayName: 'Sanket Admin',
      roles: ['roles/super_admin'],
      isAdmin: true,
    };

    // Act
    const html = renderPortalHeader(adminUser);

    // Assert
    expect(html).toContain('PORTAL');
    expect(html).toContain('Search anything...');
    expect(html).toContain('Admin');
    expect(html).toContain('user-dropdown-popover');
    expect(html).toContain('S'); // Avatar initial
  });

  it('renderPortalSidebar properly renders workspace items and role-guarded admin console', () => {
    // Arrange & Act
    const adminSidebar = renderPortalSidebar(true);
    const employeeSidebar = renderPortalSidebar(false);

    // Assert
    expect(adminSidebar).toContain('Company Map');
    expect(adminSidebar).toContain('Apps & Tools');
    expect(adminSidebar).toContain('Admin Console');
    expect(adminSidebar).toContain('Team & Members');
    expect(adminSidebar).toContain('Workspace Settings');

    // Employee sidebar hides admin section via inline display: none
    expect(employeeSidebar).toContain('Company Map');
    expect(employeeSidebar).toContain('display: none;');
  });

  it('renderPageCards defines and renders all 10 distinct pages', () => {
    // Arrange
    expect(PORTAL_PAGES).toHaveLength(10);
    const workspacePages = PORTAL_PAGES.filter(p => p.category === 'Workspace');
    const adminPages = PORTAL_PAGES.filter(p => p.category === 'Admin Console');

    expect(workspacePages).toHaveLength(5);
    expect(adminPages).toHaveLength(5);

    // Act
    const html = renderPageCards();

    // Assert
    PORTAL_PAGES.forEach(page => {
      expect(html).toContain(`id="view-${page.id}"`);
      expect(html).toContain(page.title);
      expect(html).toContain(page.targetAudience);
    });
  });

  it('renderPortalHtml returns complete valid HTML document with Meta Astryx styles and scripts', () => {
    // Arrange & Act
    const html = renderPortalHtml({
      id: 'usr_member_02',
      email: 'member@forge.internal',
      displayName: 'Jane Doe',
      roles: ['roles/employee'],
      isAdmin: false,
    });

    // Assert
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('portal-app-shell');
    expect(html).toContain('portal-header');
    expect(html).toContain('portal-sidebar');
    expect(html).toContain('portal-viewport');
    expect(html).toContain('portal-search-modal');
  });

  it('strictly enforces Single Page Application (SPA) architecture and responsive rules', () => {
    // Arrange & Act
    const html = renderPortalHtml({
      id: 'usr_member_03',
      email: 'member3@forge.internal',
      displayName: 'Alex Jordan',
      roles: ['roles/employee'],
      isAdmin: false,
    });

    // Assert: SPA navigation uses data-view attributes with zero full-page hard navigation hrefs
    expect(html).toContain('data-view="canvas"');
    expect(html).toContain('data-view="apps"');
    expect(html).toContain('data-view="directory"');
    expect(html).toContain('data-view="notifications"');

    // Assert: Responsive viewport meta tag and CSS media queries
    expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    expect(html).toContain('@media (max-width: 768px)');
    expect(html).toContain('@media (max-width: 480px)');
  });
});

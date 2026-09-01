/**
 * @forge/portal - Master UI HTML Renderer (2026 LTS)
 * Combines Header, Expandable Sidebar, Viewport Containers, and Scripts into a cohesive Meta Astryx layout.
 */

import { getAstryxStyles, getHeadStateScript } from '@forge/ui';
import { getPortalCustomStyles } from './ui-styles';
import { renderPortalHeader, type HeaderUserContext } from './layout-header';
import { renderPortalSidebar } from './layout-sidebar';
import { renderPageCards } from './page-cards';
import { getPortalClientScript } from './ui-scripts';

export function renderPortalHtml(user?: HeaderUserContext): string {
  const userContext: HeaderUserContext = {
    id: user?.id || 'usr_guest',
    email: user?.email || 'employee@forge.internal',
    displayName: user?.displayName || 'Authorized Member',
    roles: user?.roles || ['roles/employee'],
    isAdmin: user?.isAdmin ?? ((user?.roles || []).some(r => r.includes('admin') || r.includes('manager'))),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge Portal - Workspace & Admin Console</title>
  ${getHeadStateScript({ defaultTheme: 'dark' })}
  <style>
    ${getAstryxStyles()}
    ${getPortalCustomStyles()}
  </style>
</head>
<body>
  <div class="portal-app-shell">
    <!-- Top Header Bar -->
    ${renderPortalHeader(userContext)}

    <!-- Main Workspace Area -->
    <div class="portal-main-body">
      <!-- Supabase-Inspired Auto-Expandable Left Sidebar -->
      ${renderPortalSidebar(userContext.isAdmin)}

      <!-- Main Content Viewport -->
      <main class="portal-viewport">
        <div class="portal-view-container">
          ${renderPageCards()}
        </div>
      </main>
    </div>
  </div>

  <!-- Command Palette / Quick Search Modal (⌘K) -->
  <div class="portal-search-modal" id="portal-search-modal">
    <div class="portal-search-box">
      <input type="text" class="portal-search-input" id="portal-search-input" placeholder="Type to search pages, members, or tools... (Esc to close)">
      <div id="portal-search-results" style="max-height: 360px; overflow-y: auto;"></div>
    </div>
  </div>

  <!-- Interactive Scripts -->
  <script>
    ${getPortalClientScript()}
  </script>
</body>
</html>`;
}

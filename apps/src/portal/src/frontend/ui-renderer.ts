/**
 * @forge/portal - Master UI HTML Renderer (2026 LTS)
 * Combines Header, Expandable Sidebar, Viewport Containers, Modals, and Scripts into a cohesive Meta Astryx layout.
 */

import { getAstryxStyles, getHeadStateScript, getAstryxToastScript, getAstryxDropdownScript, getAstryxTooltipScript } from '@forge/ui';
import { loadBrandConfig } from '@forge/sdk';
import { getPortalCustomStyles } from './ui-styles';
import { renderPortalHeader, type HeaderUserContext } from './layout-header';
import { renderPortalSidebar } from './layout-sidebar';
import { renderPageCards } from './page-cards';
import { renderPortalModals } from './ui-modals';
import { renderCommandPalette } from './ui-command-palette';
import { getPortalClientScript } from './ui-scripts';

export function renderPortalHtml(user?: HeaderUserContext): string {
  const brand = loadBrandConfig();
  const userContext: HeaderUserContext = {
    id: user?.id || 'usr_guest',
    email: user?.email || 'employee@forge.internal',
    displayName: user?.displayName || 'Authorized Member',
    roles: user?.roles || ['roles/employee'],
    isAdmin: user?.isAdmin ?? Boolean(user?.roles?.some(r => r.includes('admin') || r.includes('manager'))),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand.name} Portal - Workspace & Admin Console</title>
  ${getHeadStateScript({ defaultTheme: 'dark' })}
  <script>
    (function() {
      try {
        var p = new URLSearchParams(window.location.search);
        var v = p.get('view') || (window.location.hash ? window.location.hash.slice(1) : '');
        if (!v) {
          try { v = sessionStorage.getItem('forge:v1:portal:active-view'); } catch(e) {}
        }
        if (!v) v = 'canvas';
        document.documentElement.setAttribute('data-active-view', v);
      } catch(e) {}
    })();
  </script>
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
          ${renderPageCards(userContext)}
        </div>
      </main>
    </div>
  </div>

  <!-- Command Palette / Quick Search Modal (⌘K) -->
  ${renderCommandPalette()}

  <!-- Viewport-Safe Modals & Action Drawers -->
  ${renderPortalModals()}

  <!-- Interactive Scripts -->
  <script>
    window.__PORTAL_USER__ = ${JSON.stringify(userContext)};
    ${getAstryxToastScript()}
    ${getAstryxDropdownScript()}
    ${getAstryxTooltipScript()}
    ${getPortalClientScript()}
  </script>
</body>
</html>`;
}

/**
 * @forge/dev-hub - Developer Hub & Interactive SDK Explorer View (2026 LTS)
 * Meta Astryx Design Standards & Google Cloud Documentation UX.
 */

import { getAstryxHeaderHtml, getHeadStateScript } from '@forge/ui';
import { getClientScripts } from './client-scripts';
import { getDevHubStyles } from './hub-styles';
import { renderGatewaySection } from './sections/gateway-section';
import { renderHealthMeshSection } from './sections/health-mesh-section';
import { renderOverviewSection } from './sections/overview-section';
import { renderRegistryMatrixSection } from './sections/registry-matrix-section';
import { renderSandboxSection } from './sections/sandbox-section';
import { renderScaffoldingSection } from './sections/scaffolding-section';
import { renderSdkSection } from './sections/sdk-section';
import { renderSecurityMatrixSection } from './sections/security-matrix-section';
import { renderTestingSection } from './sections/testing-section';
import { renderTokenMintSection } from './sections/token-mint-section';
import { renderUiSection } from './sections/ui-section';

export function renderDevHubHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge - Developer Gateway & SDK Documentation</title>
  ${getHeadStateScript({ defaultTheme: 'dark' })}
  <style>
    ${getDevHubStyles()}
  </style>
</head>
<body>
  ${getAstryxHeaderHtml('HUB', 'DEVELOPER GATEWAY')}

  <main class="hub-container">
    <!-- Top Action Bar with Search & Quick Links -->
    <div class="hub-action-bar">
      <div class="hub-search-box">
        <span class="hub-search-icon">🔍</span>
        <input type="text" class="hub-search-input" placeholder="Search SDK functions, endpoints, tokens..." oninput="filterContent(this.value)" />
      </div>
      <div style="display: flex; gap: 0.6rem;">
        <a href="/" class="astryx-btn btn-outline">&larr; Return to Platform Hub</a>
        <a href="/portal" class="astryx-btn btn-outline">Portal &rarr;</a>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="hub-tabs-bar">
      <button class="hub-tab active" data-tab="overview" onclick="switchTab('overview')">🚀 Overview</button>
      <button class="hub-tab" data-tab="health" onclick="switchTab('health')">🟢 Health Mesh</button>
      <button class="hub-tab" data-tab="tokens" onclick="switchTab('tokens')">🔑 Token Mint</button>
      <button class="hub-tab" data-tab="routes" onclick="switchTab('routes')">🔀 Route Matrix</button>
      <button class="hub-tab" data-tab="sdk" onclick="switchTab('sdk')">📦 @forge/sdk</button>
      <button class="hub-tab" data-tab="ui" onclick="switchTab('ui')">🎨 Meta Astryx UI</button>
      <button class="hub-tab" data-tab="gateway" onclick="switchTab('gateway')">🌐 Ingress & Headers</button>
      <button class="hub-tab" data-tab="sandbox" onclick="switchTab('sandbox')">⚡ API Sandbox</button>
      <button class="hub-tab" data-tab="security" onclick="switchTab('security')">🛡️ Error Matrix</button>
      <button class="hub-tab" data-tab="scaffolding" onclick="switchTab('scaffolding')">🐳 Scaffolding</button>
      <button class="hub-tab" data-tab="testing" onclick="switchTab('testing')">🧪 5-Tier Testing</button>
    </div>

    <!-- Modular Sections -->
    ${renderOverviewSection()}
    ${renderHealthMeshSection()}
    ${renderTokenMintSection()}
    ${renderRegistryMatrixSection()}
    ${renderSdkSection()}
    ${renderUiSection()}
    ${renderGatewaySection()}
    ${renderSandboxSection()}
    ${renderSecurityMatrixSection()}
    ${renderScaffoldingSection()}
    ${renderTestingSection()}
  </main>

  <footer style="margin-top: 3rem; padding: 2rem; text-align: center; border-top: 1px solid var(--forge-border); font-size: 0.8rem; color: var(--forge-text-muted);">
    SG Forge Developer Gateway &bull; @forge/sdk v2.0.0 LTS &bull; Meta Astryx Design System
  </footer>

  <script>
    ${getClientScripts()}
  </script>
</body>
</html>`;
}

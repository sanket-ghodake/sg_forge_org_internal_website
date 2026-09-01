/**
 * @forge/dev-dashboard - Modal Dialogs & Flyout Drawers Renderer (2026 LTS)
 * Modular Astryx modal dialogs for Command Palette, Remote DB Connect, Safe Env, API Registry, and Logs.
 */

export function getModalsHtml(): string {
  return `
  <!-- Command Palette Modal (Cmd+K) -->
  <div class="palette-modal-backdrop" id="cmd-palette-modal" onclick="if(event.target===this)closeCommandPalette()">
    <div class="palette-box">
      <div class="palette-input-wrap">
        <span>🔍</span>
        <input type="search" class="palette-input" id="palette-search-input" name="palette-search-query" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Type a command or jump to tab... (↑↓ to select, Enter)" oninput="filterPaletteItems(this.value)">
        <kbd style="font-size: 0.7rem; color: var(--forge-text-muted);">ESC</kbd>
      </div>
      <ul class="palette-list" id="palette-items-list"></ul>
    </div>
  </div>

  <!-- Connect Remote Database Modal (GCP / Turso / Postgres) -->
  <div class="astryx-modal-backdrop" id="connect-db-modal">
    <div class="astryx-modal" style="max-width: 520px;">
      <div class="astryx-modal-header">
        <h3>🔌 Connect Remote Microservice Database</h3>
        <button class="astryx-modal-close" onclick="closeConnectModal()">&times;</button>
      </div>
      <form class="astryx-modal-body" autocomplete="off" onsubmit="return false;" style="display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem;">
        <div>
          <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Connection Name</label>
          <input type="text" class="form-input" id="remote-conn-name" name="db_connection_label" autocomplete="off" placeholder="e.g. Auth Microservice DB">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Database Type</label>
            <select class="form-input" id="remote-conn-type">
              <option value="turso">Turso LibSQL (HTTP/TLS)</option>
              <option value="postgres">PostgreSQL / Cloud SQL</option>
              <option value="sqlite">SQLite Remote / File</option>
            </select>
          </div>
          <div>
            <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Access Mode</label>
            <select class="form-input" id="remote-conn-mode">
              <option value="readonly">Read-Only Sandbox (Safe)</option>
              <option value="readwrite">Read-Write Access</option>
            </select>
          </div>
        </div>
        <div>
          <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Connection URL / Endpoint</label>
          <input type="text" class="form-input" id="remote-conn-url" name="db_connection_endpoint" autocomplete="off" placeholder="libsql://your-db.turso.io or https://...">
        </div>
        <div>
          <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Auth Token / API Secret (Optional)</label>
          <input type="text" class="form-input" id="remote-conn-token" name="db_api_secret_token" autocomplete="new-password" style="-webkit-text-security: disc;" placeholder="Bearer eyJhbGciOi...">
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
          <button class="astryx-btn btn-outline" style="padding: 0.35rem 0.75rem;" onclick="testRemoteConnection()">🩺 Test Ping</button>
          <div style="display: flex; gap: 0.4rem;">
            <button class="astryx-btn btn-outline" onclick="closeConnectModal()">Cancel</button>
            <button class="astryx-btn btn-primary" onclick="saveRemoteConnection()">💾 Save Connection</button>
          </div>
        </div>
        <div id="remote-conn-status" style="font-size: 0.78rem; margin-top: 0.25rem;"></div>
      </form>
    </div>
  </div>

  <!-- Safe Environment Modal -->
  <div class="astryx-modal-backdrop" id="safe-env-modal">
    <div class="astryx-modal">
      <div class="astryx-modal-header">
        <h3>🔐 Masked Environment Inspector</h3>
        <button class="astryx-modal-close" onclick="closeSafeEnvModal()">&times;</button>
      </div>
      <div class="astryx-modal-body">
        <div class="astryx-table-wrap" id="safe-env-table-container">Loading environment...</div>
      </div>
    </div>
  </div>

  <!-- API Registry Modal -->
  <div class="astryx-modal-backdrop" id="api-registry-modal">
    <div class="astryx-modal" style="max-width: 760px;">
      <div class="astryx-modal-header">
        <h3>⚡ API Route Explorer & cURL Generator</h3>
        <button class="astryx-modal-close" onclick="closeApiRegistryModal()">&times;</button>
      </div>
      <div class="astryx-modal-body">
        <div id="api-registry-container">Loading endpoints...</div>
      </div>
    </div>
  </div>

  <!-- Help & Architecture Explainer Modal -->
  <div class="astryx-modal-backdrop" id="help-modal">
    <div class="astryx-modal">
      <div class="astryx-modal-header">
        <h3>❓ Services & Processes Architecture Guide</h3>
        <button class="astryx-modal-close" onclick="closeHelpModal()">&times;</button>
      </div>
      <div class="astryx-modal-body">
        <h4 style="color: var(--forge-primary); margin-bottom: 0.4rem;">Operational States</h4>
        <ul style="padding-left: 1.2rem; margin-bottom: 1rem;">
          <li><strong style="color: var(--forge-success);">RUNNING:</strong> Process is active, healthy, and accepting Turso DB connections.</li>
          <li><strong style="color: var(--forge-accent);">DEGRADED:</strong> Service is experiencing elevated response latency (&gt;50ms).</li>
          <li><strong style="color: var(--forge-text-muted);">STOPPED:</strong> Service is halted or offline.</li>
          <li><strong style="color: var(--forge-primary);">STARTING:</strong> Service runtime is booting or executing migrations.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- App-Specific 4-Pillar Live Log Inspector Modal -->
  <div class="astryx-modal-backdrop" id="app-logs-modal">
    <div class="astryx-modal log-modal-content">
      <div class="astryx-modal-header">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.1rem;">📜</span>
          <div>
            <h3 id="app-logs-title" style="margin: 0; font-size: 1rem;">App Live Logs</h3>
            <span id="app-logs-meta" style="font-size: 0.75rem; color: var(--forge-text-muted);">Port: :3000 | Route: /</span>
          </div>
        </div>
        <button class="astryx-modal-close" onclick="closeAppLogsModal()">&times;</button>
      </div>
      <div class="astryx-modal-body" style="display: flex; flex-direction: column; flex: 1; padding: 0.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.4rem;">
          <div style="display: flex; gap: 0.3rem;">
            <button class="astryx-btn btn-primary" id="pillar-tab-all" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="setModalPillar('all')">All</button>
            <button class="astryx-btn btn-outline" id="pillar-tab-app" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="setModalPillar('app')">🖥️ Server</button>
            <button class="astryx-btn btn-outline" id="pillar-tab-browser" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="setModalPillar('browser')">🌐 Browser</button>
            <button class="astryx-btn btn-outline" id="pillar-tab-docker" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="setModalPillar('docker')">🐳 Docker</button>
            <button class="astryx-btn btn-outline" id="pillar-tab-db" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="setModalPillar('db')">🗄️ DB</button>
          </div>
          <div style="display: flex; gap: 0.3rem; align-items: center;">
            <input type="search" class="form-input" id="app-logs-filter" name="app-logs-filter-query" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Filter logs..." style="width: 180px; padding: 0.2rem 0.5rem; font-size: 0.75rem;" oninput="filterAppLogs(this.value)">
            <button class="astryx-btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="clearAppLogs()">Clear</button>
          </div>
        </div>
        <div class="terminal-window" id="app-logs-terminal" style="height: 100%; min-height: 380px;">Waiting for isolated app logs...</div>
      </div>
    </div>
  </div>

  <!-- Slide-Out Service Inspector Drawer -->
  <div class="service-drawer-backdrop" id="service-drawer-backdrop" onclick="closeServiceDrawer()"></div>
  <aside class="service-drawer" id="service-drawer" aria-label="Service Details Inspector">
    <div class="drawer-header">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.3rem;" id="drawer-svc-icon">⚡</span>
        <div>
          <h3 id="drawer-svc-name" style="margin: 0; font-size: 1rem; color: var(--forge-text-main);">Service Name</h3>
          <span id="drawer-svc-meta" style="font-size: 0.75rem; color: var(--forge-text-muted);">Port: :3000 | Ingress: /</span>
        </div>
      </div>
      <button class="astryx-modal-close" onclick="closeServiceDrawer()">&times;</button>
    </div>
    <div class="drawer-body" id="drawer-body-content"></div>
  </aside>
  `;
}

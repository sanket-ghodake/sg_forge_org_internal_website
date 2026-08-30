/**
 * @forge/dev-dashboard - Supabase-Inspired Meta Astryx UI Renderer (2026 LTS)
 * Full-width top header, below-header vertical sidebar, theme toggler, and 80% compact SPA layout.
 * Meta Astryx Enterprise Baseline (v2.0.0 LTS)
 */

import { getDashboardScripts } from './ui-scripts';
import { getDashboardStyles } from './ui-styles';

export function renderDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge - Developer Dashboard & Diagnostics</title>
  <style>${getDashboardStyles()}</style>
</head>
<body>
  <!-- 1. 100% Full-Width Global Top Header -->
  <header class="sb-global-header">
    <div class="sb-header-left">
      <button class="sb-mobile-menu-btn" id="mobile-menu-toggle" aria-label="Toggle Mobile Navigation">☰</button>
      <a href="/" class="sb-brand">
        <span class="astryx-logo-badge">SG</span>
        <span>SG FORGE</span>
      </a>
    </div>

    <div class="sb-header-right">
      <!-- Heartbeat & Connection Watchdog -->
      <div class="watchdog-pill" id="dashboard-watchdog" title="Live SSE telemetry stream status" onclick="reconnectSSE()">
        <span class="watchdog-dot live" id="watchdog-dot"></span>
        <span id="watchdog-text">Live Stream</span>
      </div>

      <!-- Theme Switcher Button -->
      <button class="astryx-theme-toggle" id="theme-toggle-btn" title="Toggle Light / Dark Theme" aria-label="Toggle Theme" style="width: 32px; height: 32px;">
        <svg id="sun-icon" viewBox="0 0 24 24" style="width: 15px; height: 15px;">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
        </svg>
        <svg id="moon-icon" viewBox="0 0 24 24" style="width: 15px; height: 15px; display: none;">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </div>
  </header>

  <!-- 2. Below-Header Body Container (Left Sidebar + Main SPA Canvas) -->
  <div class="sb-body-container">
    <div class="sb-sidebar-backdrop" id="sidebar-backdrop" onclick="toggleMobileSidebar(false)"></div>

    <aside class="sb-sidebar" id="main-sidebar">
      <div class="sb-nav-item active" data-tab="overview" onclick="switchTab('overview')">📊 Overview</div>
      <div class="sb-nav-item" data-tab="services" onclick="switchTab('services')">⚡ Services & Processes</div>
      <div class="sb-nav-item" data-tab="apps" onclick="switchTab('apps')">🧩 Forge Apps</div>
      <div class="sb-nav-item" data-tab="database" onclick="switchTab('database')">🗄️ Turso DB Explorer</div>
      <div class="sb-nav-item" data-tab="sql" onclick="switchTab('sql')">💻 SQL Playground</div>
      <div class="sb-nav-item" data-tab="logs" onclick="switchTab('logs')">📜 Isolated App Logs</div>
      <div class="sb-nav-item" data-tab="traffic" onclick="switchTab('traffic')">📈 Traffic Analytics</div>
      <div class="sb-nav-item" data-tab="issues" onclick="switchTab('issues')">⚠️ Issue Center</div>
      <div class="sb-nav-item" data-tab="host" onclick="switchTab('host')">☁️ Host & Cloud</div>
      <div class="sb-nav-item" data-tab="settings" onclick="switchTab('settings')">⚙️ Settings & Audit</div>
    </aside>

    <main class="sb-content">
      <!-- Tab 1: Overview -->
      <section id="tab-overview" class="tab-pane active">
        <div class="astryx-card" style="margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.25rem; margin-bottom: 0.25rem;">📊 System Topology & Cluster Health</h2>
          <p style="color: var(--forge-text-muted); font-size: 0.85rem;">Real-time service nodes, micro-app latencies, and dual-probe vitals.</p>
        </div>
        <div class="node-canvas" id="topology-nodes"></div>
        <div class="astryx-card" style="margin-top: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
            <h3 style="font-size: 0.95rem;">📜 Live Cluster Stream Preview</h3>
            <button class="astryx-btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="clearLogs()">Clear</button>
          </div>
          <div class="terminal-window" id="overview-terminal">Connecting to SSE live stream...</div>
        </div>
      </section>

      <!-- Tab 2: Services & Processes -->
      <section id="tab-services" class="tab-pane">
        <div class="astryx-card" style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2 style="font-size: 1.25rem; margin-bottom: 0.25rem; display: flex; align-items: center;">
                ⚡ Services & Processes Command Center
                <button class="help-btn" onclick="openHelpModal()" title="Help & Architecture Explainer">?</button>
              </h2>
              <p style="color: var(--forge-text-muted); font-size: 0.82rem;">Real-time operational status, CPU/RAM sparklines, and process lifecycle controls.</p>
            </div>
          </div>
        </div>

        <div class="vitals-grid" id="services-vitals-cards">
          <div class="vitals-card"><div class="vitals-title">Loading Service Fleet Health...</div></div>
          <div class="vitals-card"><div class="vitals-title">Loading CPU Utilization...</div></div>
          <div class="vitals-card"><div class="vitals-title">Loading Memory Allocation...</div></div>
          <div class="vitals-card"><div class="vitals-title">Loading Storage & DB Quota...</div></div>
        </div>

        <div class="astryx-card">
          <div class="astryx-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 110px;">Status</th>
                  <th>Service Name</th>
                  <th style="width: 140px;">CPU Load</th>
                  <th style="width: 150px;">RAM Usage</th>
                  <th style="width: 80px;">Latency</th>
                  <th style="width: 70px;">Port</th>
                  <th>Route Ingress</th>
                  <th style="width: 180px;">Actions</th>
                </tr>
              </thead>
              <tbody id="services-tbody"></tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Tab 3: Forge Apps -->
      <section id="tab-apps" class="tab-pane">
        <div class="astryx-card" style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.25rem; margin-bottom: 0.25rem;">🧩 Registered Forge Micro-Apps</h2>
          <p style="color: var(--forge-text-muted); font-size: 0.82rem;">Dedicated Turso libSQL DB per app with isolated sandboxing.</p>
        </div>
        <div class="astryx-grid" id="apps-grid"></div>
      </section>

      <!-- Tab 4: Turso DB Explorer -->
      <section id="tab-database" class="tab-pane">
        <div class="astryx-card" style="margin-bottom: 1rem;">
          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <label style="font-weight: 600; font-size: 0.85rem;">Target Database:</label>
            <select class="form-input" id="db-select" style="max-width: 240px;" onchange="inspectDatabase(this.value)"></select>
            <button class="astryx-btn btn-outline" style="padding: 0.35rem 0.75rem;" onclick="optimizeCurrentDb()">✨ 1-Click Optimize (VACUUM)</button>
            <button class="astryx-btn btn-primary" style="padding: 0.35rem 0.75rem;" onclick="backupCurrentDb()">📦 1-Click Snapshot</button>
          </div>
        </div>
        <div class="astryx-card">
          <h3 style="font-size: 0.95rem; margin-bottom: 0.65rem;">Tables & Schema</h3>
          <div class="astryx-table-wrap" id="db-tables-view">Select a database above to inspect tables.</div>
        </div>
      </section>

      <!-- Tab 5: SQL Playground -->
      <section id="tab-sql" class="tab-pane">
        <div class="astryx-card">
          <h2 style="font-size: 1.25rem; margin-bottom: 0.35rem;">💻 Interactive SQL Playground</h2>
          <p style="color: var(--forge-text-muted); font-size: 0.8rem; margin-bottom: 0.85rem;">Safe execution sandbox with stopwatch timing.</p>
          
          <div style="display: flex; gap: 0.75rem; margin-bottom: 0.65rem; align-items: center; flex-wrap: wrap;">
            <select class="form-input" id="sql-db-select" style="max-width: 240px;"></select>
            <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 0.35rem;">
              <input type="checkbox" id="sql-readonly-check" checked> Read-Only Sandbox Mode
            </label>
            <button class="astryx-btn btn-primary" style="padding: 0.35rem 0.85rem;" onclick="runSqlQuery()">Run Query (Ctrl+Enter)</button>
          </div>

          <textarea class="sql-input" id="sql-query-input" placeholder="SELECT * FROM apps_registry LIMIT 10;">SELECT * FROM apps_registry LIMIT 10;</textarea>
          <div id="sql-result-container"></div>
        </div>
      </section>

      <!-- Tab 6: Isolated App Logs & Plain-English Insights -->
      <section id="tab-logs" class="tab-pane">
        <!-- Plain English Non-Technical Summary Card -->
        <div class="plain-english-card" id="plain-english-banner">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;" id="plain-status-icon">🟢</span>
            <div>
              <h3 id="plain-status-title" style="margin: 0; font-size: 0.95rem; color: var(--forge-text-main);">All Systems Operational</h3>
              <p id="plain-status-detail" style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: var(--forge-text-muted);">
                All microservices and database instances are responding with healthy latency (&lt;5ms).
              </p>
            </div>
          </div>
        </div>

        <div class="astryx-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <label style="font-size: 0.82rem; font-weight: 600;">App:</label>
              <select class="form-input" id="logs-app-select" style="max-width: 170px;" onchange="changeActiveLogApp(this.value)">
                <option value="all">🌐 All Microservices</option>
                <option value="landing">🏠 Landing</option>
                <option value="auth">🔒 Auth</option>
                <option value="portal">📂 Portal</option>
                <option value="dev-dashboard">📊 Dev Dashboard</option>
                <option value="dev-hub">🔀 Dev Hub</option>
                <option value="expenses">💳 Expenses</option>
                <option value="billing">🧾 Billing</option>
                <option value="telemetry">📡 Telemetry</option>
              </select>

              <label style="font-size: 0.82rem; font-weight: 600; margin-left: 0.5rem;">Source:</label>
              <select class="form-input" id="logs-source-select" style="max-width: 160px;" onchange="changeActiveLogSource(this.value)">
                <option value="all">All Sources</option>
                <option value="app">🖥️ App Server (app.log)</option>
                <option value="browser">🌐 Browser Console</option>
                <option value="docker">🐳 Docker Container</option>
                <option value="db">🗄️ Database (db.log)</option>
              </select>

              <label style="font-size: 0.82rem; font-weight: 600; margin-left: 0.5rem;">Severity:</label>
              <select class="form-input" id="logs-level-select" style="max-width: 110px;" onchange="changeActiveLogLevel(this.value)">
                <option value="ALL">ALL</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>

            <div style="display: flex; gap: 0.4rem;">
              <button class="astryx-btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="clearActiveAppLogs()">🗑️ Clear</button>
            </div>
          </div>
          <div class="terminal-window" id="full-terminal" style="height: 440px;"></div>
        </div>
      </section>

      <!-- Tab 7: Traffic Analytics & Benchmark -->
      <section id="tab-traffic" class="tab-pane">
        <div class="astryx-card" style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h2 style="font-size: 1.25rem; margin-bottom: 0.2rem;">📈 Real-time Traffic & Latency Benchmarks</h2>
              <p style="color: var(--forge-text-muted); font-size: 0.82rem;">Autocannon high-frequency stress tester (&lt;2ms target).</p>
            </div>
            <button class="astryx-btn btn-primary" style="padding: 0.35rem 0.85rem;" onclick="runLatencyBenchmark()">🚀 1-Click Latency Benchmark</button>
          </div>
          <div id="benchmark-scorecard" style="margin-top: 0.75rem;"></div>
        </div>
        <div class="astryx-card">
          <h3 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Recent Traffic Events</h3>
          <div class="astryx-table-wrap" id="traffic-table-container">Loading live traffic events...</div>
        </div>
      </section>

      <!-- Tab 8: Issues -->
      <section id="tab-issues" class="tab-pane">
        <div class="astryx-card">
          <h2 style="font-size: 1.25rem; margin-bottom: 0.4rem;">⚠️ Issue Incident Center (RFC 7807)</h2>
          <div id="issues-container">Loading incident logs...</div>
        </div>
      </section>

      <!-- Tab 9: Host & Cloud -->
      <section id="tab-host" class="tab-pane">
        <div class="astryx-card">
          <h2 style="font-size: 1.25rem; margin-bottom: 0.85rem;">☁️ Host System & Infrastructure</h2>
          <div class="astryx-grid" id="host-vitals-grid"></div>
        </div>
      </section>

      <!-- Tab 10: Settings & Audit -->
      <section id="tab-settings" class="tab-pane">
        <div class="astryx-card">
          <h2 style="font-size: 1.25rem; margin-bottom: 0.85rem;">⚙️ Administrative Audit Logs</h2>
          <div class="astryx-table-wrap" id="audit-table-container">Loading audit logs...</div>
        </div>
      </section>
    </main>
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

        <h4 style="color: var(--forge-primary); margin-bottom: 0.4rem;">Lifecycle Actions</h4>
        <ul style="padding-left: 1.2rem; margin-bottom: 1rem;">
          <li><strong>Restart:</strong> Gracefully recycles the Bun watch process or Docker container.</li>
          <li><strong>Stop:</strong> Suspends the process/container to conserve compute resources.</li>
          <li><strong>Start:</strong> Launches the container/process on its assigned port.</li>
          <li><strong>Logs:</strong> Opens a dedicated live log inspector for that app only.</li>
        </ul>

        <h4 style="color: var(--forge-primary); margin-bottom: 0.4rem;">In-Table Sparklines</h4>
        <p style="color: var(--forge-text-muted);">The rolling graphs show real-time 30-second CPU compute load (%) and active RAM allocation (MB) per micro-app.</p>
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
            <input type="text" class="form-input" id="app-logs-filter" placeholder="Filter logs..." style="width: 180px; padding: 0.2rem 0.5rem; font-size: 0.75rem;" oninput="filterAppLogs(this.value)">
            <button class="astryx-btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="clearAppLogs()">Clear</button>
          </div>
        </div>
        <div class="terminal-window" id="app-logs-terminal" style="height: 100%; min-height: 380px;">Waiting for isolated app logs...</div>
      </div>
    </div>
  </div>

  <script>${getDashboardScripts()}</script>
</body>
</html>`;
}


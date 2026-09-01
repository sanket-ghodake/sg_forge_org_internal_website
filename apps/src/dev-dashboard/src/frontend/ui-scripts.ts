import { getLogDashboardScripts } from './ui-log-scripts';
import { getToolsDashboardScripts } from './ui-tools-scripts';
import { getDbDashboardScripts } from './ui-db-scripts';
import { getServicesDashboardScripts } from './ui-services-scripts';
import { getEmployeeDashboardScripts } from './ui-employee-scripts';
import { getDropdownScripts } from './ui-dropdown-scripts';
import { getAstryxToastScript } from '@forge/ui';

export function getDashboardScripts(): string {
  return `
    ${getAstryxToastScript()}
    ${getDropdownScripts()}

    window.showAstryxToast = function(type, message, duration = 4000) {
      if (typeof window.astryxToast === 'function') {
        window.astryxToast(message, type, duration);
      }
    };

    const apiBase = window.location.pathname.startsWith('/devcenter') ? '/devcenter' : '';
    let currentAppLogService = null;
    let appLogBuffer = [];

    (function initTheme() {
      const THEME_KEY = 'forge:v1:platform:theme';
      const LEGACY_KEY = 'sg-forge-theme';
      const CHANNEL_NAME = 'sg_forge_state_sync_bus';

      function getSavedTheme() {
        try {
          const raw = localStorage.getItem(THEME_KEY) || localStorage.getItem(LEGACY_KEY);
          if (!raw) return 'dark';
          const env = JSON.parse(raw);
          return (env && typeof env === 'object' && env.data) ? env.data : (env || 'dark');
        } catch {
          return 'dark';
        }
      }

      function applyTheme(t) {
        document.documentElement.setAttribute('data-theme', t);
        updateThemeIcons(t);
      }

      function saveTheme(t) {
        try {
          const env = { version: 1, updatedAt: new Date().toISOString(), data: t };
          localStorage.setItem(THEME_KEY, JSON.stringify(env));
          localStorage.setItem(LEGACY_KEY, t);
          if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel(CHANNEL_NAME);
            bc.postMessage({ key: THEME_KEY, data: t, timestamp: Date.now() });
            bc.close();
          }
        } catch {}
      }

      const activeTheme = getSavedTheme();
      applyTheme(activeTheme);

      const btn = document.getElementById('theme-toggle-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          const cur = document.documentElement.getAttribute('data-theme') || 'dark';
          const next = cur === 'dark' ? 'light' : 'dark';
          applyTheme(next);
          saveTheme(next);
        });
      }

      function updateThemeIcons(theme) {
        const sun = document.getElementById('sun-icon');
        const moon = document.getElementById('moon-icon');
        if (sun && moon) {
          sun.style.display = theme === 'dark' ? 'block' : 'none';
          moon.style.display = theme === 'dark' ? 'none' : 'block';
        }
      }

      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const receiver = new BroadcastChannel(CHANNEL_NAME);
          receiver.onmessage = (e) => {
            if (e.data && (e.data.key === THEME_KEY || e.data.key === LEGACY_KEY)) {
              applyTheme(e.data.data);
            }
          };
        } catch {}
      }
    })();

    function toggleMobileSidebar(force) {
      const sb = document.getElementById('main-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (!sb || !backdrop) return;
      const isOpen = force !== undefined ? force : !sb.classList.contains('open');
      sb.classList.toggle('open', isOpen);
      backdrop.classList.toggle('open', isOpen);
    }

    const menuBtn = document.getElementById('mobile-menu-toggle');
    if (menuBtn) menuBtn.addEventListener('click', () => toggleMobileSidebar());

    const mainSidebar = document.getElementById('main-sidebar');
    if (mainSidebar) {
      mainSidebar.addEventListener('mouseleave', () => {
        if (document.activeElement && mainSidebar.contains(document.activeElement) && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
      });
    }

    const TAB_KEY = 'forge:v1:devcenter:active-tab';
    const TAB_TITLES = {
      overview: 'Overview',
      services: 'Services & Processes',
      apps: 'Forge Apps',
      database: 'Database Studio',
      logs: 'Isolated App Logs',
      traffic: 'Traffic Analytics',
      issues: 'Issue Center',
      employees: 'Employees & Org',
      host: 'Host & Cloud',
      settings: 'Settings & Tools'
    };

    function switchTab(tabId, updateUrl = true) {
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.sb-nav-item').forEach(el => el.classList.remove('active'));
      
      const pane = document.getElementById('tab-' + tabId);
      if (pane) pane.classList.add('active');

      document.querySelectorAll('.sb-nav-item').forEach(n => {
        if (n.dataset.tab === tabId) n.classList.add('active');
      });

      if (document.activeElement && mainSidebar && mainSidebar.contains(document.activeElement) && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      const breadcrumbEl = document.getElementById('breadcrumb-title');
      if (breadcrumbEl && TAB_TITLES[tabId]) {
        breadcrumbEl.textContent = TAB_TITLES[tabId];
      }

      if (updateUrl && window.location.hash !== '#' + tabId) {
        history.pushState(null, '', '#' + tabId);
      }
      try {
        localStorage.setItem(TAB_KEY, JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), data: tabId }));
      } catch {}
      toggleMobileSidebar(false);

      if (tabId === 'overview') loadTopology();
      if (tabId === 'services') loadServices();
      if (tabId === 'apps') loadApps();
      if (tabId === 'database' || tabId === 'sql') loadDatabases();
      if (tabId === 'logs') loadActiveTabLogs();
      if (tabId === 'traffic') loadTraffic();
      if (tabId === 'issues') loadIssues();
      if (tabId === 'employees') loadEmployees();
      if (tabId === 'host') loadHostVitals();
      if (tabId === 'settings') loadAudit();
    }

    function syncTabFromHash() {
      let tab = window.location.hash.replace('#', '');
      if (!tab) {
        try {
          const raw = localStorage.getItem(TAB_KEY);
          if (raw) {
            const env = JSON.parse(raw);
            tab = (env && typeof env === 'object' && env.data) ? env.data : env;
          }
        } catch {}
      }
      switchTab(tab || 'overview', false);
    }

    window.addEventListener('hashchange', syncTabFromHash);
    window.addEventListener('popstate', syncTabFromHash);

    ${getLogDashboardScripts()}
    ${getToolsDashboardScripts()}
    ${getDbDashboardScripts()}
    ${getServicesDashboardScripts()}
    ${getEmployeeDashboardScripts()}

    function renderSparklineSvg(data, isArea) {
      if (!data || !data.length) return '';
      const min = Math.min(...data, 0), max = Math.max(...data, 30), range = max - min || 1;
      const w = 84, h = 20, step = w / (data.length - 1);
      const points = data.map((d, i) => (i * step).toFixed(1) + ',' + (h - ((d - min) / range) * (h - 4) - 2).toFixed(1)).join(' ');
      const fill = isArea ? '<polygon points="0,' + h + ' ' + points + ' ' + w + ',' + h + '" fill="rgba(62, 207, 142, 0.18)" />' : '';
      return '<svg class="sparkline-svg" viewBox="0 0 ' + w + ' ' + h + '">' + fill +
        '<polyline points="' + points + '" fill="none" stroke="var(--forge-primary)" stroke-width="1.5" stroke-linecap="round" />' +
      '</svg>';
    }

    async function loadTopology() {
      try {
        const res = await fetch(apiBase + '/api/services').then(r => r.json());
        const c = document.getElementById('topology-nodes');
        if (!c || !res.services) return;
        c.innerHTML = res.services.map(s => \`
          <div class="service-node">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span style="font-weight:700; font-size:0.88rem;">\${s.name}</span>
              <span class="astryx-badge \${s.status === 'RUNNING' ? 'badge-running' : 'badge-stopped'}">\${s.status}</span>
            </div>
            <div style="font-size:0.75rem; color:var(--forge-text-muted);">
              <div>Port: <code class="astryx-code-badge">\${s.port}</code> \${s.ingressPath}</div>
              <div>Latency: <strong>\${s.latencyMs}ms</strong></div>
            </div>
          </div>\`).join('');
      } catch (err) { console.error('Topology load failed', err); }
    }

    async function loadApps() {
      try {
        const res = await fetch(apiBase + '/api/apps').then(r => r.json());
        const grid = document.getElementById('apps-grid');
        if (!grid || !res.apps) return;
        grid.innerHTML = res.apps.map(a => \`
          <div class="astryx-card" style="display:flex; flex-direction:column; justify-content:space-between; min-height:160px;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.35rem;">
                <h3 style="font-size:0.95rem; font-weight:550; letter-spacing:-0.015em; color:var(--forge-text-main); margin:0;">\${a.name}</h3>
                <span style="color:var(--forge-text-subtle); cursor:pointer;" title="Options">⋮</span>
              </div>
              <div style="font-size:0.72rem; color:var(--forge-text-subtle); font-family:'Geist Mono', monospace; margin-bottom:0.6rem; display:flex; align-items:center; gap:0.4rem;">
                <span>SG-FORGE</span><span>•</span><span>PORT :\${a.port}</span>
              </div>
              <div style="display:flex; gap:0.35rem; flex-wrap:wrap; margin-bottom:0.75rem;">
                <span class="astryx-micro-pill">\${a.category.toUpperCase()}</span>
                <span class="astryx-micro-pill">ROLE: \${a.access_role}</span>
                <span class="astryx-micro-pill">DB: \${(a.db_file_path ? a.db_file_path.split('/').pop() : 'platform_core.db')}</span>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--forge-border); padding-top:0.6rem; margin-top:0.4rem;">
              <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.75rem; color:var(--forge-text-muted);">
                <span class="badge-dot" style="background:var(--forge-success); box-shadow:0 0 6px var(--forge-success);"></span>
                <span>Active</span>
              </div>
              <a href="\${a.ingress_path}" class="astryx-btn btn-primary" style="padding:0.25rem 0.65rem; font-size:0.72rem; text-decoration:none;" target="_blank">Launch ↗</a>
            </div>
          </div>\`).join('');
      } catch (err) { console.error('Apps load failed', err); }
    }

    async function runSqlQuery() {
      const dbName = document.getElementById('db-select')?.value || currentSelectedDb;
      const sql = document.getElementById('sql-query-input')?.value;
      const readOnly = document.getElementById('sql-readonly-check')?.checked !== false;
      const c = document.getElementById('sql-result-container');
      const perfEl = document.getElementById('sql-perf-indicator');
      if (!sql || !sql.trim()) {
        if (c) c.innerHTML = '<div style="color:var(--forge-accent); padding:0.5rem;">Please enter a SQL query.</div>';
        return;
      }
      if (c) c.innerHTML = '<div style="color:var(--forge-text-muted); padding:0.5rem;">Executing query in safe sandbox...</div>';
      if (perfEl) perfEl.innerHTML = '<span style="font-size:0.75rem; color:var(--forge-text-muted);">Executing...</span>';

      const res = await fetch(apiBase + '/api/db/query', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dbName, sql, readOnly })
      }).then(r => r.json());

      if (perfEl && res.durationMs !== undefined) {
        const perfClass = res.durationMs < 2 ? 'db-perf-fast' : (res.durationMs < 15 ? 'db-perf-med' : 'db-perf-slow');
        perfEl.innerHTML = '<span class="db-perf-badge ' + perfClass + '">⚡ ' + res.durationMs + 'ms</span>';
      }

      if (res.error) {
        c.innerHTML = '<div style="color:var(--forge-accent); background:var(--forge-bg-elevated); border:1px solid var(--forge-border); padding:0.65rem; border-radius:var(--forge-radius-sm); margin-top:0.65rem;"><strong>Error:</strong> ' + res.error + '</div>';
        return;
      }
      let html = '<div style="margin:0.65rem 0; font-size:0.78rem; color:var(--forge-success);">⚡ Query executed in ' + res.durationMs + 'ms (' + (res.rows ? res.rows.length : res.affectedRows || 0) + ' rows)</div>';
      if (res.rows && res.rows.length) {
        html += '<div class="astryx-table-wrap"><table class="data-table"><thead><tr>' + res.columns.map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>' +
          res.rows.map(r => '<tr>' + res.columns.map(c => '<td>' + String(r[c] !== null ? r[c] : '') + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
      } else if (res.affectedRows !== undefined) {
        html += '<div style="color:var(--forge-text-muted); font-size:0.8rem;">Rows affected: ' + res.affectedRows + '</div>';
      }
      c.innerHTML = html;
    }

    async function runLatencyBenchmark() {
      const scorecard = document.getElementById('benchmark-scorecard');
      if (scorecard) scorecard.innerHTML = '<div style="color:var(--forge-primary); font-size:0.85rem;">Running 15-sample latency stress test against reverse proxy...</div>';
      try {
        const res = await fetch(apiBase + '/api/benchmark', { method: 'POST' }).then(r => r.json());
        if (scorecard && res.status === 'ok') {
          scorecard.innerHTML = \`
            <div class="astryx-card" style="background:var(--forge-bg-elevated); border:1px solid var(--forge-border-medium);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <strong style="color:var(--forge-primary);">⚡ Latency Benchmark Scorecard</strong>
                <span class="astryx-badge \${res.targetMet ? 'badge-running' : 'badge-degraded'}">\${res.targetMet ? 'SLO TARGET MET (<2ms)' : 'LATENCY WARNING'}</span>
              </div>
              <div style="display:flex; gap:1.5rem; flex-wrap:wrap; font-size:0.85rem;">
                <div>P50 Median: <strong style="color:var(--forge-success);">\${res.p50Ms}ms</strong></div>
                <div>P99 Tail: <strong>\${res.p99Ms}ms</strong></div>
                <div>Avg Latency: <strong>\${res.avgMs}ms</strong></div>
                <div>Throughput: <strong style="color:var(--forge-primary);">\${res.reqPerSec} req/sec</strong></div>
              </div>
            </div>\`;
        }
      } catch (err) {
        if (scorecard) scorecard.innerHTML = '<div style="color:var(--forge-accent);">Benchmark failed.</div>';
      }
    }

    async function loadTraffic() {
      try {
        const res = await fetch(apiBase + '/api/analytics/traffic').then(r => r.json());
        const cont = document.getElementById('traffic-table-container');
        if (!cont || !res.events) return;
        cont.innerHTML = res.events.length ? '<table class="data-table"><thead><tr><th>Time</th><th>App</th><th>Path</th><th>Method</th><th>Status</th><th>Latency</th></tr></thead><tbody>' +
          res.events.map(e => '<tr><td>' + new Date(e.timestamp*1000).toLocaleTimeString() + '</td><td>' + e.app_id + '</td><td><code>' + e.path + '</code></td><td>' + e.method + '</td><td><span class="astryx-badge badge-running">' + e.status_code + '</span></td><td>' + e.duration_ms + 'ms</td></tr>').join('') +
          '</tbody></table>' : '<p style="color:var(--forge-text-muted);">No traffic recorded yet.</p>';
      } catch (err) { console.error('Traffic load failed', err); }
    }

    async function loadIssues() {
      try {
        const res = await fetch(apiBase + '/api/issues').then(r => r.json());
        const cont = document.getElementById('issues-container');
        if (!cont || !res.issues) return;
        cont.innerHTML = res.issues.length ? res.issues.map(i => \`
          <div class="astryx-card" style="margin-bottom:0.65rem;">
            <div style="display:flex; justify-content:space-between;"><strong>\${i.error_type}</strong><span class="astryx-badge badge-pill">Count: \${i.occurrence_count}</span></div>
            <p style="font-size:0.8rem; color:var(--forge-text-muted); margin:0.35rem 0;">\${i.message}</p>
            <div style="font-size:0.72rem; color:var(--forge-text-subtle);">App: \${i.app_id} | Status: \${i.status}</div>
          </div>\`).join('') : '<p style="color:var(--forge-text-muted);">Zero active issues reported.</p>';
      } catch (err) { console.error('Issues load failed', err); }
    }

    async function loadHostVitals() {
      try {
        const res = await fetch(apiBase + '/api/system/metrics').then(r => r.json());
        const grid = document.getElementById('host-vitals-grid');
        if (!grid || !res.vitals) return;
        const v = res.vitals;
        grid.innerHTML = \`
          <div class="astryx-card"><h3>Memory Usage</h3><p style="font-size:1.3rem; font-weight:700; color:var(--forge-primary);">\${v.memPercent}%</p><p style="font-size:0.75rem; color:var(--forge-text-muted);">\${Math.round(v.usedMemBytes/1024/1024/1024)}GB / \${Math.round(v.totalMemBytes/1024/1024/1024)}GB</p></div>
          <div class="astryx-card"><h3>CPU Cores</h3><p style="font-size:1.3rem; font-weight:700; color:var(--forge-accent);">\${v.cpuCount} Cores</p><p style="font-size:0.75rem; color:var(--forge-text-muted);">Load: \${v.cpuLoad.join(', ')}</p></div>
          <div class="astryx-card"><h3>Host Platform</h3><p style="font-size:1.3rem; font-weight:700; color:var(--forge-success);">\${v.platformName}</p><p style="font-size:0.75rem; color:var(--forge-text-muted);">Uptime: \${Math.floor(v.hostUptimeSeconds/3600)}h \${Math.floor((v.hostUptimeSeconds%3600)/60)}m</p></div>\`;
      } catch (err) { console.error('Host vitals load failed', err); }
    }

    async function loadAudit() {
      try {
        const res = await fetch(apiBase + '/api/audit').then(r => r.json());
        const cont = document.getElementById('audit-table-container');
        if (!cont || !res.logs) return;
        cont.innerHTML = res.logs.length ? '<table class="data-table"><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th><th>Status</th></tr></thead><tbody>' +
          res.logs.map(l => '<tr><td>' + new Date(l.timestamp*1000).toLocaleTimeString() + '</td><td>' + l.actor_id + '</td><td><code>' + l.action_type + '</code></td><td>' + l.target_service + '</td><td><span class="astryx-badge badge-running">' + l.result_status + '</span></td></tr>').join('') + '</tbody></table>' : '<p style="color:var(--forge-text-muted);">Zero audit logs recorded.</p>';
      } catch (err) { console.error('Audit load failed', err); }
    }

    // 🚀 Refresh Active Tab Data Helper
    function refreshActiveTab() {
      const tab = window.location.hash.replace('#', '') || 'overview';
      if (tab === 'services') loadServices();
      else if (tab === 'overview') loadTopology();
      else if (tab === 'host') loadHostVitals();
      else if (tab === 'traffic') loadTraffic();
      else if (tab === 'apps') loadApps();
      else if (tab === 'issues') loadIssues();
      // Note: Employee Directory & Org Chart are event/mutation driven to preserve pan/zoom and editing states
    }

    // 🚀 Mount Initial Tab & Start Resilient SSE Watchdog
    initWatchdogAndSSE();
    syncTabFromHash();

    // 🌙 Sleep / Wake & Network Resumption Lifecycle Engine (Auto-Heal on Unlock)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        reconnectSSE();
        refreshActiveTab();
      }
    });

    window.addEventListener('online', () => {
      reconnectSSE();
      refreshActiveTab();
    });

    window.addEventListener('focus', () => {
      refreshActiveTab();
    });

    // ⏱️ Real-Time 1.5-Second Throttled Live Polling Engine
    setInterval(() => {
      if (document.hidden) return;
      refreshActiveTab();
    }, 1500);

    // 🧹 Clean Any Errant Browser Autofill Credentials on Startup
    function sanitizeSearchInputs() {
      const s = document.getElementById('services-search-input');
      if (s && s.value && (s.value.includes('@') || s.value === 'alice.eng@forge.internal')) {
        s.value = '';
        if (typeof filterServicesTable === 'function') filterServicesTable();
      }
      const l = document.getElementById('logs-search-input');
      if (l && l.value && l.value.includes('@')) {
        l.value = '';
      }
    }
    setTimeout(sanitizeSearchInputs, 50);
    setTimeout(sanitizeSearchInputs, 300);
    setTimeout(sanitizeSearchInputs, 1000);
  `;
}



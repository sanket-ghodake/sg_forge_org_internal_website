/**
 * @forge/dev-dashboard - Client-Side Interactive SPA Engine (2026 LTS)
 * Strict Single Page Application (SPA) hash router, responsive drawer, SSE subscriber, and Vitals Cards.
 */

export function getDashboardScripts(): string {
  return `
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

      // Cross-tab real-time listener
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

    function switchSimulatedRole(role) {
      sessionStorage.setItem('forge:v1:platform:simulated-role', role);
      sessionStorage.setItem('sg-forge-role', role);
      console.log('Active RBAC simulation role switched to: ' + role);
    }

    // 📱 Mobile Off-Canvas Navigation Drawer
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

    // ⚡ Strict SPA Navigation Router (Hash & History API + Persistent LocalStorage)
    const TAB_KEY = 'forge:v1:devcenter:active-tab';

    function switchTab(tabId, updateUrl = true) {
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.sb-nav-item').forEach(el => el.classList.remove('active'));
      
      const pane = document.getElementById('tab-' + tabId);
      if (pane) pane.classList.add('active');

      document.querySelectorAll('.sb-nav-item').forEach(n => {
        if (n.dataset.tab === tabId) n.classList.add('active');
      });

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
      if (tabId === 'traffic') loadTraffic();
      if (tabId === 'issues') loadIssues();
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

    const evtSource = new EventSource(apiBase + '/api/logs/stream');
    evtSource.addEventListener('log', e => {
      const log = JSON.parse(e.data);
      appendLogLine(log);
      appendAppLogModalLine(log);
    });

    function appendLogLine(l) {
      const line = '[' + l.timestamp.slice(11, 19) + '] [' + l.level + '] (' + l.service + '): ' + l.message + '\\n';
      const oTerm = document.getElementById('overview-terminal');
      const fTerm = document.getElementById('full-terminal');
      if (oTerm) { oTerm.textContent += line; oTerm.scrollTop = oTerm.scrollHeight; }
      if (fTerm) { fTerm.textContent += line; fTerm.scrollTop = fTerm.scrollHeight; }
    }

    function appendAppLogModalLine(l) {
      if (!currentAppLogService || (l.service !== currentAppLogService && currentAppLogService !== 'all')) return;
      const line = '[' + l.timestamp.slice(11, 19) + '] [' + l.level + '] (' + l.service + '): ' + l.message;
      appLogBuffer.push(line);
      if (appLogBuffer.length > 500) appLogBuffer.shift();
      const term = document.getElementById('app-logs-terminal');
      if (term) { term.textContent += line + '\\n'; term.scrollTop = term.scrollHeight; }
    }

    function openHelpModal() { document.getElementById('help-modal')?.classList.add('open'); }
    function closeHelpModal() { document.getElementById('help-modal')?.classList.remove('open'); }

    async function openAppLogsModal(id, name, port, ingress) {
      currentAppLogService = id;
      appLogBuffer = [];
      document.getElementById('app-logs-title').textContent = '📜 Live Logs: ' + name + ' (' + id + ')';
      document.getElementById('app-logs-meta').textContent = 'Port: :' + port + ' | Ingress: ' + ingress;
      const term = document.getElementById('app-logs-terminal');
      if (term) term.textContent = 'Connecting to isolated stream for ' + id + '...\\n';
      document.getElementById('app-logs-modal')?.classList.add('open');

      try {
        const res = await fetch(apiBase + '/api/logs/recent?service=' + id).then(r => r.json());
        if (res.logs && res.logs.length && term) {
          appLogBuffer = res.logs.map(l => '[' + l.timestamp.slice(11, 19) + '] [' + l.level + '] (' + l.service + '): ' + l.message);
          term.textContent = appLogBuffer.join('\\n') + '\\n';
          term.scrollTop = term.scrollHeight;
        }
      } catch (err) {}
    }

    function closeAppLogsModal() {
      currentAppLogService = null;
      document.getElementById('app-logs-modal')?.classList.remove('open');
    }

    function filterAppLogs(term) {
      const el = document.getElementById('app-logs-terminal');
      if (!el) return;
      el.textContent = (!term ? appLogBuffer : appLogBuffer.filter(l => l.toLowerCase().includes(term.toLowerCase()))).join('\\n') + '\\n';
      el.scrollTop = el.scrollHeight;
    }

    function clearAppLogs() {
      appLogBuffer = [];
      const term = document.getElementById('app-logs-terminal');
      if (term) term.textContent = '';
    }

    function clearLogs() {
      const o = document.getElementById('overview-terminal');
      const f = document.getElementById('full-terminal');
      if (o) o.textContent = '';
      if (f) f.textContent = '';
    }

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

    async function loadServices() {
      try {
        const res = await fetch(apiBase + '/api/services').then(r => r.json());
        if (!res) return;
        const summary = res.summary, cards = document.getElementById('services-vitals-cards');
        if (cards && summary) {
          const storageMb = (summary.storageSizeBytes / (1024 * 1024)).toFixed(1);
          cards.innerHTML = \`
            <div class="vitals-card">
              <div class="vitals-header"><span class="vitals-title">Service Fleet Health</span><span class="astryx-badge badge-running"><span class="badge-dot"></span> Active</span></div>
              <div class="vitals-value">\${summary.onlineCount} / \${summary.totalServices} <span style="font-size:0.85rem; font-weight:500; color:var(--forge-primary);">Running</span></div>
              <div class="vitals-subtext"><span>\${summary.sloAvailabilityPercent}% Availability</span><span style="color:var(--forge-primary); font-weight:600;">100% SLO</span></div>
            </div>
            <div class="vitals-card">
              <div class="vitals-header"><span class="vitals-title">CPU Utilization</span><span class="astryx-badge badge-pill">\${summary.cpuCores} Cores</span></div>
              <div class="vitals-value">\${summary.avgCpuPercent}% <span style="font-size:0.8rem; font-weight:500; color:var(--forge-text-muted);">Avg Load</span></div>
              <div class="vitals-bar-container"><div class="vitals-bar-fill" style="width:\${Math.min(summary.avgCpuPercent, 100)}%;"></div></div>
            </div>
            <div class="vitals-card">
              <div class="vitals-header"><span class="vitals-title">Memory Allocation</span><span class="astryx-badge badge-pill">RAM Pool</span></div>
              <div class="vitals-value">\${summary.totalAllocatedRamMb} MB <span style="font-size:0.8rem; font-weight:500; color:var(--forge-text-muted);">/ \${summary.maxAllocatedRamMb} MB</span></div>
              <div class="vitals-bar-container"><div class="vitals-bar-fill" style="width:\${Math.min((summary.totalAllocatedRamMb / summary.maxAllocatedRamMb) * 100, 100)}%;"></div></div>
            </div>
            <div class="vitals-card">
              <div class="vitals-header"><span class="vitals-title">Storage & DB Quota</span><span class="astryx-badge badge-running">\${summary.autoVacuum}</span></div>
              <div class="vitals-value">\${storageMb} MB <span style="font-size:0.8rem; font-weight:500; color:var(--forge-text-muted);">/ \${summary.storageQuotaMb} MB Cap</span></div>
              <div class="vitals-subtext"><span>\${summary.tursoDbsCount} Turso Databases</span><span style="color:var(--forge-primary); font-weight:600;">WAL Enabled</span></div>
            </div>\`;
        }

        const tbody = document.getElementById('services-tbody');
        if (tbody && res.services) {
          tbody.innerHTML = res.services.map(s => {
            const latClass = s.latencyMs < 5 ? 'latency-fast' : s.latencyMs < 50 ? 'latency-medium' : 'latency-slow';
            const sBadge = s.status === 'RUNNING' ? '<span class="astryx-badge badge-running"><span class="badge-dot"></span> RUNNING</span>' :
              s.status === 'STOPPED' ? '<span class="astryx-badge badge-stopped">STOPPED</span>' :
              s.status === 'DEGRADED' ? '<span class="astryx-badge badge-degraded">DEGRADED</span>' : '<span class="astryx-badge badge-starting">STARTING</span>';
            const actions = s.status === 'RUNNING'
              ? \`<button class="astryx-btn btn-outline" style="padding:0.2rem 0.45rem; font-size:0.72rem;" onclick="restartService('\${s.id}')">🔄 Restart</button>
                 <button class="astryx-btn btn-outline" style="padding:0.2rem 0.45rem; font-size:0.72rem;" onclick="toggleServiceState('\${s.id}','stop')">🛑 Stop</button>\`
              : \`<button class="astryx-btn btn-primary" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="toggleServiceState('\${s.id}','start')">▶️ Start</button>\`;

            return \`
              <tr>
                <td>\${sBadge}</td>
                <td><strong>\${s.name}</strong> <span style="color:var(--forge-text-subtle); font-size:0.75rem;">(\${s.id})</span></td>
                <td><div class="sparkline-cell"><span style="min-width:32px; font-weight:600;">\${s.cpuPercent}%</span>\${renderSparklineSvg(s.cpuSparkline, false)}</div></td>
                <td><div class="sparkline-cell"><span style="min-width:48px; font-weight:600;">\${s.memoryMb} MB</span>\${renderSparklineSvg(s.ramSparkline, true)}</div></td>
                <td><span class="latency-pill \${latClass}">\${s.latencyMs}ms</span></td>
                <td><code>\${s.port}</code></td>
                <td><code>\${s.ingressPath}</code></td>
                <td><div style="display:flex; gap:0.3rem;">\${actions}<button class="astryx-btn btn-outline" style="padding:0.2rem 0.45rem; font-size:0.72rem;" onclick="openAppLogsModal('\${s.id}','\${s.name}','\${s.port}','\${s.ingressPath}')">📜 Logs</button></div></td>
              </tr>\`;
          }).join('');
        }
      } catch (err) { console.error('Services load failed', err); }
    }

    async function restartService(id) {
      await fetch(apiBase + '/api/services/restart', { method: 'POST', body: JSON.stringify({ serviceId: id }) });
      loadServices();
      loadTopology();
    }

    async function toggleServiceState(id, state) {
      await fetch(apiBase + '/api/services/toggle', { method: 'POST', body: JSON.stringify({ serviceId: id, state }) });
      loadServices();
      loadTopology();
    }

    async function loadApps() {
      try {
        const res = await fetch(apiBase + '/api/apps').then(r => r.json());
        const grid = document.getElementById('apps-grid');
        if (!grid || !res.apps) return;
        grid.innerHTML = res.apps.map(a => \`
          <div class="astryx-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <h3 style="font-size:0.95rem;">\${a.name}</h3><span class="astryx-badge badge-running">\${a.status}</span>
            </div>
            <p style="font-size:0.78rem; color:var(--forge-text-muted); margin-bottom:0.65rem;">Category: \${a.category} | Role: \${a.access_role}</p>
            <div style="font-size:0.75rem; margin-bottom:0.75rem;">
              <div>Path: <code>\${a.ingress_path}</code> (Port \${a.port})</div>
              <div>DB: <code>\${a.db_file_path ? a.db_file_path.split('/').pop() : 'platform_core.db'}</code></div>
            </div>
            <a href="\${a.ingress_path}" class="astryx-btn btn-primary" style="padding:0.25rem 0.65rem; font-size:0.75rem;" target="_blank">Launch &rarr;</a>
          </div>\`).join('');
      } catch (err) { console.error('Apps load failed', err); }
    }

    async function loadDatabases() {
      try {
        const res = await fetch(apiBase + '/api/db/list').then(r => r.json());
        const s1 = document.getElementById('db-select'), s2 = document.getElementById('sql-db-select');
        if (!res.databases) return;
        const opts = res.databases.map(d => \`<option value="\${d.name}">\${d.name} (\${Math.round(d.sizeBytes/1024)} KB)</option>\`).join('');
        if (s1) s1.innerHTML = opts;
        if (s2) s2.innerHTML = opts;
        if (res.databases[0]) inspectDatabase(res.databases[0].name);
      } catch (err) { console.error('Databases load failed', err); }
    }

    async function inspectDatabase(dbName) {
      try {
        const res = await fetch(apiBase + '/api/db/query', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dbName, sql: "SELECT name, type FROM sqlite_master WHERE type='table' ORDER BY name ASC;" })
        }).then(r => r.json());
        const c = document.getElementById('db-tables-view');
        if (!c) return;
        c.innerHTML = (res.rows && res.rows.length)
          ? '<table class="data-table"><thead><tr><th>Table Name</th><th>Type</th></tr></thead><tbody>' +
            res.rows.map(r => '<tr><td><strong>' + r.name + '</strong></td><td><code>' + r.type + '</code></td></tr>').join('') + '</tbody></table>'
          : '<p style="color:var(--forge-text-muted);">No tables found in ' + dbName + '</p>';
      } catch (err) { console.error('Inspect DB failed', err); }
    }

    async function optimizeCurrentDb() {
      const dbName = document.getElementById('db-select').value;
      const res = await fetch(apiBase + '/api/db/optimize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dbName })
      }).then(r => r.json());
      alert(res.message);
    }

    async function backupCurrentDb() {
      const dbName = document.getElementById('db-select').value;
      const res = await fetch(apiBase + '/api/db/backup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dbName })
      }).then(r => r.json());
      alert(res.message);
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

    async function runSqlQuery() {
      const dbName = document.getElementById('sql-db-select').value;
      const sql = document.getElementById('sql-query-input').value;
      const readOnly = document.getElementById('sql-readonly-check').checked;
      const res = await fetch(apiBase + '/api/db/query', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dbName, sql, readOnly })
      }).then(r => r.json());
      const c = document.getElementById('sql-result-container');
      if (res.error) {
        c.innerHTML = '<div style="color:var(--forge-accent); background:var(--forge-bg-elevated); border:1px solid var(--forge-border); padding:0.65rem; border-radius:var(--forge-radius-sm); margin-top:0.65rem;"><strong>Error:</strong> ' + res.error + '</div>';
        return;
      }
      let html = '<div style="margin:0.65rem 0; font-size:0.78rem; color:var(--forge-success);">Query executed in ' + res.durationMs + 'ms (' + (res.rows ? res.rows.length : res.affectedRows || 0) + ' rows)</div>';
      if (res.rows && res.rows.length) {
        html += '<div class="astryx-table-wrap"><table class="data-table"><thead><tr>' + res.columns.map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>' +
          res.rows.map(r => '<tr>' + res.columns.map(c => '<td>' + String(r[c] !== null ? r[c] : '') + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
      }
      c.innerHTML = html;
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

    // 🚀 Mount Initial Tab from URL hash or default to overview
    syncTabFromHash();

    // ⏱️ Real-Time 1-Second Continuous Live Polling Engine
    setInterval(() => {
      const tab = window.location.hash.replace('#', '') || 'overview';
      if (tab === 'services') loadServices();
      else if (tab === 'overview') loadTopology();
      else if (tab === 'host') loadHostVitals();
      else if (tab === 'traffic') loadTraffic();
    }, 1000);
  `;
}

/**
 * @forge/dev-dashboard - Developer Tools & Command Palette Client Scripts (2026 LTS)
 * Modular client-side scripts for Command Palette (Cmd+K), Database Studio, Safe Env, and API Registry.
 */

export function getToolsDashboardScripts(): string {
  return `
    let currentSelectedDb = 'platform_core.db';
    let currentSelectedTable = 'apps_registry';
    let currentTablePage = 1;
    let currentDbSubTab = 'rows';

    async function loadDatabases() {
      try {
        const res = await fetch(apiBase + '/api/db/list').then(r => r.json());
        const s1 = document.getElementById('db-select');
        if (!s1) return;
        let opts = '';
        if (res.databases && res.databases.length) {
          opts += '<optgroup label="Local Microservice DBs">';
          opts += res.databases.map(d => '<option value="' + d.name + '">🗄️ ' + d.name + ' (' + Math.round(d.sizeBytes/1024) + ' KB)</option>').join('');
          opts += '</optgroup>';
        }
        if (res.remoteDatabases && res.remoteDatabases.length) {
          opts += '<optgroup label="Remote Microservice DBs">';
          opts += res.remoteDatabases.map(d => '<option value="' + d.name + '">🌐 ' + d.displayName + '</option>').join('');
          opts += '</optgroup>';
        }
        s1.innerHTML = opts || '<option value="platform_core.db">platform_core.db</option>';
        if (res.databases?.[0] && !res.databases.some(d => d.name === currentSelectedDb)) {
          inspectDatabase(res.databases[0].name);
        } else {
          inspectDatabase(currentSelectedDb);
        }
      } catch (err) { console.error('Databases load failed', err); }
    }

    function switchDbSubTab(tab) {
      currentDbSubTab = tab;
      ['rows', 'sql', 'ddl'].forEach(t => {
        const btn = document.getElementById('btn-subtab-' + t);
        const pane = document.getElementById('db-subpane-' + t);
        if (btn) btn.classList.toggle('active', t === tab);
        if (pane) pane.style.display = t === tab ? 'block' : 'none';
      });
      if (tab === 'ddl') viewTableDdl(currentSelectedDb, currentSelectedTable);
    }

    async function inspectDatabase(dbName) {
      currentSelectedDb = dbName;
      try {
        const res = await fetch(apiBase + '/api/db/query', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dbName, sql: "SELECT name, type FROM sqlite_master WHERE type='table' ORDER BY name ASC;" })
        }).then(r => r.json());
        const c = document.getElementById('db-tables-view');
        const badge = document.getElementById('db-tables-count-badge');
        if (!c) return;
        if (res.rows && res.rows.length) {
          if (badge) badge.textContent = res.rows.length + ' tables';
          c.innerHTML = res.rows.map(r =>
            '<div class="db-table-item ' + (r.name === currentSelectedTable ? 'active' : '') + '" onclick="selectTable(\\'dbName\\', \\'' + r.name + '\\')">' +
              '<span>📄 <strong>' + r.name + '</strong></span>' +
              '<span style="font-size:0.7rem; color:var(--forge-text-muted);">' + r.type + '</span>' +
            '</div>'
          ).join('');
          selectTable(dbName, res.rows[0].name);
        } else {
          if (badge) badge.textContent = '0 tables';
          c.innerHTML = '<p style="color:var(--forge-text-muted); font-size:0.8rem; padding:0.5rem;">No tables found in ' + dbName + '</p>';
        }
      } catch (err) { console.error('Inspect DB failed', err); }
    }

    function selectTable(dbName, tableName) {
      currentSelectedDb = document.getElementById('db-select')?.value || currentSelectedDb;
      currentSelectedTable = tableName;
      document.querySelectorAll('.db-table-item').forEach(el => {
        el.classList.toggle('active', el.textContent.includes(tableName));
      });
      browseTableRows(currentSelectedDb, tableName, 1);
      if (currentDbSubTab === 'ddl') viewTableDdl(currentSelectedDb, tableName);
    }

    async function browseTableRows(dbName, tableName, page = 1) {
      currentSelectedDb = dbName;
      currentSelectedTable = tableName;
      currentTablePage = page;
      const title = document.getElementById('db-table-data-title');
      const view = document.getElementById('db-table-data-view');
      const pager = document.getElementById('db-pagination-bar');
      if (title) title.textContent = 'Table: ' + tableName + ' (' + dbName + ')';
      if (view) view.innerHTML = '<div style="color:var(--forge-text-muted); padding:0.5rem;">Loading records...</div>';

      try {
        const res = await fetch(apiBase + '/api/db/rows?db=' + dbName + '&table=' + tableName + '&page=' + page + '&limit=15').then(r => r.json());
        if (res.rows && res.rows.length) {
          view.innerHTML = '<table class="data-table"><thead><tr>' + res.columns.map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>' +
            res.rows.map(r => '<tr>' + res.columns.map(c => '<td>' + String(r[c] !== null ? r[c] : '') + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
          const totalPages = Math.ceil((res.totalCount || 1) / res.limit);
          pager.innerHTML = '<span style="font-size:0.75rem; color:var(--forge-text-muted);">Page ' + page + ' of ' + totalPages + ' (' + res.totalCount + ' rows)</span>' +
            '<div style="display:flex; gap:0.3rem;">' +
            (page > 1 ? '<button class="astryx-btn btn-outline" style="padding:0.2rem 0.5rem; font-size:0.72rem;" onclick="browseTableRows(\\'' + dbName + '\\',\\'' + tableName + '\\',' + (page - 1) + ')">&larr; Prev</button>' : '') +
            (page < totalPages ? '<button class="astryx-btn btn-outline" style="padding:0.2rem 0.5rem; font-size:0.72rem;" onclick="browseTableRows(\\'' + dbName + '\\',\\'' + tableName + '\\',' + (page + 1) + ')">Next &rarr;</button>' : '') +
            '</div>';
        } else {
          view.innerHTML = '<p style="color:var(--forge-text-muted); padding:0.5rem;">Zero rows in table ' + tableName + '.</p>';
          if (pager) pager.innerHTML = '';
        }
      } catch (err) {
        if (view) view.innerHTML = '<div style="color:var(--forge-accent); padding:0.5rem;">Failed to browse table rows.</div>';
      }
    }

    async function viewTableDdl(dbName, tableName) {
      const title = document.getElementById('db-ddl-title');
      const view = document.getElementById('db-ddl-view');
      if (title) title.textContent = '📜 Schema DDL: ' + tableName + ' (' + dbName + ')';
      if (view) view.textContent = 'Loading schema definition...';
      try {
        const res = await fetch(apiBase + '/api/db/schema?db=' + dbName + '&table=' + tableName).then(r => r.json());
        let text = res.ddl || '';
        if (res.indexes && res.indexes.length) text += '\\n\\n-- Indexes\\n' + res.indexes.join(';\\n') + ';';
        if (view) view.textContent = text;
      } catch (err) {
        if (view) view.textContent = 'Failed to load DDL schema.';
      }
    }

    async function checkDatabaseIntegrity() {
      const dbName = document.getElementById('db-select').value;
      const res = await fetch(apiBase + '/api/db/integrity', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dbName })
      }).then(r => r.json());
      if (window.astryxToast) {
        window.astryxToast(res.success ? 'Database integrity verified (0 errors).' : 'Integrity check result: ' + JSON.stringify(res), res.success ? 'success' : 'warning');
      }
    }

    async function optimizeCurrentDb() {
      const dbName = document.getElementById('db-select').value;
      const res = await fetch(apiBase + '/api/db/optimize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dbName })
      }).then(r => r.json());
      if (window.astryxToast) {
        window.astryxToast(res.message, res.success ? 'success' : 'info');
      }
    }

    async function backupCurrentDb() {
      const dbName = document.getElementById('db-select').value;
      const res = await fetch(apiBase + '/api/db/backup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dbName })
      }).then(r => r.json());
      if (window.astryxToast) {
        window.astryxToast(res.message, res.success ? 'success' : 'info');
      }
    }

    function exportCurrentTableCsv() {
      window.open(apiBase + '/api/export/csv?type=table&db=' + currentSelectedDb + '&table=' + currentSelectedTable, '_blank');
    }
    function exportTrafficCsv() { window.open(apiBase + '/api/export/csv?type=traffic', '_blank'); }
    function exportAuditCsv() { window.open(apiBase + '/api/export/csv?type=audit', '_blank'); }

    function insertSqlSnippet(snippet) {
      const el = document.getElementById('sql-query-input');
      if (el) el.value = snippet;
    }

    function exportSqlResultCsv() {
      const db = document.getElementById('db-select').value;
      window.open(apiBase + '/api/export/csv?type=table&db=' + db + '&table=' + currentSelectedTable, '_blank');
    }

    // 🔌 Connect Remote DB Modal Handlers
    function openConnectModal() {
      document.getElementById('connect-db-modal')?.classList.add('open');
      const st = document.getElementById('remote-conn-status');
      if (st) st.innerHTML = '';
    }
    function closeConnectModal() {
      document.getElementById('connect-db-modal')?.classList.remove('open');
    }

    async function testRemoteConnection() {
      const url = document.getElementById('remote-conn-url')?.value;
      const token = document.getElementById('remote-conn-token')?.value;
      const type = document.getElementById('remote-conn-type')?.value;
      const st = document.getElementById('remote-conn-status');
      if (!url) {
        if (st) st.innerHTML = '<span style="color:var(--forge-accent);">Please enter a connection URL.</span>';
        return;
      }
      if (st) st.innerHTML = '<span style="color:var(--forge-primary);">Pinging remote database endpoint...</span>';
      try {
        const res = await fetch(apiBase + '/api/db/test-connect', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, authToken: token, type })
        }).then(r => r.json());
        if (res.success) {
          if (st) st.innerHTML = '<span style="color:var(--forge-success);">🟢 Connection successful (' + res.latencyMs + 'ms latency)</span>';
        } else {
          if (st) st.innerHTML = '<span style="color:var(--forge-accent);">🔴 Connection failed: ' + (res.error || 'Check endpoint and credentials') + '</span>';
        }
      } catch (err) {
        if (st) st.innerHTML = '<span style="color:var(--forge-accent);">Ping error: ' + err.message + '</span>';
      }
    }

    async function saveRemoteConnection() {
      const name = document.getElementById('remote-conn-name')?.value;
      const url = document.getElementById('remote-conn-url')?.value;
      const token = document.getElementById('remote-conn-token')?.value;
      const type = document.getElementById('remote-conn-type')?.value;
      const mode = document.getElementById('remote-conn-mode')?.value;
      const st = document.getElementById('remote-conn-status');
      if (!name || !url) {
        if (st) st.innerHTML = '<span style="color:var(--forge-accent);">Name and URL are required.</span>';
        return;
      }
      try {
        const res = await fetch(apiBase + '/api/db/connect', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, url, authToken: token, type, readOnly: mode === 'readonly' })
        }).then(r => r.json());
        if (res.success) {
          if (window.astryxToast) window.astryxToast('Connected to ' + name + ' successfully!', 'success');
          closeConnectModal();
          await loadDatabases();
          if (res.connectionId) {
            document.getElementById('db-select').value = res.connectionId;
            inspectDatabase(res.connectionId);
          }
        } else {
          if (st) st.innerHTML = '<span style="color:var(--forge-accent);">' + (res.message || 'Failed to save connection') + '</span>';
        }
      } catch (err) {
        if (st) st.innerHTML = '<span style="color:var(--forge-accent);">Save failed: ' + err.message + '</span>';
      }
    }

    // ⚡ Command Palette & Modal Handlers
    const paletteCommands = [
      { label: '📊 Overview (Topology & Vitals)', action: () => switchTab('overview') },
      { label: '⚡ Services & Processes Command Center', action: () => switchTab('services') },
      { label: '🧩 Registered Forge Apps', action: () => switchTab('apps') },
      { label: '🗄️ Unified Database Studio', action: () => switchTab('database') },
      { label: '📜 Isolated App Logs & Observability', action: () => switchTab('logs') },
      { label: '📈 Real-time Traffic Analytics', action: () => switchTab('traffic') },
      { label: '⚠️ Issue Incident Center (RFC 7807)', action: () => switchTab('issues') },
      { label: '☁️ Host Infrastructure Metrics', action: () => switchTab('host') },
      { label: '⚙️ Settings & Tools', action: () => switchTab('settings') },
      { label: '🔌 Connect Remote Database', action: () => openConnectModal() },
      { label: '⚡ Open API Route Explorer & cURL', action: () => openApiRegistryModal() },
      { label: '🔐 Open Masked Environment Inspector', action: () => openSafeEnvModal() },
      { label: '🚀 Run Latency Benchmark', action: () => { switchTab('services'); runLatencyBenchmark(); } },
      { label: '✨ 1-Click Database Optimize', action: () => optimizeCurrentDb() }
    ];

    function openCommandPalette() {
      const modal = document.getElementById('cmd-palette-modal');
      const input = document.getElementById('palette-search-input');
      if (modal) modal.classList.add('open');
      if (input) { input.value = ''; input.focus(); }
      filterPaletteItems('');
    }

    function closeCommandPalette() {
      document.getElementById('cmd-palette-modal')?.classList.remove('open');
    }

    function filterPaletteItems(q) {
      const list = document.getElementById('palette-items-list');
      if (!list) return;
      const filtered = !q ? paletteCommands : paletteCommands.filter(c => c.label.toLowerCase().includes(q.toLowerCase()));
      list.innerHTML = filtered.map((c, i) =>
        '<li class="palette-item" onclick="executePaletteItem(' + i + ')">' +
        '<span>' + c.label + '</span>' +
        '<span style="font-size:0.75rem; color:var(--forge-text-muted);">&rarr; Jump</span>' +
        '</li>'
      ).join('');
      window._activePaletteList = filtered;
    }

    function executePaletteItem(index) {
      const item = (window._activePaletteList || paletteCommands)[index];
      if (item && item.action) {
        item.action();
        closeCommandPalette();
      }
    }

    async function openSafeEnvModal() {
      const modal = document.getElementById('safe-env-modal');
      const cont = document.getElementById('safe-env-table-container');
      if (modal) modal.classList.add('open');
      if (cont) cont.innerHTML = '<div style="color:var(--forge-text-muted);">Loading environment configs...</div>';
      try {
        const res = await fetch(apiBase + '/api/env/safe').then(r => r.json());
        if (cont && res.env) {
          const keys = Object.keys(res.env).sort();
          cont.innerHTML = '<table class="data-table"><thead><tr><th>Variable</th><th>Active Value</th></tr></thead><tbody>' +
            keys.map(k => '<tr><td><code>' + k + '</code></td><td>' + res.env[k] + '</td></tr>').join('') + '</tbody></table>';
        }
      } catch (err) { if (cont) cont.innerHTML = '<div style="color:var(--forge-accent);">Failed to load env.</div>'; }
    }
    function closeSafeEnvModal() { document.getElementById('safe-env-modal')?.classList.remove('open'); }

    function copyCurlSnippet(path, port) {
      const target = path.startsWith('http') ? path : 'http://localhost:' + port + path;
      navigator.clipboard.writeText('curl -i ' + target);
      if (window.astryxToast) {
        window.astryxToast('cURL command copied to clipboard: curl -i ' + target, 'info');
      }
    }

    async function openApiRegistryModal() {
      const modal = document.getElementById('api-registry-modal');
      const cont = document.getElementById('api-registry-container');
      if (modal) modal.classList.add('open');
      if (cont) cont.innerHTML = '<div style="color:var(--forge-text-muted);">Loading API endpoints...</div>';
      try {
        const res = await fetch(apiBase + '/api/routes/registry').then(r => r.json());
        if (cont && res.endpoints) {
          cont.innerHTML = res.endpoints.map(e =>
            '<div class="astryx-card" style="margin-bottom:0.75rem; background:var(--forge-bg-elevated);">' +
              '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                '<strong>' + e.name + ' (' + e.serviceId + ')</strong>' +
                '<span class="astryx-badge badge-running">:' + e.port + '</span>' +
              '</div>' +
              '<div style="margin-top:0.4rem; font-size:0.78rem;">' +
                e.sampleRoutes.map(r =>
                  '<div style="display:flex; justify-content:space-between; align-items:center; padding:0.25rem 0; border-bottom:1px solid var(--forge-border);">' +
                    '<code>' + r.method + ' ' + r.path + '</code>' +
                    '<button class="astryx-btn btn-outline" style="padding:0.1rem 0.35rem; font-size:0.68rem;" onclick="copyCurlSnippet(\\'' + r.path + '\\', ' + e.port + ')">📋 Copy cURL</button>' +
                  '</div>'
                ).join('') +
              '</div>' +
            '</div>'
          ).join('');
        }
      } catch (err) { if (cont) cont.innerHTML = '<div style="color:var(--forge-accent);">Failed to load registry.</div>'; }
    }
    function closeApiRegistryModal() { document.getElementById('api-registry-modal')?.classList.remove('open'); }

    // ⌨️ Global Developer Keyboard Conductor
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCommandPalette();
      } else if (e.key === 'Escape') {
        closeCommandPalette();
        closeConnectModal();
        closeSafeEnvModal();
        closeApiRegistryModal();
        closeHelpModal();
        closeAppLogsModal();
        if (typeof closeServiceDrawer === 'function') closeServiceDrawer();
      } else if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        const tabMap = { '1': 'overview', '2': 'services', '3': 'apps', '4': 'database', '5': 'logs', '6': 'traffic', '7': 'issues', '8': 'host', '9': 'settings' };
        if (tabMap[e.key]) switchTab(tabMap[e.key]);
      }
    });
  `;
}

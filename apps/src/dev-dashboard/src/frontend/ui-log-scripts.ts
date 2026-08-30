/**
 * @forge/dev-dashboard - Client Log Streamer & Zero-Hang Virtual Renderer (2026 LTS)
 * Modular client-side log engine, watchdog heartbeat, and 4-pillar inspector.
 */

export function getLogDashboardScripts(): string {
  return `
    let activeLogApp = 'all';
    let activeLogSource = 'all';
    let activeLogLevel = 'ALL';
    let modalActivePillar = 'all';
    let lastSseEventTime = Date.now();
    let sseClient = null;
    const MAX_DOM_LOG_LINES = 250;

    // ⚡ Watchdog Heartbeat Monitor & Resilient SSE Manager
    function initWatchdogAndSSE() {
      if (sseClient) { try { sseClient.close(); } catch(e){} }
      
      const updateWatchdogUI = (status, text) => {
        const dot = document.getElementById('watchdog-dot');
        const label = document.getElementById('watchdog-text');
        if (!dot || !label) return;
        dot.className = 'watchdog-dot ' + status;
        label.textContent = text;
      };

      try {
        sseClient = new EventSource(apiBase + '/api/logs/stream');
        sseClient.onopen = () => {
          lastSseEventTime = Date.now();
          updateWatchdogUI('live', 'Live Stream');
        };
        sseClient.onerror = () => {
          updateWatchdogUI('reconnecting', 'Reconnecting...');
        };
        sseClient.addEventListener('log', e => {
          lastSseEventTime = Date.now();
          updateWatchdogUI('live', 'Live Stream');
          try {
            const log = JSON.parse(e.data);
            appendLogToTerminal(log);
            appendAppLogModalLine(log);
            updatePlainEnglishBanner(log);
          } catch(err) {}
        });
      } catch (err) {
        updateWatchdogUI('frozen', 'Disconnected');
      }

      setInterval(() => {
        if (Date.now() - lastSseEventTime > 12000) {
          updateWatchdogUI('frozen', 'Stream Stalled (Click)');
        }
      }, 3000);
    }

    function reconnectSSE() {
      initWatchdogAndSSE();
      loadActiveTabLogs();
    }

    // 🚀 High-Performance Zero-Hang DOM Log Renderer
    function appendLogToTerminal(l) {
      if (activeLogApp !== 'all' && l.service !== activeLogApp) return;
      if (activeLogSource !== 'all' && (l.source || 'app') !== activeLogSource) return;
      if (activeLogLevel !== 'ALL' && l.level !== activeLogLevel) return;

      const fTerm = document.getElementById('full-terminal');
      const oTerm = document.getElementById('overview-terminal');
      if (fTerm) renderSingleRowToDOM(fTerm, l);
      if (oTerm) renderSingleRowToDOM(oTerm, l);
    }

    function renderSingleRowToDOM(container, l) {
      if (!container) return;
      while (container.children.length >= MAX_DOM_LOG_LINES) {
        container.removeChild(container.firstChild);
      }

      const row = document.createElement('div');
      row.className = 'log-row';
      const timeStr = l.timestamp ? l.timestamp.slice(11, 19) : new Date().toTimeString().slice(0, 8);
      const lvlClass = 'log-lvl-' + (l.level || 'info').toLowerCase();
      const srcText = l.source ? l.source.toUpperCase() : 'APP';

      row.innerHTML = '<span class="log-ts">[' + timeStr + ']</span> ' +
        '<span class="' + lvlClass + '">[' + (l.level || 'INFO') + ']</span> ' +
        '<span class="log-svc">(' + l.service + ')</span> ' +
        '<span class="log-source">' + srcText + '</span> ' +
        '<span class="log-msg">' + escapeHtml(l.message || '') + '</span>';

      container.appendChild(row);
      container.scrollTop = container.scrollHeight;
    }

    function escapeHtml(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function updatePlainEnglishBanner(l) {
      const banner = document.getElementById('plain-english-banner');
      const icon = document.getElementById('plain-status-icon');
      const title = document.getElementById('plain-status-title');
      const detail = document.getElementById('plain-status-detail');
      if (!banner || !icon || !title || !detail) return;

      if (l.level === 'ERROR' || l.level === 'FATAL') {
        icon.textContent = '🔴';
        title.textContent = 'Issue Reported in ' + l.service.toUpperCase();
        detail.textContent = l.plainEnglishSummary || l.message;
      } else if (l.level === 'WARN') {
        icon.textContent = '🟡';
        title.textContent = 'Warning in ' + l.service.toUpperCase();
        detail.textContent = l.plainEnglishSummary || l.message;
      } else if (l.message && (l.message.includes('SYSTEM_BOOT') || l.message.includes('started') || l.message.includes('online'))) {
        icon.textContent = '🟢';
        title.textContent = l.service.toUpperCase() + ' Online & Healthy';
        detail.textContent = l.plainEnglishSummary || 'Service initialized successfully.';
      }
    }

    async function loadActiveTabLogs() {
      const term = document.getElementById('full-terminal');
      if (!term) return;
      term.innerHTML = '<div style="color:var(--forge-text-muted);">Loading logs...</div>';
      try {
        let url = apiBase + '/api/logs/recent?limit=150';
        if (activeLogApp !== 'all') url += '&service=' + activeLogApp;
        if (activeLogSource !== 'all') url += '&source=' + activeLogSource;
        if (activeLogLevel !== 'ALL') url += '&level=' + activeLogLevel;

        const res = await fetch(url).then(r => r.json());
        term.innerHTML = '';
        if (res.logs && res.logs.length) {
          res.logs.forEach(l => renderSingleRowToDOM(term, l));
        } else {
          term.innerHTML = '<div style="color:var(--forge-text-muted); padding:0.5rem;">Zero matching log entries found.</div>';
        }
      } catch (err) {
        term.innerHTML = '<div style="color:var(--forge-accent); padding:0.5rem;">Failed to fetch logs.</div>';
      }
    }

    function changeActiveLogApp(app) {
      activeLogApp = app;
      loadActiveTabLogs();
    }

    function changeActiveLogSource(source) {
      activeLogSource = source;
      loadActiveTabLogs();
    }

    function changeActiveLogLevel(level) {
      activeLogLevel = level;
      loadActiveTabLogs();
    }

    async function clearActiveAppLogs() {
      await fetch(apiBase + '/api/logs/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: activeLogApp !== 'all' ? activeLogApp : undefined })
      });
      const term = document.getElementById('full-terminal');
      if (term) term.innerHTML = '';
    }

    // App Log Modal
    async function openAppLogsModal(id, name, port, ingress) {
      currentAppLogService = id;
      modalActivePillar = 'all';
      document.getElementById('app-logs-title').textContent = '📜 ' + name + ' (' + id + ')';
      document.getElementById('app-logs-meta').textContent = 'Port: :' + port + ' | Route: ' + ingress;
      document.getElementById('app-logs-modal')?.classList.add('open');
      setModalPillar('all');
    }

    function closeAppLogsModal() {
      currentAppLogService = null;
      document.getElementById('app-logs-modal')?.classList.remove('open');
    }

    function setModalPillar(pillar) {
      modalActivePillar = pillar;
      ['all', 'app', 'browser', 'docker', 'db'].forEach(p => {
        const btn = document.getElementById('pillar-tab-' + p);
        if (btn) {
          btn.className = p === pillar ? 'astryx-btn btn-primary' : 'astryx-btn btn-outline';
          btn.style.padding = '0.2rem 0.5rem';
          btn.style.fontSize = '0.72rem';
        }
      });
      loadModalLogs();
    }

    async function loadModalLogs() {
      if (!currentAppLogService) return;
      const term = document.getElementById('app-logs-terminal');
      if (!term) return;
      term.innerHTML = '<div style="color:var(--forge-text-muted);">Loading ' + modalActivePillar + ' logs for ' + currentAppLogService + '...</div>';

      try {
        let url = apiBase + '/api/logs/recent?service=' + currentAppLogService + '&limit=150';
        if (modalActivePillar !== 'all') url += '&source=' + modalActivePillar;
        const res = await fetch(url).then(r => r.json());
        term.innerHTML = '';
        if (res.logs && res.logs.length) {
          appLogBuffer = res.logs;
          res.logs.forEach(l => renderSingleRowToDOM(term, l));
        } else {
          term.innerHTML = '<div style="color:var(--forge-text-muted); padding:0.5rem;">Zero ' + modalActivePillar + ' logs recorded for ' + currentAppLogService + ' yet.</div>';
        }
      } catch (err) {}
    }

    function appendAppLogModalLine(l) {
      if (!currentAppLogService || l.service !== currentAppLogService) return;
      if (modalActivePillar !== 'all' && (l.source || 'app') !== modalActivePillar) return;
      const term = document.getElementById('app-logs-terminal');
      if (term) renderSingleRowToDOM(term, l);
    }

    function filterAppLogs(term) {
      const el = document.getElementById('app-logs-terminal');
      if (!el) return;
      el.innerHTML = '';
      const list = !term ? appLogBuffer : appLogBuffer.filter(l => (l.message || '').toLowerCase().includes(term.toLowerCase()));
      list.forEach(l => renderSingleRowToDOM(el, l));
    }

    function clearAppLogs() {
      appLogBuffer = [];
      const term = document.getElementById('app-logs-terminal');
      if (term) term.innerHTML = '';
    }

    function clearLogs() {
      const o = document.getElementById('overview-terminal');
      const f = document.getElementById('full-terminal');
      if (o) o.innerHTML = '';
      if (f) f.innerHTML = '';
    }

    function openHelpModal() { document.getElementById('help-modal')?.classList.add('open'); }
    function closeHelpModal() { document.getElementById('help-modal')?.classList.remove('open'); }
  `;
}

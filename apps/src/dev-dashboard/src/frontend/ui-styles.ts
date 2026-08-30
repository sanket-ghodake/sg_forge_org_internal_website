/**
 * @forge/dev-dashboard - Supabase-Inspired Astryx Dashboard Styles (2026 LTS)
 * High-density responsive CSS styles strictly consuming Meta Astryx design tokens at 80% compact scale.
 */

import { getAstryxStyles } from '@forge/ui';

export function getDashboardStyles(): string {
  return `
    ${getAstryxStyles()}
    
    html { font-size: 13px; }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      overflow-x: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--forge-bg-root);
      margin: 0;
    }

    .sb-global-header {
      width: 100%;
      height: 46px;
      background: var(--forge-bg-surface);
      border-bottom: 1px solid var(--forge-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .sb-header-left, .sb-header-right {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .sb-mobile-menu-btn {
      display: none;
      background: transparent;
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-sm);
      color: var(--forge-text-main);
      font-size: 1.1rem;
      padding: 0.2rem 0.45rem;
      cursor: pointer;
      line-height: 1;
    }

    .sb-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1rem;
      color: var(--forge-text-main);
      text-decoration: none;
      letter-spacing: -0.02em;
    }

    .sb-body-container {
      display: grid;
      grid-template-columns: 210px 1fr;
      flex: 1;
      min-height: calc(100vh - 46px);
      background: var(--forge-bg-root);
      position: relative;
    }

    .sb-sidebar-backdrop {
      display: none;
      position: fixed;
      top: 46px;
      left: 0;
      width: 100vw;
      height: calc(100vh - 46px);
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      z-index: 45;
    }

    .sb-sidebar {
      background: var(--forge-bg-surface);
      border-right: 1px solid var(--forge-border);
      display: flex;
      flex-direction: column;
      padding: 0.85rem 0.5rem;
      position: sticky;
      top: 46px;
      height: calc(100vh - 46px);
      overflow-y: auto;
      z-index: 48;
      transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sb-nav-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.45rem 0.65rem;
      border-radius: var(--forge-radius-sm);
      color: var(--forge-text-muted);
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 500;
      margin-bottom: 0.15rem;
      cursor: pointer;
      transition: var(--forge-transition);
      border: 1px solid transparent;
      user-select: none;
    }

    .sb-nav-item:hover {
      background: var(--forge-bg-card);
      color: var(--forge-text-main);
      border-color: var(--forge-border);
    }

    .sb-nav-item.active {
      background: var(--forge-bg-card-hover);
      color: var(--forge-primary);
      border-color: var(--forge-border-medium);
      font-weight: 600;
    }

    .sb-content {
      padding: 1.25rem 1.5rem;
      max-width: 1480px;
      width: 100%;
      overflow-x: hidden;
    }

    .tab-pane { display: none; }
    .tab-pane.active {
      display: block;
      animation: fadeIn 0.15s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(2px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* 4 Golden Vitals Summary Cards */
    .vitals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .vitals-card {
      background: var(--forge-bg-card);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius);
      padding: 1rem 1.15rem;
      box-shadow: var(--forge-shadow-card);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 105px;
    }

    .vitals-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }

    .vitals-title {
      font-size: 0.76rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--forge-text-muted);
    }

    .vitals-value {
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--forge-text-main);
      display: flex;
      align-items: baseline;
      gap: 0.35rem;
      line-height: 1.2;
    }

    .vitals-subtext {
      font-size: 0.72rem;
      color: var(--forge-text-subtle);
      margin-top: 0.35rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .vitals-bar-container {
      width: 100%;
      height: 6px;
      background: var(--forge-bg-elevated);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 0.4rem;
    }

    .vitals-bar-fill {
      height: 100%;
      background: var(--forge-primary-gradient);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    /* Operational Status Badges */
    .badge-running { background: var(--forge-success-bg); color: var(--forge-success); border: 1px solid var(--forge-success); font-weight: 700; }
    .badge-stopped { background: var(--forge-bg-elevated); color: var(--forge-text-muted); border: 1px solid var(--forge-border-medium); font-weight: 700; }
    .badge-degraded { background: var(--forge-bg-elevated); color: var(--forge-accent); border: 1px solid var(--forge-accent); font-weight: 700; }
    .badge-starting { background: var(--forge-bg-elevated); color: var(--forge-primary); border: 1px solid var(--forge-primary); font-weight: 700; }

    .help-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--forge-bg-elevated);
      border: 1px solid var(--forge-border);
      color: var(--forge-text-muted);
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: var(--forge-transition);
      margin-left: 0.5rem;
    }
    .help-btn:hover { border-color: var(--forge-primary); color: var(--forge-primary); background: var(--forge-bg-card-hover); }

    /* Modal Dialog & Overlay */
    .astryx-modal-backdrop {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .astryx-modal-backdrop.open { display: flex; animation: fadeIn 0.15s ease-in-out; }
    .astryx-modal {
      background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border-medium);
      border-radius: var(--forge-radius);
      box-shadow: var(--forge-shadow-hover);
      width: 100%; max-width: 680px; max-height: 85vh;
      display: flex; flex-direction: column; overflow: hidden;
    }
    .log-modal-content { max-width: 1050px; height: 80vh; }
    .astryx-modal-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--forge-border);
      display: flex; justify-content: space-between; align-items: center;
    }
    .astryx-modal-header h3 { font-size: 1.05rem; font-weight: 700; color: var(--forge-text-main); margin: 0; }
    .astryx-modal-close {
      background: transparent; border: none; color: var(--forge-text-muted);
      font-size: 1.15rem; cursor: pointer; padding: 0.25rem 0.5rem;
      border-radius: var(--forge-radius-sm); transition: var(--forge-transition);
    }
    .astryx-modal-close:hover { background: var(--forge-bg-card-hover); color: var(--forge-text-main); }
    .astryx-modal-body { padding: 1.25rem; overflow-y: auto; font-size: 0.85rem; color: var(--forge-text-main); line-height: 1.55; }

    /* Sparkline SVG Graphs & Latency Pills */
    .sparkline-cell { display: flex; align-items: center; gap: 0.5rem; }
    .sparkline-svg { width: 84px; height: 20px; overflow: visible; }
    .latency-pill {
      font-size: 0.72rem; font-weight: 600; padding: 0.15rem 0.45rem;
      border-radius: 4px; font-family: ui-monospace, SFMono-Regular, monospace;
    }
    .latency-fast { background: var(--forge-success-bg); color: var(--forge-success); }
    .latency-medium { background: var(--forge-bg-elevated); color: var(--forge-text-muted); }
    .latency-slow { background: var(--forge-bg-elevated); color: var(--forge-accent); }

    .terminal-window {
      background: var(--forge-bg-root);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-sm);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.78rem;
      color: var(--forge-text-muted);
      padding: 0.75rem;
      height: 250px;
      overflow-y: auto;
      white-space: pre-wrap;
      line-height: 1.45;
    }

    .sql-input {
      width: 100%; height: 110px; background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm);
      color: var(--forge-text-main); font-family: ui-monospace, SFMono-Regular, monospace;
      padding: 0.75rem; font-size: 0.85rem; resize: vertical; margin-bottom: 0.65rem;
    }

    /* Table Wrapping & Responsiveness */
    .astryx-table-wrap { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: var(--forge-radius-sm); }
    .data-table { width: 100%; min-width: 650px; border-collapse: collapse; font-size: 0.82rem; margin-top: 0.5rem; }
    .data-table th {
      text-align: left; padding: 0.55rem 0.75rem; background: var(--forge-bg-elevated);
      color: var(--forge-text-muted); border-bottom: 1px solid var(--forge-border); font-weight: 600; white-space: nowrap;
    }
    .data-table td {
      padding: 0.55rem 0.75rem; border-bottom: 1px solid var(--forge-border);
      color: var(--forge-text-main); vertical-align: middle; white-space: nowrap;
    }
    .data-table tr:hover { background: var(--forge-bg-card-hover); }

    .form-input {
      padding: 0.4rem 0.65rem; background: var(--forge-bg-card);
      border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm);
      color: var(--forge-text-main); font-size: 0.82rem; outline: none;
    }
    .form-input:focus { border-color: var(--forge-primary); }

    /* Watchdog Heartbeat Pill */
    .watchdog-pill {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.65rem;
      background: var(--forge-bg-card);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
      transition: var(--forge-transition);
    }
    .watchdog-pill:hover { background: var(--forge-bg-card-hover); }
    .watchdog-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
    .watchdog-dot.live { background: var(--forge-success); box-shadow: 0 0 6px var(--forge-success); animation: pulse 2s infinite; }
    .watchdog-dot.reconnecting { background: var(--forge-accent); box-shadow: 0 0 6px var(--forge-accent); }
    .watchdog-dot.frozen { background: var(--forge-accent); box-shadow: 0 0 6px var(--forge-accent); }

    /* Plain English Insights Card */
    .plain-english-card {
      background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border-medium);
      border-left: 4px solid var(--forge-primary);
      border-radius: var(--forge-radius-sm);
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      box-shadow: var(--forge-shadow-card);
    }

    /* Structured High-Density Log Row */
    .log-row {
      padding: 0.15rem 0;
      border-bottom: 1px solid var(--forge-border);
      display: flex;
      gap: 0.45rem;
      word-break: break-all;
      line-height: 1.4;
    }
    .log-ts { color: var(--forge-text-subtle); flex-shrink: 0; }
    .log-lvl-info { color: var(--forge-primary); font-weight: 600; flex-shrink: 0; }
    .log-lvl-warn { color: var(--forge-accent); font-weight: 600; flex-shrink: 0; }
    .log-lvl-error { color: var(--forge-accent); font-weight: 700; flex-shrink: 0; }
    .log-lvl-debug { color: var(--forge-text-muted); flex-shrink: 0; }
    .log-svc { color: var(--forge-text-main); font-weight: 600; flex-shrink: 0; }
    .log-source { font-size: 0.7rem; padding: 0.05rem 0.3rem; border-radius: 3px; background: var(--forge-bg-elevated); color: var(--forge-text-muted); flex-shrink: 0; }
    .log-msg { color: var(--forge-text-muted); flex: 1; }
    .log-msg.highlight { color: var(--forge-text-main); }

    /* Responsive Mobile Breakpoint */
    @media (max-width: 900px) {
      .sb-mobile-menu-btn { display: inline-flex; }
      .sb-body-container { grid-template-columns: 1fr; }
      .sb-sidebar {
        position: fixed; left: 0; top: 46px; width: 240px;
        height: calc(100vh - 46px); transform: translateX(-100%);
        box-shadow: var(--forge-shadow-hover);
      }
      .sb-sidebar.open { transform: translateX(0); }
      .sb-sidebar-backdrop.open { display: block; }
      .sb-content { padding: 0.85rem; }
    }
  `;
}


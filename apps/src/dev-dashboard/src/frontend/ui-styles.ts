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

    /* 1. Global Top Header Bar */
    .sb-global-header {
      width: 100%;
      height: 48px;
      background: var(--forge-bg-surface);
      border-bottom: 1px solid var(--forge-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25);
    }
    .sb-header-left, .sb-header-right { display: flex; align-items: center; gap: 0.65rem; }
    .sb-header-center { display: flex; align-items: center; flex: 1; max-width: 440px; margin: 0 1rem; }

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
      transition: var(--forge-transition);
    }
    .sb-mobile-menu-btn:hover { background: var(--forge-bg-card-hover); border-color: var(--forge-border-medium); }

    .sb-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--forge-text-main);
      text-decoration: none;
      letter-spacing: -0.02em;
    }
    .sb-header-divider { width: 1px; height: 18px; background: var(--forge-border); margin: 0 0.35rem; }

    .sb-header-breadcrumb {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.2rem 0.55rem;
      background: var(--forge-bg-card);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-full);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--forge-text-muted);
    }
    .sb-header-breadcrumb .breadcrumb-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--forge-primary); box-shadow: 0 0 6px var(--forge-primary);
    }

    .sb-quick-find-bar {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.3rem 0.75rem;
      background: var(--forge-bg-card);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-full);
      cursor: pointer;
      color: var(--forge-text-muted);
      font-size: 0.76rem;
      transition: var(--forge-transition);
      user-select: none;
    }
    .sb-quick-find-bar:hover {
      border-color: var(--forge-primary);
      background: var(--forge-bg-card-hover);
      color: var(--forge-text-main);
      box-shadow: 0 0 10px -2px rgba(62, 207, 142, 0.25);
    }

    /* 2. Body Container & Left Sidebar */
    .sb-body-container {
      display: grid;
      grid-template-columns: 56px minmax(0, 1fr);
      flex: 1;
      min-height: calc(100vh - 48px);
      background: var(--forge-bg-root);
      position: relative;
    }

    .sb-sidebar-backdrop {
      display: none;
      position: fixed;
      top: 48px; left: 0;
      width: 100vw; height: calc(100vh - 48px);
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      z-index: 45;
    }

    .sb-sidebar {
      background: var(--forge-bg-surface);
      border-right: 1px solid var(--forge-border);
      display: flex;
      flex-direction: column;
      padding: 8px 4px;
      position: sticky;
      top: 48px; left: 0;
      width: 56px;
      height: calc(100vh - 48px);
      overflow-x: hidden;
      overflow-y: auto;
      z-index: 50;
      transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .sb-sidebar:hover, .sb-sidebar:focus-within {
      width: 192px;
      box-shadow: var(--forge-shadow-hover);
      border-color: var(--forge-border-medium);
      background: var(--forge-bg-surface);
    }

    .sb-nav-section-label {
      font-size: 0.62rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--forge-text-subtle);
      padding: 0.55rem 0.5rem 0.2rem;
      white-space: nowrap;
      opacity: 0;
      transform: translateX(-4px);
      transition: opacity 0.15s ease, transform 0.15s ease;
      user-select: none;
    }
    .sb-sidebar:hover .sb-nav-section-label,
    .sb-sidebar:focus-within .sb-nav-section-label { opacity: 1; transform: translateX(0); }

    .sb-nav-item {
      display: flex;
      align-items: center;
      height: 36px;
      padding: 0 8px;
      border-radius: var(--forge-radius-sm);
      color: var(--forge-text-muted);
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 500;
      margin-bottom: 2px;
      cursor: pointer;
      transition: var(--forge-transition);
      border: 1px solid transparent;
      user-select: none;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
      outline: none;
    }
    .sb-nav-item:hover { background: var(--forge-bg-card); color: var(--forge-text-main); border-color: var(--forge-border); }
    .sb-nav-item:focus-visible { box-shadow: 0 0 0 2px var(--forge-primary); }
    .sb-nav-item.active {
      background: var(--forge-bg-card-hover);
      color: var(--forge-primary);
      border-color: var(--forge-border-medium);
      font-weight: 600;
      box-shadow: inset 0 0 12px rgba(62, 207, 142, 0.08);
    }
    .sb-nav-item.active::before {
      content: '';
      position: absolute;
      left: 2px; top: 6px; bottom: 6px; width: 3px;
      border-radius: var(--forge-radius-full);
      background: var(--forge-primary);
      box-shadow: 0 0 6px var(--forge-primary);
    }

    .sb-nav-icon {
      min-width: 24px; width: 24px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-right: 8px; text-align: center;
      color: var(--forge-text-muted);
      transition: color 0.15s ease;
    }
    .sb-nav-icon svg {
      width: 15px; height: 15px;
      stroke: currentColor;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .sb-nav-item:hover .sb-nav-icon {
      color: var(--forge-text-main);
    }
    .sb-nav-item.active .sb-nav-icon {
      color: var(--forge-primary);
    }
    .sb-nav-label {
      opacity: 0; transform: translateX(-4px);
      transition: opacity 0.15s ease, transform 0.15s ease;
      flex: 1; overflow: hidden; text-overflow: ellipsis;
      letter-spacing: -0.01em;
    }
    .sb-hotkey-badge {
      opacity: 0; transform: translateX(-4px);
      transition: opacity 0.15s ease, transform 0.15s ease;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 0.65rem; padding: 1px 4px; border-radius: 3px;
      background: var(--forge-bg-elevated); color: var(--forge-text-subtle);
      border: 1px solid var(--forge-border); margin-left: auto; flex-shrink: 0;
    }
    .sb-sidebar:hover .sb-nav-label, .sb-sidebar:focus-within .sb-nav-label,
    .sb-sidebar:hover .sb-hotkey-badge, .sb-sidebar:focus-within .sb-hotkey-badge { opacity: 1; transform: translateX(0); }

    .sb-sidebar-footer {
      margin-top: auto; padding: 0.5rem 0.25rem 0.25rem;
      border-top: 1px solid var(--forge-border);
      display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .sb-footer-pill {
      display: flex; align-items: center; gap: 0.35rem;
      font-size: 0.68rem; color: var(--forge-text-subtle); white-space: nowrap;
      opacity: 0; transition: opacity 0.15s ease;
    }
    .sb-sidebar:hover .sb-footer-pill, .sb-sidebar:focus-within .sb-footer-pill { opacity: 1; }

    .sb-content { padding: 1.25rem 1.5rem; max-width: 1480px; width: 100%; overflow-x: hidden; }
    .tab-pane { display: none; }
    .tab-pane.active { display: block; animation: fadeIn 0.15s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }

    /* 4 Golden Vitals Summary Cards */
    .vitals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 1rem; margin-bottom: 1.25rem; }
    .vitals-card {
      background: var(--forge-bg-card); border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius); padding: 1rem 1.15rem;
      box-shadow: var(--forge-shadow-card); display: flex; flex-direction: column;
      justify-content: space-between; min-height: 105px;
    }
    .vitals-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; }
    .vitals-title { font-size: 0.76rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--forge-text-muted); }
    .vitals-value { font-size: 1.45rem; font-weight: 700; color: var(--forge-text-main); display: flex; align-items: baseline; gap: 0.35rem; line-height: 1.2; }
    .vitals-subtext { font-size: 0.72rem; color: var(--forge-text-subtle); margin-top: 0.35rem; display: flex; align-items: center; justify-content: space-between; }
    .vitals-bar-container { width: 100%; height: 6px; background: var(--forge-bg-elevated); border-radius: 3px; overflow: hidden; margin-top: 0.4rem; }
    .vitals-bar-fill { height: 100%; background: var(--forge-primary-gradient); border-radius: 3px; transition: width 0.3s ease; }

    /* Status Badges */
    .badge-running { background: var(--forge-success-bg); color: var(--forge-success); border: 1px solid var(--forge-success); font-weight: 700; }
    .badge-stopped { background: var(--forge-bg-elevated); color: var(--forge-text-muted); border: 1px solid var(--forge-border-medium); font-weight: 700; }
    .badge-degraded { background: var(--forge-bg-elevated); color: var(--forge-accent); border: 1px solid var(--forge-accent); font-weight: 700; }
    .badge-starting { background: var(--forge-bg-elevated); color: var(--forge-primary); border: 1px solid var(--forge-primary); font-weight: 700; }

    .help-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 22px; height: 22px; border-radius: 50%; background: var(--forge-bg-elevated);
      border: 1px solid var(--forge-border); color: var(--forge-text-muted);
      font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: var(--forge-transition); margin-left: 0.5rem;
    }
    .help-btn:hover { border-color: var(--forge-primary); color: var(--forge-primary); background: var(--forge-bg-card-hover); }

    /* Modal Dialog & Overlay */
    .astryx-modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      z-index: 1000; display: none; align-items: center; justify-content: center; padding: 1rem;
    }
    .astryx-modal-backdrop.open { display: flex; animation: fadeIn 0.15s ease-in-out; }
    .astryx-modal {
      background: var(--forge-bg-surface); border: 1px solid var(--forge-border-medium);
      border-radius: var(--forge-radius); box-shadow: var(--forge-shadow-hover);
      width: 100%; max-width: 680px; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden;
    }
    .log-modal-content { max-width: 1050px; height: 80vh; }
    .astryx-modal-header {
      padding: 1rem 1.25rem; border-bottom: 1px solid var(--forge-border);
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
    .latency-pill { font-size: 0.72rem; font-weight: 600; padding: 0.15rem 0.45rem; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, monospace; }
    .latency-fast { background: var(--forge-success-bg); color: var(--forge-success); }
    .latency-medium { background: var(--forge-bg-elevated); color: var(--forge-text-muted); }
    .latency-slow { background: var(--forge-bg-elevated); color: var(--forge-accent); }

    .terminal-window {
      background: var(--forge-bg-root); border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-sm); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.78rem; color: var(--forge-text-muted); padding: 0.75rem;
      height: 250px; overflow-y: auto; white-space: pre-wrap; line-height: 1.45;
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
      transition: var(--forge-transition);
    }
    select.form-input {
      padding-right: 2rem;
      cursor: pointer;
    }
    .form-input:focus { border-color: var(--forge-primary); box-shadow: 0 0 0 2px rgba(62, 207, 142, 0.2); }

    /* Watchdog Heartbeat Pill */
    .watchdog-pill {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.25rem 0.65rem; background: var(--forge-bg-card);
      border: 1px solid var(--forge-border); border-radius: var(--forge-radius-full);
      font-size: 0.75rem; font-weight: 600; cursor: pointer; user-select: none;
      transition: var(--forge-transition);
    }
    .watchdog-pill:hover { background: var(--forge-bg-card-hover); }
    .watchdog-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
    .watchdog-dot.live { background: var(--forge-success); box-shadow: 0 0 6px var(--forge-success); animation: pulse 2s infinite; }
    .watchdog-dot.reconnecting { background: var(--forge-accent); box-shadow: 0 0 6px var(--forge-accent); }
    .watchdog-dot.frozen { background: var(--forge-accent); box-shadow: 0 0 6px var(--forge-accent); }

    /* Plain English Insights Card */
    .plain-english-card {
      background: var(--forge-bg-surface); border: 1px solid var(--forge-border-medium);
      border-left: 4px solid var(--forge-primary); border-radius: var(--forge-radius-sm);
      padding: 0.75rem 1rem; margin-bottom: 1rem; box-shadow: var(--forge-shadow-card);
    }

    /* Structured High-Density Log Row & Trace Tags */
    .log-row { padding: 0.15rem 0; border-bottom: 1px solid var(--forge-border); display: flex; gap: 0.45rem; word-break: break-all; line-height: 1.4; }
    .log-ts { color: var(--forge-text-subtle); flex-shrink: 0; }
    .log-lvl-info { color: var(--forge-primary); font-weight: 600; flex-shrink: 0; }
    .log-lvl-warn { color: var(--forge-accent); font-weight: 600; flex-shrink: 0; }
    .log-lvl-error { color: var(--forge-accent); font-weight: 700; flex-shrink: 0; }
    .log-lvl-debug { color: var(--forge-text-muted); flex-shrink: 0; }
    .log-svc { color: var(--forge-text-main); font-weight: 600; flex-shrink: 0; }
    .log-source { font-size: 0.7rem; padding: 0.05rem 0.3rem; border-radius: 3px; background: var(--forge-bg-elevated); color: var(--forge-text-muted); flex-shrink: 0; }
    .log-trace-tag { font-size: 0.68rem; padding: 0.05rem 0.25rem; border-radius: 3px; background: rgba(62, 207, 142, 0.15); color: var(--forge-primary); cursor: pointer; }
    .log-msg { color: var(--forge-text-muted); flex: 1; }
    .log-msg.highlight { color: var(--forge-text-main); background: rgba(245, 158, 11, 0.2); }

    /* Command Palette (Cmd+K) */
    .palette-modal-backdrop { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px); z-index: 200; align-items: flex-start; justify-content: center; padding-top: 10vh; }
    .palette-modal-backdrop.open { display: flex; }
    .palette-box { width: 90%; max-width: 580px; background: var(--forge-bg-surface); border: 1px solid var(--forge-border-medium); border-radius: var(--forge-radius-md); box-shadow: var(--forge-shadow-hover); overflow: hidden; }
    .palette-input-wrap { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border-bottom: 1px solid var(--forge-border); }
    .palette-input { flex: 1; background: transparent; border: none; outline: none; color: var(--forge-text-main); font-size: 0.95rem; }
    .palette-list { max-height: 320px; overflow-y: auto; padding: 0.4rem; margin: 0; list-style: none; }
    .palette-item { display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.75rem; border-radius: var(--forge-radius-sm); cursor: pointer; color: var(--forge-text-main); font-size: 0.84rem; }
    .palette-item:hover, .palette-item.active { background: var(--forge-bg-card-hover); color: var(--forge-primary); }

    /* Table Browser & Schema Drawer */
    .schema-code-box { background: var(--forge-bg-elevated); padding: 0.75rem; border-radius: var(--forge-radius-sm); border: 1px solid var(--forge-border); font-family: monospace; font-size: 0.78rem; color: var(--forge-text-main); overflow-x: auto; white-space: pre-wrap; }

    /* Unified Database Studio Layout (GCP / Supabase Style) */
    .db-studio-layout { display: grid; grid-template-columns: 280px 1fr; gap: 1rem; align-items: start; }
    @media (max-width: 1024px) { .db-studio-layout { grid-template-columns: 1fr; } }
    .db-studio-sidebar { display: flex; flex-direction: column; gap: 0.75rem; }
    .db-studio-main { display: flex; flex-direction: column; gap: 0.75rem; min-width: 0; }
    .db-subtab-bar { display: flex; gap: 0.35rem; border-bottom: 1px solid var(--forge-border); padding-bottom: 0.5rem; margin-bottom: 0.75rem; }
    .db-subtab-btn { padding: 0.3rem 0.75rem; border-radius: var(--forge-radius-sm); font-size: 0.8rem; font-weight: 600; border: 1px solid var(--forge-border); background: var(--forge-bg-card); color: var(--forge-text-muted); cursor: pointer; transition: var(--forge-transition); }
    .db-subtab-btn:hover { color: var(--forge-text-main); border-color: var(--forge-border-medium); }
    .db-subtab-btn.active { background: var(--forge-bg-card-hover); color: var(--forge-primary); border-color: var(--forge-primary); box-shadow: 0 0 8px rgba(62, 207, 142, 0.15); }
    .db-table-item { display: flex; align-items: center; justify-content: space-between; padding: 0.45rem 0.65rem; border-radius: var(--forge-radius-sm); cursor: pointer; border: 1px solid transparent; transition: var(--forge-transition); font-size: 0.82rem; }
    .db-table-item:hover { background: var(--forge-bg-card-hover); border-color: var(--forge-border); }
    .db-table-item.active { background: rgba(62, 207, 142, 0.1); border-color: var(--forge-primary); color: var(--forge-primary); font-weight: 600; }

    /* 2026 Services & Processes Command Center (Option C) */
    .services-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .services-search-box { display: flex; align-items: center; gap: 0.5rem; background: var(--forge-bg-card); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-full); padding: 0.35rem 0.85rem; flex: 1; max-width: 360px; min-width: 220px; }
    .services-search-box input { background: transparent; border: none; outline: none; color: var(--forge-text-main); font-size: 0.82rem; width: 100%; -webkit-appearance: none; appearance: none; }
    .services-search-box input::-webkit-search-cancel-button,
    .services-search-box input::-webkit-search-decoration { -webkit-appearance: none; display: none; }
    .filter-chip-group { display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap; }
    .filter-chip { padding: 0.25rem 0.65rem; border-radius: var(--forge-radius-full); font-size: 0.72rem; font-weight: 600; border: 1px solid var(--forge-border); background: var(--forge-bg-card); color: var(--forge-text-muted); cursor: pointer; transition: var(--forge-transition); user-select: none; }
    .filter-chip:hover { color: var(--forge-text-main); border-color: var(--forge-border-medium); }
    .filter-chip.active { background: var(--forge-bg-card-hover); color: var(--forge-primary); border-color: var(--forge-primary); box-shadow: 0 0 8px rgba(62, 207, 142, 0.15); }
    
    .service-row-clickable { cursor: pointer; transition: background 0.15s ease; }
    .service-row-clickable:hover { background: var(--forge-bg-card-hover) !important; }
    .service-row-clickable.selected-row { background: rgba(62, 207, 142, 0.08) !important; outline: 1px solid var(--forge-primary); }
    
    /* Option C Flyout Service Inspector Drawer */
    .service-drawer-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(4px); z-index: 210; opacity: 0; pointer-events: none; transition: opacity 0.22s ease; }
    .service-drawer-backdrop.open { opacity: 1; pointer-events: auto; }
    .service-drawer { position: fixed; top: 0; right: 0; width: min(94vw, 540px); height: 100vh; background: var(--forge-bg-surface); border-left: 1px solid var(--forge-border-medium); box-shadow: -12px 0 40px rgba(0, 0, 0, 0.55); transform: translateX(100%); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); z-index: 220; display: flex; flex-direction: column; overflow: hidden; }
    .service-drawer.open { transform: translateX(0); }
    .drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--forge-border); background: var(--forge-bg-card); flex-shrink: 0; }
    .drawer-body { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
    .drawer-card { background: var(--forge-bg-card); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 1rem; }
    .drawer-card-title { font-size: 0.85rem; font-weight: 700; color: var(--forge-text-main); margin-bottom: 0.65rem; display: flex; align-items: center; justify-content: space-between; }
    .drawer-probe-result { font-family: monospace; font-size: 0.74rem; background: var(--forge-bg-elevated); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 0.65rem; max-height: 160px; overflow-y: auto; white-space: pre-wrap; color: var(--forge-text-main); }
    .drawer-log-list { font-family: monospace; font-size: 0.72rem; background: var(--forge-bg-elevated); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 0.5rem; max-height: 180px; overflow-y: auto; }

    /* Responsive Mobile Breakpoint */
    @media (max-width: 900px) {
      .sb-mobile-menu-btn { display: inline-flex; }
      .sb-header-center { display: none; }
      .sb-body-container { grid-template-columns: 1fr; }
      .sb-sidebar { position: fixed; left: 0; top: 48px; width: 192px; height: calc(100vh - 48px); transform: translateX(-100%); box-shadow: var(--forge-shadow-hover); }
      .sb-sidebar .sb-nav-label, .sb-sidebar .sb-hotkey-badge, .sb-sidebar .sb-nav-section-label, .sb-sidebar .sb-footer-pill { opacity: 1; transform: none; }
      .sb-sidebar.open { transform: translateX(0); }
      .sb-sidebar-backdrop.open { display: block; }
      .sb-content { padding: 0.85rem; }
    }
  `;
}

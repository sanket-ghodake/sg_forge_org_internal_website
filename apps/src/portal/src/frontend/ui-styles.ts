/**
 * @forge/portal - Meta Astryx Frontend Styles (2026 LTS)
 * 100% Astryx Token Compliant: SPA Layout, Canvas, Apps Hub, Directory, Admin Suite, Slim Scrollbars & Modals.
 */

export function getPortalCustomStyles(): string {
  return `
    :root {
      --portal-sidebar-width: 56px;
      --portal-sidebar-expanded-width: 224px;
      --portal-header-height: 48px;
    }

    body {
      background-color: var(--forge-bg-root);
      color: var(--forge-text-main);
      overflow-x: hidden;
      margin: 0;
      padding: 0;
      font-family: var(--forge-font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    /* ── Custom Meta Astryx Slim Scrollbars ── */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--forge-border-medium); border-radius: var(--forge-radius-full); }
    ::-webkit-scrollbar-thumb:hover { background: var(--forge-primary); }

    /* ── App Shell (SPA Container) ── */
    .portal-app-shell { display: flex; flex-direction: column; height: 100vh; width: 100vw; overflow: hidden; }
    .portal-main-body { display: grid; grid-template-columns: var(--portal-sidebar-width) minmax(0, 1fr); flex: 1; height: calc(100vh - var(--portal-header-height)); overflow: hidden; position: relative; }

    /* ── Top Header Bar ── */
    .portal-header {
      height: var(--portal-header-height);
      background: var(--forge-bg-surface);
      border-bottom: 1px solid var(--forge-border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 1rem; z-index: 40; flex-shrink: 0; box-sizing: border-box; backdrop-filter: blur(8px);
    }
    .portal-header-left { display: flex; align-items: center; gap: 0.75rem; }
    .portal-brand { display: flex; align-items: center; gap: 0.55rem; text-decoration: none; user-select: none; }
    .portal-app-tag {
      display: inline-flex; align-items: center;
      font-size: 0.76rem; font-weight: 600; letter-spacing: 0.03em;
      color: var(--forge-text-main); background: var(--forge-bg-card);
      border: 1px solid var(--forge-border); padding: 0.18rem 0.52rem;
      border-radius: 5px; transition: var(--forge-transition);
    }
    .portal-header-divider { width: 1px; height: 16px; background: var(--forge-border); }

    .portal-search-trigger {
      display: inline-flex; align-items: center; gap: 0.6rem;
      height: 32px; padding: 0 0.75rem; background: var(--forge-bg-card);
      border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm);
      color: var(--forge-text-muted); font-size: 0.78rem; cursor: pointer;
      transition: var(--forge-transition); min-width: 210px; user-select: none; box-sizing: border-box;
    }
    .portal-search-trigger:hover { border-color: var(--forge-border-medium); color: var(--forge-text-main); background: var(--forge-bg-card-hover); }
    .portal-kbd { font-size: 0.68rem; padding: 0.12rem 0.4rem; background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: 4px; color: var(--forge-text-subtle); margin-left: auto; font-family: var(--forge-font-mono, monospace); }
    .portal-header-right { display: flex; align-items: center; }

    /* ── Right-Side Minimal Icon-Only Profile Trigger ── */
    .user-profile-trigger {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 0; width: 32px; height: 32px; border-radius: 50%;
      background: transparent; border: 2px solid transparent; cursor: pointer;
      transition: var(--forge-transition); user-select: none; outline: none; box-sizing: border-box;
    }
    .user-profile-trigger:hover, .user-profile-trigger.active {
      border-color: var(--forge-primary); box-shadow: 0 0 10px -2px var(--forge-primary); transform: scale(1.05);
    }
    .user-avatar-initial {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--forge-primary); color: var(--forge-bg-root);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.82rem; font-weight: 700; flex-shrink: 0;
    }

    /* ── Modern Top-Right Dropdown Popover ── */
    .user-dropdown-popover {
      display: none; position: absolute; right: 0; top: calc(100% + 8px);
      width: min(270px, calc(100vw - 1.5rem)); background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border-medium);
      border-radius: var(--forge-radius); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08);
      padding: 0.5rem; box-sizing: border-box; z-index: 1200; backdrop-filter: blur(20px) saturate(180%);
    }
    .user-dropdown-popover.active { display: block; animation: popoverFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1); }

    @keyframes popoverFadeIn {
      from { opacity: 0; transform: translateY(-4px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .popover-user-card { display: flex; align-items: center; gap: 0.6rem; padding: 0.4rem 0.5rem; }
    .popover-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: var(--forge-primary); color: var(--forge-bg-root);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.95rem; font-weight: 700; flex-shrink: 0;
    }
    .popover-user-info { display: flex; flex-direction: column; overflow: hidden; text-align: left; }
    .popover-name { font-size: 0.84rem; font-weight: 700; color: var(--forge-text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .popover-email { font-size: 0.72rem; color: var(--forge-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 0.2rem; }
    .popover-role-badge {
      display: inline-flex; align-items: center; gap: 0.3rem;
      font-size: 0.66rem; font-weight: 600; color: var(--forge-primary);
      background: var(--forge-success-bg); padding: 0.1rem 0.45rem;
      border-radius: var(--forge-radius-full); width: fit-content;
    }
    .popover-divider { height: 1px; background: var(--forge-border); margin: 0.35rem 0; }
    .popover-section-label { font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--forge-text-subtle); padding: 0.35rem 0.5rem 0.15rem; }

    .popover-item {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      padding: 0.45rem 0.55rem; border-radius: var(--forge-radius-sm); border: 1px solid transparent;
      background: transparent; color: var(--forge-text-main); font-size: 0.8rem; font-weight: 500;
      cursor: pointer; transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
      box-sizing: border-box; outline: none; user-select: none;
    }
    .popover-item:hover { background: rgba(62, 207, 142, 0.12); color: var(--forge-primary); border-color: var(--forge-border); }
    .popover-badge-pill { font-size: 0.65rem; font-weight: 600; padding: 0.1rem 0.45rem; border-radius: var(--forge-radius-full); background: var(--forge-bg-card); border: 1px solid var(--forge-border); color: var(--forge-text-muted); }
    .popover-logout-btn:hover { color: var(--forge-primary); background: rgba(62, 207, 142, 0.12); }

    /* ── Clean Auto-Collapsible Sidebar ── */
    .portal-sidebar {
      background: var(--forge-bg-surface); border-right: 1px solid var(--forge-border);
      display: flex; flex-direction: column; padding: 6px 4px;
      width: var(--portal-sidebar-width); height: calc(100vh - var(--portal-header-height));
      overflow-x: hidden; overflow-y: auto; z-index: 30; box-sizing: border-box;
      position: absolute; top: 0; left: 0; backdrop-filter: blur(12px);
      transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .portal-sidebar:hover, .portal-sidebar:focus-within {
      width: var(--portal-sidebar-expanded-width); box-shadow: var(--forge-shadow-hover);
      border-color: var(--forge-border-medium); background: var(--forge-bg-surface);
    }
    .portal-sidebar-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .portal-nav-section-label {
      font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--forge-text-subtle); padding: 0 0.6rem; max-height: 0; margin: 0; overflow: hidden;
      white-space: nowrap; opacity: 0; transform: translateX(-4px);
      transition: max-height 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease, padding 0.2s ease, transform 0.15s ease;
      user-select: none;
    }
    .portal-sidebar:hover .portal-nav-section-label, .portal-sidebar:focus-within .portal-nav-section-label {
      max-height: 28px; padding: 0.55rem 0.6rem 0.25rem; opacity: 1; transform: translateX(0);
    }
    .portal-nav-divider { height: 1px; background: linear-gradient(90deg, var(--forge-border), transparent); margin: 0.35rem 0.35rem 0.25rem 0.35rem; }

    .portal-nav-item {
      display: flex; align-items: center; height: 36px; padding: 0 8px;
      border-radius: var(--forge-radius-sm); color: var(--forge-text-muted);
      text-decoration: none; font-size: 0.82rem; font-weight: 500; margin-bottom: 2px;
      cursor: pointer; transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
      border: 1px solid transparent; user-select: none; white-space: nowrap; overflow: hidden;
      position: relative; background: transparent; width: 100%; box-sizing: border-box; outline: none;
    }
    .portal-nav-item:hover { background: var(--forge-bg-card); color: var(--forge-text-main); border-color: var(--forge-border); transform: translateX(2px); }
    .portal-nav-item:focus-visible { box-shadow: 0 0 0 2px var(--forge-primary); }
    .portal-nav-item.active {
      background: var(--forge-bg-card-hover); color: var(--forge-primary);
      border-color: var(--forge-border-medium); font-weight: 600;
      box-shadow: inset 0 0 12px var(--forge-success-bg); transform: translateX(2px);
    }
    .portal-nav-item.active::before {
      content: ''; position: absolute; left: 2px; top: 6px; bottom: 6px; width: 3px;
      border-radius: var(--forge-radius-full); background: var(--forge-primary); box-shadow: 0 0 8px var(--forge-primary);
    }
    .portal-nav-icon {
      min-width: 24px; width: 24px; height: 24px; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0; margin-right: 8px; color: var(--forge-text-muted); transition: color 0.15s ease;
    }
    .portal-nav-item:hover .portal-nav-icon, .portal-nav-item.active .portal-nav-icon { color: var(--forge-primary); }
    .portal-nav-label {
      opacity: 0; transform: translateX(-4px); transition: opacity 0.15s ease, transform 0.15s ease;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.81rem; letter-spacing: -0.01em;
    }
    .portal-sidebar:hover .portal-nav-label, .portal-sidebar:focus-within .portal-nav-label { opacity: 1; transform: translateX(0); }
    .portal-nav-badge {
      margin-left: auto; font-size: 0.64rem; font-weight: 600; padding: 0.1rem 0.45rem;
      border-radius: var(--forge-radius-full); background: var(--forge-bg-card);
      border: 1px solid var(--forge-border); color: var(--forge-text-muted); opacity: 0; transition: opacity 0.15s ease;
    }
    .portal-sidebar:hover .portal-nav-badge, .portal-sidebar:focus-within .portal-nav-badge { opacity: 1; }

    /* ── Content Viewport (SPA View Container) ── */
    .portal-viewport {
      grid-column: 2; height: calc(100vh - var(--portal-header-height));
      overflow-y: auto; background: var(--forge-bg-root); padding: 1.5rem 2rem; box-sizing: border-box;
    }
    .portal-page-view { display: none; animation: viewFadeIn 0.18s ease-in-out; }
    .portal-page-view.active { display: block; }

    @keyframes viewFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Pre-Hydration Zero-Flicker instant match (Before JS executes) */
    html[data-active-view="canvas"] #view-canvas,
    html[data-active-view="apps"] #view-apps,
    html[data-active-view="directory"] #view-directory,
    html[data-active-view="profile"] #view-profile,
    html[data-active-view="notifications"] #view-notifications,
    html[data-active-view="admin-members"] #view-admin-members,
    html[data-active-view="admin-apps"] #view-admin-apps,
    html[data-active-view="admin-org"] #view-admin-org,
    html[data-active-view="admin-audit"] #view-admin-audit,
    html[data-active-view="admin-settings"] #view-admin-settings {
      display: block !important;
    }

    /* ── Common View Headers ── */
    .portal-view-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;
    }
    .portal-view-badge {
      display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.72rem;
      font-weight: 600; color: var(--forge-primary); background: var(--forge-success-bg);
      padding: 0.15rem 0.55rem; border-radius: var(--forge-radius-full); margin-bottom: 0.35rem;
    }
    .portal-view-title { margin: 0; font-size: 1.35rem; font-weight: 700; color: var(--forge-text-main); letter-spacing: -0.02em; }
    .portal-view-desc { margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--forge-text-muted); max-width: 720px; line-height: 1.45; }
    .portal-view-actions { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }

    /* ── Status Indicators ── */
    .status-indicator { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
    .status-online { background: var(--forge-primary); box-shadow: 0 0 6px var(--forge-primary); }
    .status-busy { background: var(--forge-warning); }
    .status-away { background: var(--forge-text-muted); }
    .status-offline { background: var(--forge-border-medium); }

    /* ── Canvas Frame & Progressive Map Styles ── */
    .canvas-viewport-frame {
      width: 100%; height: 600px; background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border); border-radius: var(--forge-radius);
      position: relative; overflow: auto; margin-top: 1rem;
      background-image: radial-gradient(var(--forge-border) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .canvas-pan-surface { min-width: 1800px; min-height: 1000px; position: relative; transform-origin: 0 0; transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1); }
    .canvas-zoom-controls { display: flex; align-items: center; gap: 0.35rem; background: var(--forge-bg-card); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 2px 4px; }
    .canvas-zoom-level { font-size: 0.76rem; font-family: var(--forge-font-mono, monospace); color: var(--forge-text-muted); min-width: 40px; text-align: center; }
    .canvas-depth-selector .depth-btn { background: transparent; border: none; font-size: 0.72rem; color: var(--forge-text-muted); padding: 0.15rem 0.45rem; border-radius: 3px; cursor: pointer; transition: var(--forge-transition); }
    .canvas-depth-selector .depth-btn:hover { color: var(--forge-text-main); }
    .canvas-depth-selector .depth-btn.active { background: var(--forge-primary); color: var(--forge-bg-root); font-weight: 700; }
    .canvas-search-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
    .canvas-search-input-wrap { display: flex; align-items: center; gap: 0.5rem; background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 0 0.65rem; height: 34px; min-width: 280px; }
    .canvas-search-input-wrap input { background: transparent; border: none; outline: none; color: var(--forge-text-main); font-size: 0.82rem; width: 100%; }
    .canvas-filter-pills { display: flex; gap: 0.35rem; flex-wrap: wrap; }
    .filter-pill { background: var(--forge-bg-card); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-full); padding: 0.2rem 0.65rem; font-size: 0.75rem; color: var(--forge-text-muted); cursor: pointer; transition: var(--forge-transition); }
    .filter-pill:hover, .filter-pill.active { background: var(--forge-primary); color: var(--forge-bg-root); font-weight: 600; border-color: var(--forge-primary); }

    .canvas-nodes-layer { position: absolute; inset: 0; width: 100%; height: 100%; }
    .canvas-org-cluster { position: absolute; background: var(--forge-bg-card); border: 1px solid var(--forge-border); border-radius: var(--forge-radius); padding: 0.85rem; width: 270px; box-shadow: var(--forge-shadow-card); transition: opacity 0.2s ease, filter 0.2s ease, transform 0.2s ease; cursor: pointer; }
    .canvas-org-cluster:hover { border-color: var(--forge-primary); box-shadow: var(--forge-shadow-hover); }
    .canvas-org-cluster.selected-node { border-color: var(--forge-primary); box-shadow: 0 0 0 2px var(--forge-primary), var(--forge-shadow-hover); }
    .cluster-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; border-bottom: 1px solid var(--forge-border); padding-bottom: 0.35rem; }
    .cluster-badge { font-size: 0.74rem; font-weight: 700; color: var(--forge-text-main); }
    .cluster-count { font-size: 0.68rem; color: var(--forge-text-subtle); }
    .cluster-nodes { display: flex; flex-direction: column; gap: 0.4rem; }
    .org-node-card { display: flex; align-items: center; gap: 0.6rem; background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 0.45rem 0.6rem; transition: var(--forge-transition); }
    .org-node-card:hover { border-color: var(--forge-primary); transform: translateX(2px); }
    .node-lead { border-left: 3px solid var(--forge-primary); font-weight: 600; }
    .node-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--forge-primary); color: var(--forge-bg-root); display: flex; align-items: center; justify-content: center; font-size: 0.76rem; font-weight: 700; flex-shrink: 0; }
    .node-info { flex: 1; overflow: hidden; }
    .node-name { font-size: 0.8rem; color: var(--forge-text-main); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .node-role { font-size: 0.7rem; color: var(--forge-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .node-level-tag { font-size: 0.64rem; font-family: var(--forge-font-mono, monospace); color: var(--forge-text-subtle); margin-left: auto; }
    .node-expand-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.3rem; margin-top: 0.5rem; width: 100%; background: var(--forge-success-bg); border: 1px dashed var(--forge-primary); border-radius: var(--forge-radius-sm); padding: 0.25rem; font-size: 0.72rem; color: var(--forge-primary); font-weight: 600; cursor: pointer; transition: var(--forge-transition); }
    .node-expand-btn:hover { background: var(--forge-primary); color: var(--forge-bg-root); }
    .canvas-connections-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .canvas-edge-line { fill: none; stroke: var(--forge-border-medium); stroke-width: 1.5; stroke-dasharray: 4 4; transition: stroke 0.2s ease; }
    .canvas-edge-line.active { stroke: var(--forge-primary); stroke-width: 2; stroke-dasharray: none; }

    /* ── Floating Node Inspector Card ── */
    .canvas-inspector-card { position: absolute; top: 1rem; right: 1rem; width: 310px; background: var(--forge-bg-surface); border: 1px solid var(--forge-border-medium); border-radius: var(--forge-radius); box-shadow: var(--forge-shadow-hover); z-index: 20; padding: 1.25rem; animation: viewFadeIn 0.15s ease; backdrop-filter: blur(16px); }
    .inspector-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; border-bottom: 1px solid var(--forge-border); padding-bottom: 0.5rem; }
    .inspector-title { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--forge-text-muted); }
    .inspector-close { background: transparent; border: none; color: var(--forge-text-muted); font-size: 1.1rem; cursor: pointer; line-height: 1; }
    .inspector-avatar-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .inspector-emp-name { font-size: 0.95rem; font-weight: 700; color: var(--forge-text-main); }
    .inspector-emp-role { font-size: 0.76rem; color: var(--forge-text-muted); }
    .inspector-meta-list { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.78rem; border-top: 1px solid var(--forge-border); padding-top: 0.75rem; }

    /* ── Apps Hub Styles ── */
    .section-sub-title { font-size: 0.86rem; font-weight: 700; color: var(--forge-text-main); margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.4rem; }
    .pinned-apps-grid { display: flex; gap: 0.65rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
    .pinned-app-chip { display: inline-flex; align-items: center; gap: 0.55rem; background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-full); padding: 0.35rem 0.85rem; text-decoration: none; color: var(--forge-text-main); font-size: 0.8rem; font-weight: 500; transition: var(--forge-transition); }
    .pinned-app-chip:hover { border-color: var(--forge-primary); background: var(--forge-bg-card-hover); transform: translateY(-1px); }
    .apps-catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
    .app-card-item { background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: var(--forge-radius); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; transition: var(--forge-transition); box-shadow: var(--forge-shadow-card); }
    .app-card-item:hover { border-color: var(--forge-primary); background: var(--forge-bg-card-hover); transform: translateY(-2px); box-shadow: var(--forge-shadow-hover); }
    .app-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
    .app-card-brand { display: flex; align-items: center; gap: 0.65rem; }
    .app-card-icon-box { width: 40px; height: 40px; border-radius: var(--forge-radius-sm); background: var(--forge-bg-card); border: 1px solid var(--forge-border); display: flex; align-items: center; justify-content: center; color: var(--forge-primary); flex-shrink: 0; }
    .app-card-title { margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--forge-text-main); }
    .app-card-cat { font-size: 0.72rem; color: var(--forge-text-muted); }
    .app-card-desc { font-size: 0.82rem; color: var(--forge-text-muted); line-height: 1.45; margin: 0 0 1rem; flex: 1; }
    .app-card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--forge-border); padding-top: 0.75rem; }
    .app-port-tag { font-family: var(--forge-font-mono, monospace); font-size: 0.72rem; color: var(--forge-text-subtle); background: var(--forge-bg-card); padding: 0.15rem 0.45rem; border-radius: 4px; border: 1px solid var(--forge-border); }

    /* ── People Directory Styles ── */
    .directory-filter-bar { display: flex; align-items: center; gap: 1rem; background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: var(--forge-radius); padding: 0.75rem 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .filter-group { display: flex; align-items: center; gap: 0.45rem; font-size: 0.8rem; color: var(--forge-text-muted); }
    .directory-stats-label { margin-left: auto; font-size: 0.8rem; color: var(--forge-text-subtle); }
    .directory-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
    .colleague-card { background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: var(--forge-radius); padding: 1.25rem; display: flex; flex-direction: column; transition: var(--forge-transition); box-shadow: var(--forge-shadow-card); }
    .colleague-card:hover { border-color: var(--forge-border-medium); transform: translateY(-2px); box-shadow: var(--forge-shadow-hover); }
    .colleague-card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
    .colleague-avatar-wrap { position: relative; }
    .colleague-avatar { width: 42px; height: 42px; border-radius: 50%; background: var(--forge-primary); color: var(--forge-bg-root); display: flex; align-items: center; justify-content: center; font-size: 0.95rem; font-weight: 700; flex-shrink: 0; }
    .colleague-avatar-wrap .status-indicator { position: absolute; bottom: 0; right: 0; border: 2px solid var(--forge-bg-surface); }
    .colleague-meta { overflow: hidden; }
    .colleague-name { margin: 0; font-size: 0.92rem; font-weight: 700; color: var(--forge-text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .colleague-role { font-size: 0.75rem; color: var(--forge-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .colleague-dept-badge { font-size: 0.72rem; font-weight: 600; color: var(--forge-primary); background: var(--forge-success-bg); padding: 0.15rem 0.5rem; border-radius: 4px; width: fit-content; margin-bottom: 0.85rem; }
    .colleague-details-list { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.78rem; border-top: 1px solid var(--forge-border); padding-top: 0.65rem; margin-bottom: 1rem; flex: 1; }
    .detail-row { display: flex; justify-content: space-between; }
    .detail-label { color: var(--forge-text-subtle); }
    .detail-val { color: var(--forge-text-main); font-weight: 500; }
    .tz-live-clock { font-family: var(--forge-font-mono, monospace); color: var(--forge-primary); font-weight: 600; }
    .colleague-card-actions { display: flex; gap: 0.5rem; }

    /* ── Profile & Admin Table Layouts ── */
    .profile-grid-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
    .profile-card { padding: 1.5rem; }
    .profile-hero-section { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--forge-border); padding-bottom: 1.25rem; }
    .profile-hero-avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--forge-primary); color: var(--forge-bg-root); display: flex; align-items: center; justify-content: center; font-size: 1.35rem; font-weight: 700; }
    .profile-hero-name { margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--forge-text-main); }
    .profile-hero-email { font-size: 0.82rem; color: var(--forge-text-muted); margin-bottom: 0.35rem; }
    .profile-hero-badge { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; color: var(--forge-primary); background: var(--forge-success-bg); padding: 0.15rem 0.55rem; border-radius: var(--forge-radius-full); font-weight: 600; }
    .profile-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-field { display: flex; flex-direction: column; gap: 0.35rem; }
    .form-field label { font-size: 0.78rem; font-weight: 600; color: var(--forge-text-muted); }
    .iam-role-pill { display: flex; align-items: center; gap: 0.5rem; background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 0.45rem 0.65rem; margin-bottom: 0.5rem; font-size: 0.78rem; font-family: var(--forge-font-mono, monospace); color: var(--forge-text-main); }

    .astryx-table-container { background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: var(--forge-radius); overflow-x: auto; margin-top: 1rem; }
    .astryx-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem; }
    .astryx-table th { background: var(--forge-bg-card); color: var(--forge-text-muted); font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.75rem 1rem; border-bottom: 1px solid var(--forge-border); }
    .astryx-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--forge-border); color: var(--forge-text-main); vertical-align: middle; }
    .astryx-table tr:hover td { background: var(--forge-bg-card-hover); }
    .table-user-cell { display: flex; align-items: center; gap: 0.65rem; }
    .table-user-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--forge-primary); color: var(--forge-bg-root); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
    .table-user-name { font-weight: 600; color: var(--forge-text-main); }
    .table-user-email { font-size: 0.72rem; color: var(--forge-text-muted); }
    .table-dept-tag { font-weight: 600; font-size: 0.78rem; }
    .table-div-sub { font-size: 0.7rem; color: var(--forge-text-subtle); }
    .admin-table-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.75rem; }
    .table-summary-pill { font-size: 0.8rem; color: var(--forge-text-muted); }

    /* ── Modals & Backdrop Dialogs ── */
    .astryx-modal-backdrop { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(16px); z-index: 2500; align-items: center; justify-content: center; }
    .astryx-modal-backdrop.active { display: flex; animation: viewFadeIn 0.15s ease; }
    .astryx-modal-box { width: 90%; max-width: 480px; background: var(--forge-bg-surface); border: 1px solid var(--forge-border-medium); border-radius: var(--forge-radius); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8); overflow: hidden; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--forge-border); }
    .modal-title { margin: 0; font-size: 1rem; font-weight: 700; color: var(--forge-text-main); }
    .modal-close-btn { background: transparent; border: none; color: var(--forge-text-muted); cursor: pointer; font-size: 1.1rem; }
    .modal-body { padding: 1.25rem; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 0.6rem; padding: 0.85rem 1.25rem; border-top: 1px solid var(--forge-border); background: var(--forge-bg-card); }

    /* ── Command Palette (⌘K) ── */
    .portal-search-modal { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(16px); z-index: 3000; align-items: flex-start; justify-content: center; padding-top: 12vh; }
    .portal-search-modal.active { display: flex; animation: viewFadeIn 0.15s ease; }
    .portal-search-box { width: 90%; max-width: 580px; background: var(--forge-bg-surface); border: 1px solid var(--forge-border-medium); border-radius: var(--forge-radius); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8); overflow: hidden; }
    .command-palette-header { display: flex; align-items: center; gap: 0.65rem; padding: 0.85rem 1.15rem; border-bottom: 1px solid var(--forge-border); }
    .portal-search-input { flex: 1; background: transparent; border: none; outline: none; color: var(--forge-text-main); font-size: 0.95rem; }
    .command-results-list { max-height: 360px; overflow-y: auto; padding: 0.5rem; }
    .command-group-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--forge-text-subtle); padding: 0.35rem 0.65rem 0.2rem; }
    .command-item { display: flex; align-items: center; gap: 0.65rem; padding: 0.55rem 0.75rem; border-radius: var(--forge-radius-sm); cursor: pointer; color: var(--forge-text-main); font-size: 0.84rem; transition: var(--forge-transition); }
    .command-item:hover, .command-item.selected { background: var(--forge-bg-card-hover); color: var(--forge-primary); }
    .cmd-shortcut { margin-left: auto; font-size: 0.72rem; color: var(--forge-text-subtle); font-family: var(--forge-font-mono, monospace); }

    /* ── Comprehensive Responsive Viewport Rules (Down to 320px) ── */
    @media (max-width: 992px) {
      .profile-grid-layout { grid-template-columns: 1fr; }
      .portal-viewport { padding: 1.25rem 1.5rem; }
    }

    @media (max-width: 768px) {
      .portal-viewport { padding: 1rem 0.85rem; }
      .portal-view-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
      .portal-view-actions { width: 100%; justify-content: space-between; }
      .portal-search-trigger { min-width: unset; width: 34px; padding: 0; justify-content: center; }
      .portal-search-trigger span, .portal-search-trigger .portal-kbd { display: none; }
      .canvas-viewport-frame { height: 460px; }
      .canvas-search-input-wrap { min-width: unset; width: 100%; }
      .canvas-search-bar { flex-direction: column; align-items: stretch; gap: 0.5rem; }
      .apps-catalog-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.85rem; }
      .directory-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.85rem; }
      .directory-filter-bar { flex-direction: column; align-items: stretch; gap: 0.65rem; }
      .admin-table-controls { flex-direction: column; align-items: stretch; gap: 0.5rem; }
    }

    @media (max-width: 480px) {
      :root { --portal-sidebar-width: 44px; --portal-header-height: 48px; }
      .portal-header { padding: 0 0.5rem; }
      .portal-brand span { display: none; }
      .portal-viewport { padding: 0.75rem 0.5rem; }
      .portal-view-title { font-size: 1.15rem; }
      .user-dropdown-popover { right: 0; width: calc(100vw - 1rem); }
      .profile-form-grid { grid-template-columns: 1fr; }
      .canvas-viewport-frame { height: 380px; }
      .apps-catalog-grid { grid-template-columns: 1fr; }
      .directory-grid { grid-template-columns: 1fr; }
      .colleague-card-actions { flex-direction: column; }
      .astryx-modal-box { width: calc(100vw - 1rem); margin: 0.5rem; }
      .portal-search-box { width: calc(100vw - 1rem); margin: 0.5rem; }
    }
  `;
}

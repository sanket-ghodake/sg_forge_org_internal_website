/**
 * @forge/portal - Meta Astryx Frontend Styles (2026 LTS)
 * 100% Astryx Token Compliant: Single Page Application, Minimal Avatar Trigger & Popover.
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
    .portal-brand { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 0.92rem; color: var(--forge-text-main); text-decoration: none; letter-spacing: -0.02em; }
    .portal-header-divider { width: 1px; height: 16px; background: var(--forge-border); }

    .portal-search-trigger {
      display: inline-flex; align-items: center; gap: 0.6rem;
      height: 32px; padding: 0 0.75rem; background: var(--forge-bg-card);
      border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm);
      color: var(--forge-text-muted); font-size: 0.78rem; cursor: pointer;
      transition: var(--forge-transition); min-width: 210px; user-select: none; box-sizing: border-box;
    }
    .portal-search-trigger:hover { border-color: var(--forge-border-medium); color: var(--forge-text-main); background: var(--forge-bg-card-hover); }
    .portal-kbd { font-size: 0.68rem; padding: 0.12rem 0.4rem; background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: 4px; color: var(--forge-text-subtle); margin-left: auto; font-family: 'Geist Mono', monospace; }
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
      -webkit-backdrop-filter: blur(20px) saturate(180%);
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
    .portal-view-container { max-width: 1200px; margin: 0 auto; }
    .portal-page-view { display: none; animation: portalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
    .portal-page-view.active { display: block; }

    @keyframes portalFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ── Overview Page Cards ── */
    .page-hero-card {
      background: var(--forge-bg-surface); border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius); padding: 1.75rem; margin-bottom: 1.5rem;
      position: relative; overflow: hidden; box-shadow: var(--forge-shadow-card);
    }
    .page-hero-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--forge-primary-gradient); }

    .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 1.25rem; }
    .feature-card {
      background: var(--forge-bg-card); border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-sm); padding: 1.25rem; transition: var(--forge-transition); box-shadow: var(--forge-shadow-card);
    }
    .feature-card:hover { border-color: var(--forge-primary); background: var(--forge-bg-card-hover); transform: translateY(-2px); box-shadow: var(--forge-shadow-hover); }
    .feature-card h4 { margin: 0 0 0.5rem 0; font-size: 0.95rem; color: var(--forge-text-main); display: flex; align-items: center; gap: 0.5rem; }
    .feature-card p { margin: 0; font-size: 0.85rem; color: var(--forge-text-muted); line-height: 1.5; }

    /* ── Search Modal ── */
    .portal-search-modal {
      display: none; position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      z-index: 3000; align-items: flex-start; justify-content: center; padding-top: 12vh;
      box-sizing: border-box;
    }
    .portal-search-modal.active { display: flex; animation: searchModalFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1); }
    .portal-search-box {
      width: 90%; max-width: 580px; background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border-medium); border-radius: var(--forge-radius);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08);
      overflow: hidden; transform: scale(0.98);
      animation: searchBoxScale 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes searchModalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes searchBoxScale {
      from { transform: scale(0.95) translateY(-8px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
    .portal-search-input {
      width: 100%; padding: 1rem 1.25rem; background: transparent;
      border: none; border-bottom: 1px solid var(--forge-border);
      color: var(--forge-text-main); font-size: 0.95rem; outline: none; box-sizing: border-box;
    }

    /* ── Responsive Mobile & Tablet Rules (Down to 320px Viewport) ── */
    @media (max-width: 768px) {
      .portal-search-trigger span, .portal-search-trigger .portal-kbd { display: none; }
      .portal-search-trigger { min-width: unset; padding: 0.22rem 0.5rem; }
      .portal-viewport { padding: 1rem 0.75rem; }
      .feature-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .portal-header { padding: 0 0.5rem; }
      .portal-brand span { display: none; }
      .user-dropdown-popover { right: 0; width: calc(100vw - 1rem); }
    }
  `;
}

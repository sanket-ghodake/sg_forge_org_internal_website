/**
 * @forge/dev-dashboard - Services & Processes Styles (2026 LTS)
 * High-density toolbar, filter chips, service row states, and flyout drawer styling.
 */

export function getServicesStyles(): string {
  return `
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
    .service-drawer-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 2000; opacity: 0; pointer-events: none; transition: opacity 0.22s ease; }
    .service-drawer-backdrop.open { opacity: 1; pointer-events: auto; }
    .service-drawer { position: fixed; top: 0; right: 0; width: min(94vw, 540px); height: 100vh; background: var(--forge-bg-surface); border-left: 1px solid var(--forge-border-medium); box-shadow: -16px 0 40px rgba(0, 0, 0, 0.75); transform: translateX(100%); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); z-index: 2001; display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box; }
    .service-drawer.open { transform: translateX(0); }
    .drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--forge-border); background: var(--forge-bg-card); flex-shrink: 0; }
    .drawer-body { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; scrollbar-width: thin; scrollbar-color: var(--forge-border-medium) transparent; }
    .drawer-card { background: var(--forge-bg-card); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 1rem; }
    .drawer-card-title { font-size: 0.85rem; font-weight: 700; color: var(--forge-text-main); margin-bottom: 0.65rem; display: flex; align-items: center; justify-content: space-between; }
    .drawer-probe-result { font-family: monospace; font-size: 0.74rem; background: var(--forge-bg-elevated); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 0.65rem; max-height: 160px; overflow-y: auto; white-space: pre-wrap; color: var(--forge-text-main); scrollbar-width: thin; scrollbar-color: var(--forge-border-medium) transparent; }
  `;
}

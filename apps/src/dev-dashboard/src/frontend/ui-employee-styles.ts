/**
 * @forge/dev-dashboard - Meta Astryx Styles for Employee Studio & MS Teams Org Chart (2026 LTS)
 * Design Tokens & Glassmorphic Components compliant with Meta Astryx Standards.
 */

export function getEmployeeStyles(): string {
  return `
    /* Ultra-Premium Glassmorphic Statistics Cards */
    .emp-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.85rem; margin-top: 1rem; }
    .emp-stat-card { background: var(--forge-bg-card); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 1rem; display: flex; align-items: center; gap: 0.85rem; box-shadow: var(--forge-shadow-card); transition: var(--forge-transition); position: relative; overflow: hidden; }
    .emp-stat-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--forge-primary), var(--forge-accent)); opacity: 0.7; }
    .emp-stat-card:hover { border-color: var(--forge-border-medium); transform: translateY(-2px); box-shadow: var(--forge-shadow-hover); }
    .emp-stat-icon { width: 38px; height: 38px; border-radius: var(--forge-radius-sm); background: var(--forge-bg-elevated); border: 1px solid var(--forge-border); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; color: var(--forge-primary); }
    .emp-stat-info { display: flex; flex-direction: column; }
    .emp-stat-val { font-size: 1.35rem; font-weight: 800; color: var(--forge-text-main); line-height: 1.1; letter-spacing: -0.02em; }
    .emp-stat-lbl { font-size: 0.72rem; color: var(--forge-text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 0.2rem; }

    /* View Switcher Segmented Control */
    .view-switcher-group { display: inline-flex; background: var(--forge-bg-card); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-full); padding: 0.2rem; gap: 0.2rem; }
    .view-switch-btn { border: none; background: transparent; color: var(--forge-text-muted); font-size: 0.74rem; font-weight: 600; padding: 0.3rem 0.75rem; border-radius: var(--forge-radius-full); cursor: pointer; transition: var(--forge-transition); display: flex; align-items: center; gap: 0.35rem; }
    .view-switch-btn:hover { color: var(--forge-text-main); }
    .view-switch-btn.active { background: var(--forge-bg-surface); color: var(--forge-primary); border: 1px solid var(--forge-border); box-shadow: 0 1px 4px rgba(0,0,0,0.25); }

    /* Integrated Enterprise Table Footer */
    .emp-table-footer {
      display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 1rem;
      border-top: 1px solid var(--forge-border); background: var(--forge-bg-card); flex-wrap: wrap; gap: 0.75rem;
    }
    .emp-footer-metrics { font-size: 0.76rem; color: var(--forge-text-muted); font-weight: 500; font-family: monospace; }
    .emp-footer-center { display: flex; align-items: center; gap: 0.5rem; }
    .emp-footer-pagination { display: flex; align-items: center; gap: 0.4rem; }
    .emp-table-keyboard-hints {
      display: flex; gap: 1.25rem; font-size: 0.72rem; color: var(--forge-text-subtle);
      padding: 0.5rem 0.25rem 0; margin-top: 0.35rem; flex-wrap: wrap;
    }
    .emp-table-keyboard-hints kbd {
      font-family: monospace; font-size: 0.68rem; background: var(--forge-bg-elevated);
      border: 1px solid var(--forge-border); padding: 0.05rem 0.35rem; border-radius: 3px; color: var(--forge-text-main);
    }

    /* Floating Linear-Grade Batch Action Toolbar */
    .emp-batch-bar {
      position: fixed; bottom: 2rem; left: 50%;
      transform: translateX(-50%) translateY(160%) scale(0.96); opacity: 0; pointer-events: none;
      background: rgba(18, 20, 24, 0.88); border: 1px solid var(--forge-border-medium);
      border-radius: var(--forge-radius-full); padding: 0.45rem 0.75rem 0.45rem 1.25rem;
      display: flex; align-items: center; gap: 1rem;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);
      z-index: 900; transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .emp-batch-bar.show { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; pointer-events: auto; }
    .emp-batch-label { font-size: 0.78rem; font-weight: 700; color: var(--forge-text-main); display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
    .emp-batch-actions-group { display: flex; align-items: center; gap: 0.4rem; }
    .emp-batch-btn { padding: 0.3rem 0.65rem !important; font-size: 0.74rem !important; border-radius: var(--forge-radius-full) !important; }
    .emp-batch-close-btn {
      background: transparent; border: none; color: var(--forge-text-muted);
      cursor: pointer; font-size: 1.2rem; line-height: 1; padding: 0.2rem 0.4rem;
      border-radius: 50%; transition: color 0.15s ease;
    }
    .emp-batch-close-btn:hover { color: var(--forge-text-main); background: rgba(255,255,255,0.08); }

    /* Status Pulse Dots */
    .status-pulse-dot { width: 7px; height: 7px; border-radius: var(--forge-radius-full); display: inline-block; flex-shrink: 0; }
    .status-pulse-dot.active { background: var(--forge-success); box-shadow: 0 0 6px var(--forge-success); }
    .status-pulse-dot.invited { background: var(--forge-accent); box-shadow: 0 0 6px var(--forge-accent); }
    .status-pulse-dot.suspended { background: var(--forge-text-muted); }

    /* MS Teams-Inspired Interactive Org Chart */
    .teams-org-container { display: flex; flex-direction: column; align-items: center; width: 100%; min-height: 480px; padding: 1rem 0 2rem; position: relative; }
    .teams-org-toolbar { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; padding-bottom: 0.85rem; border-bottom: 1px solid var(--forge-border); flex-wrap: wrap; gap: 0.75rem; }
    .teams-org-breadcrumbs { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--forge-text-muted); flex-wrap: wrap; }
    .teams-breadcrumb-item { cursor: pointer; color: var(--forge-primary); font-weight: 600; transition: var(--forge-transition); }
    .teams-breadcrumb-item:hover { text-decoration: underline; }
    .teams-breadcrumb-current { color: var(--forge-text-main); font-weight: 700; }

    /* Manager Chain Node (Above Focused Hero) */
    .teams-manager-node { background: var(--forge-bg-card); border: 1px dashed var(--forge-border-medium); border-radius: var(--forge-radius-sm); padding: 0.6rem 1rem; width: 280px; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: var(--forge-transition); box-shadow: var(--forge-shadow-card); position: relative; }
    .teams-manager-node:hover { border-color: var(--forge-primary); background: var(--forge-bg-card-hover); transform: translateY(-2px); }
    .teams-connector-vertical { width: 2px; height: 24px; background: var(--forge-border-medium); margin: 0 auto; position: relative; }

    /* Focused Hero Person Card (Center of Org View) */
    .teams-hero-card { background: var(--forge-bg-surface); border: 2px solid var(--forge-primary); border-radius: var(--forge-radius-md); padding: 1.25rem 1.5rem; width: min(100%, 460px); box-shadow: 0 8px 32px rgba(62, 207, 142, 0.15), var(--forge-shadow-card); position: relative; transition: var(--forge-transition); }
    .teams-hero-header { display: flex; align-items: flex-start; gap: 1rem; }
    .teams-hero-avatar { width: 54px; height: 54px; border-radius: var(--forge-radius-full); background: linear-gradient(135deg, var(--forge-primary), var(--forge-accent)); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: var(--forge-text-main); flex-shrink: 0; box-shadow: 0 4px 14px rgba(0,0,0,0.3); border: 2px solid var(--forge-bg-surface); }
    .teams-hero-name { font-size: 1.1rem; font-weight: 800; color: var(--forge-text-main); letter-spacing: -0.01em; margin-bottom: 0.15rem; }
    .teams-hero-title { font-size: 0.84rem; color: var(--forge-text-muted); font-weight: 500; }
    .teams-hero-pills { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.65rem; }
    .teams-hero-actions { display: flex; gap: 0.5rem; margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid var(--forge-border); flex-wrap: wrap; }

    /* Direct Reports Branch & Grid */
    .teams-reports-section { width: 100%; display: flex; flex-direction: column; align-items: center; margin-top: 0.5rem; }
    .teams-branch-header { font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--forge-text-muted); background: var(--forge-bg-card); padding: 0.25rem 0.75rem; border-radius: var(--forge-radius-full); border: 1px solid var(--forge-border); margin-bottom: 1rem; }
    .teams-reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; width: 100%; max-width: 1100px; }
    .teams-report-card { background: var(--forge-bg-card); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 0.85rem 1rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.65rem; transition: var(--forge-transition); box-shadow: var(--forge-shadow-card); cursor: pointer; position: relative; }
    .teams-report-card:hover { border-color: var(--forge-primary); transform: translateY(-2px); box-shadow: var(--forge-shadow-hover); }
    .teams-report-header { display: flex; align-items: center; gap: 0.75rem; }
    .teams-report-name { font-size: 0.88rem; font-weight: 700; color: var(--forge-text-main); }
    .teams-report-title { font-size: 0.74rem; color: var(--forge-text-muted); }
    .teams-report-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; border-top: 1px solid var(--forge-border); font-size: 0.72rem; }

    /* Slide-Over Employee Detail Drawer */
    .emp-drawer-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(4px); z-index: 210; opacity: 0; pointer-events: none; transition: opacity 0.22s ease; }
    .emp-drawer-backdrop.open { opacity: 1; pointer-events: auto; }
    .emp-drawer { position: fixed; top: 0; right: 0; width: min(94vw, 560px); height: 100vh; background: var(--forge-bg-surface); border-left: 1px solid var(--forge-border-medium); box-shadow: -12px 0 40px rgba(0, 0, 0, 0.65); transform: translateX(100%); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); z-index: 220; display: flex; flex-direction: column; overflow: hidden; }
    .emp-drawer.open { transform: translateX(0); }
    .emp-drawer-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; border-bottom: 1px solid var(--forge-border); background: var(--forge-bg-card); flex-shrink: 0; }
    .emp-drawer-tabs { display: flex; border-bottom: 1px solid var(--forge-border); background: var(--forge-bg-card); padding: 0 1.25rem; gap: 0.5rem; }
    .emp-tab-btn { background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--forge-text-muted); font-size: 0.78rem; font-weight: 600; padding: 0.6rem 0.5rem; cursor: pointer; transition: var(--forge-transition); }
    .emp-tab-btn:hover { color: var(--forge-text-main); }
    .emp-tab-btn.active { color: var(--forge-primary); border-bottom-color: var(--forge-primary); }
    .emp-drawer-body { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }

    /* Avatar, Pills & Dropzone */
    .emp-avatar { width: 32px; height: 32px; border-radius: var(--forge-radius-full); background: linear-gradient(135deg, var(--forge-primary), var(--forge-accent)); color: var(--forge-text-main); font-weight: 700; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
    .emp-mgr-pill { background: var(--forge-bg-elevated); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-full); padding: 0.15rem 0.5rem; font-size: 0.72rem; color: var(--forge-text-main); cursor: pointer; transition: var(--forge-transition); }
    .emp-mgr-pill:hover { border-color: var(--forge-primary); color: var(--forge-primary); }
    .import-dropzone { border: 2px dashed var(--forge-border-medium); border-radius: var(--forge-radius-md); padding: 2.5rem 1.5rem; text-align: center; background: var(--forge-bg-card); transition: var(--forge-transition); cursor: pointer; }
    .import-dropzone:hover, .import-dropzone.dragover { border-color: var(--forge-primary); background: var(--forge-bg-card-hover); }
  `;
}

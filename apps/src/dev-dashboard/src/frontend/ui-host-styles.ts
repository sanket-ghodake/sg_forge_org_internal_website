/**
 * @forge/dev-dashboard - Host Infrastructure & Cloud Diagnostics Astryx Styles (2026 LTS)
 * High-density AWS CloudWatch / Datadog-inspired telemetry styling.
 */

export function getHostStyles(): string {
  return `
    /* ========================================================================= */
    /* 1. Host Command Header & Vitals Cockpit                                   */
    /* ========================================================================= */
    .host-header-card {
      background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border-medium);
      border-radius: var(--forge-radius);
      padding: 0.9rem 1.15rem;
      margin-bottom: 1rem;
      box-shadow: var(--forge-shadow-card);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.85rem;
      position: relative;
    }
    .host-header-card::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0; width: 4px;
      background: var(--forge-primary);
      box-shadow: 0 0 10px var(--forge-primary);
      border-top-left-radius: var(--forge-radius);
      border-bottom-left-radius: var(--forge-radius);
    }
    .host-vitals-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .host-vital-gauge-card {
      background: var(--forge-bg-card);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius);
      padding: 0.85rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 120px;
      transition: var(--forge-transition);
      box-shadow: var(--forge-shadow-card);
      position: relative;
    }
    .host-vital-gauge-card:hover {
      border-color: var(--forge-border-medium);
      background: var(--forge-bg-card-hover);
      transform: translateY(-1px);
    }
    .gauge-circle-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0.4rem 0;
    }
    .gauge-svg-wrap {
      width: 48px;
      height: 48px;
      position: relative;
    }
    .gauge-svg {
      transform: rotate(-90deg);
    }
    .gauge-bg-ring {
      fill: none;
      stroke: var(--forge-border-medium);
      stroke-width: 3.5;
    }
    .gauge-fill-ring {
      fill: none;
      stroke: var(--forge-primary);
      stroke-width: 3.5;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.5s ease-in-out;
    }

    /* ========================================================================= */
    /* 2. CPU Multi-Core Breakdown & Progress Bars                               */
    /* ========================================================================= */
    .host-section-card {
      background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border-medium);
      border-radius: var(--forge-radius);
      padding: 0.9rem 1.15rem;
      margin-bottom: 1rem;
      box-shadow: var(--forge-shadow-card);
    }
    .cores-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 0.6rem;
      margin-top: 0.65rem;
    }
    .core-item-box {
      background: var(--forge-bg-root);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-sm);
      padding: 0.5rem 0.65rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .core-bar-track {
      width: 100%;
      height: 5px;
      background: var(--forge-border);
      border-radius: 3px;
      overflow: hidden;
    }
    .core-bar-fill {
      height: 100%;
      background: var(--forge-primary);
      border-radius: 3px;
      transition: width 0.4s ease;
    }

    /* ========================================================================= */
    /* 3. Disk Storage Volume Cards                                              */
    /* ========================================================================= */
    .storage-volumes-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.85rem;
      margin-top: 0.65rem;
    }
    .storage-volume-card {
      background: var(--forge-bg-root);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-sm);
      padding: 0.75rem 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    @media (max-width: 1200px) {
      .host-vitals-grid { grid-template-columns: repeat(2, 1fr); }
      .storage-volumes-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .host-vitals-grid { grid-template-columns: 1fr; }
      .host-header-card { flex-direction: column; align-items: flex-start; }
    }
  `;
}

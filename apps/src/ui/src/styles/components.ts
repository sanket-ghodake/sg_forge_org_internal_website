/**
 * @forge/ui - UI Component Primitives & Navigation Header (2026 LTS)
 */

export function getComponentStyles(): string {
  return `
    /* Enterprise Navigation Header Bar */
    .astryx-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 2rem;
      background: var(--forge-bg-surface);
      border-bottom: 1px solid var(--forge-border);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: background-color 0.25s ease, border-color 0.25s ease;
      min-height: 52px;
    }

    .astryx-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--forge-text-main);
      text-decoration: none;
      letter-spacing: -0.02em;
      cursor: default;
      user-select: none;
      pointer-events: none;
    }

    .astryx-logo-badge {
      background: var(--forge-primary-gradient);
      color: #040711;
      padding: 0.25rem 0.65rem;
      border-radius: var(--forge-radius-sm);
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      display: inline-block;
    }

    /* Theme Toggle Button */
    .astryx-theme-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--forge-radius-sm);
      background: var(--forge-bg-card);
      border: 1px solid var(--forge-border);
      color: var(--forge-text-main);
      cursor: pointer;
      transition: var(--forge-transition);
      outline: none;
    }

    .astryx-theme-toggle:hover {
      border-color: var(--forge-primary);
      background: var(--forge-bg-card-hover);
      transform: scale(1.05);
    }

    .astryx-theme-toggle svg {
      width: 17px;
      height: 17px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* Astryx Cards & Hero Layout */
    .astryx-hero {
      text-align: center;
      padding: 3.5rem 1rem 2.5rem;
    }

    .astryx-hero h1 {
      font-size: clamp(2rem, 4vw, 3.25rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
      color: var(--forge-text-main);
    }

    .astryx-hero p {
      font-size: 1.15rem;
      color: var(--forge-text-muted);
      max-width: 680px;
      margin: 0 auto;
      font-weight: 400;
    }

    .astryx-card {
      background: var(--forge-bg-card);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-sm);
      padding: 1.25rem;
      box-shadow: var(--forge-shadow-card);
      transition: var(--forge-transition);
      position: relative;
      overflow: hidden;
    }

    .astryx-card:hover {
      border-color: var(--forge-border-medium);
      background: var(--forge-bg-card-hover);
      box-shadow: var(--forge-shadow-hover);
    }

    .astryx-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.72rem;
      font-weight: 500;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      letter-spacing: 0.02em;
    }

    .badge-online {
      background: var(--forge-success-bg);
      color: var(--forge-success);
      border: 1px solid rgba(62, 207, 142, 0.3);
    }

    .badge-pill {
      background: var(--forge-bg-elevated);
      color: var(--forge-text-muted);
      border: 1px solid var(--forge-border);
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .astryx-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.45rem 0.95rem;
      border-radius: var(--forge-radius-sm);
      font-size: 0.82rem;
      font-weight: 550;
      letter-spacing: -0.01em;
      cursor: pointer;
      text-decoration: none;
      transition: var(--forge-transition);
      border: 1px solid transparent;
      outline: none;
    }

    .btn-primary {
      background: var(--forge-primary);
      color: #000000 !important;
      font-weight: 600;
      border-color: transparent;
    }

    .btn-primary:hover {
      filter: brightness(1.08);
      box-shadow: 0 2px 12px rgba(62, 207, 142, 0.25);
    }

    .btn-outline {
      background: rgba(255, 255, 255, 0.03);
      border-color: var(--forge-border);
      color: var(--forge-text-main);
    }

    .btn-outline:hover {
      border-color: var(--forge-border-medium);
      background: rgba(255, 255, 255, 0.06);
    }

    .astryx-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .astryx-micro-pill {
      font-family: 'Geist Mono', 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      font-weight: 500;
      padding: 1px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--forge-border);
      color: var(--forge-text-muted);
      letter-spacing: 0.02em;
    }

    .astryx-code-badge {
      font-family: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;
      font-size: 0.78rem;
      background: var(--forge-bg-elevated);
      color: var(--forge-primary);
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      border: 1px solid var(--forge-border);
    }

    @media (max-width: 768px) {
      .astryx-header { padding: 0.65rem 1rem; }
      .astryx-grid { grid-template-columns: 1fr; }
      .astryx-container { padding: 1.5rem 1rem; }
      .astryx-hero { padding: 2.5rem 0.5rem 1.5rem; }
    }
  `;
}

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
      border-radius: var(--forge-radius);
      padding: 1.5rem;
      box-shadow: var(--forge-shadow-card);
      transition: var(--forge-transition);
      position: relative;
      overflow: hidden;
    }

    .astryx-card:hover {
      transform: translateY(-2px);
      border-color: var(--forge-border-medium);
      background: var(--forge-bg-card-hover);
      box-shadow: var(--forge-shadow-hover);
    }

    .astryx-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.25rem 0.65rem;
      border-radius: var(--forge-radius-full);
      letter-spacing: 0.04em;
    }

    .badge-online {
      background: var(--forge-success-bg);
      color: var(--forge-success);
      border: 1px solid var(--forge-success);
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
      box-shadow: 0 0 8px currentColor;
    }

    .astryx-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.55rem 1.2rem;
      border-radius: var(--forge-radius-sm);
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: var(--forge-transition);
      border: 1px solid transparent;
      outline: none;
    }

    .btn-primary {
      background: var(--forge-primary-gradient);
      color: #ffffff;
      box-shadow: 0 2px 10px rgba(0, 242, 254, 0.2);
    }

    [data-theme="dark"] .btn-primary {
      color: #040711;
    }

    .btn-primary:hover {
      box-shadow: 0 4px 18px rgba(0, 242, 254, 0.4);
      filter: brightness(1.05);
    }

    .btn-outline {
      background: transparent;
      border-color: var(--forge-border);
      color: var(--forge-text-main);
    }

    .btn-outline:hover {
      border-color: var(--forge-primary);
      background: rgba(0, 242, 254, 0.05);
    }

    .astryx-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .astryx-code-badge {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.8rem;
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

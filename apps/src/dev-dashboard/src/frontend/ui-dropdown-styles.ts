/**
 * @forge/dev-dashboard - Meta Astryx Custom Dropdown Styles (2026 LTS)
 * Glassmorphic custom select dropdowns with zero OS/browser defaults.
 */

export function getDropdownStyles(): string {
  return `
    /* Meta Astryx Custom Select Dropdown Engine */
    .astryx-custom-select-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      user-select: none;
      font-family: inherit;
    }
    .astryx-custom-select-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.65rem;
      background: var(--forge-bg-card);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-sm);
      padding: 0.4rem 0.85rem;
      color: var(--forge-text-main);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--forge-transition);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      white-space: nowrap;
      min-height: 32px;
      width: 100%;
    }
    .astryx-custom-select-trigger:hover, .astryx-custom-select-wrap.open .astryx-custom-select-trigger {
      border-color: var(--forge-primary);
      background: var(--forge-bg-card-hover);
      box-shadow: 0 0 10px -2px rgba(62, 207, 142, 0.25);
    }
    .astryx-custom-select-trigger:focus-visible {
      outline: none;
      border-color: var(--forge-primary);
      box-shadow: 0 0 0 2px rgba(62, 207, 142, 0.3);
    }
    .astryx-custom-select-arrow {
      width: 13px;
      height: 13px;
      color: var(--forge-primary);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .astryx-custom-select-wrap.open .astryx-custom-select-arrow {
      transform: rotate(180deg);
    }
    .astryx-custom-select-menu {
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      min-width: 100%;
      width: max-content;
      max-width: 320px;
      max-height: 260px;
      overflow-y: auto;
      background: rgba(18, 20, 26, 0.96);
      border: 1px solid var(--forge-border-medium);
      border-radius: var(--forge-radius-sm);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      padding: 0.35rem;
      z-index: 1200;
      display: none;
      flex-direction: column;
      gap: 0.15rem;
      animation: selectDropIn 0.16s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .astryx-custom-select-wrap.open .astryx-custom-select-menu {
      display: flex;
    }
    .astryx-custom-select-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.42rem 0.65rem;
      border-radius: 4px;
      font-size: 0.79rem;
      color: var(--forge-text-main);
      cursor: pointer;
      transition: background 0.12s ease, color 0.12s ease;
      white-space: nowrap;
      gap: 0.75rem;
    }
    .astryx-custom-select-item:hover {
      background: rgba(62, 207, 142, 0.12);
      color: var(--forge-primary);
    }
    .astryx-custom-select-item.selected {
      background: rgba(62, 207, 142, 0.18);
      color: var(--forge-primary);
      font-weight: 600;
    }
    .astryx-custom-select-check {
      font-size: 0.75rem;
      color: var(--forge-primary);
      font-weight: 700;
      opacity: 0;
    }
    .astryx-custom-select-item.selected .astryx-custom-select-check {
      opacity: 1;
    }
    @keyframes selectDropIn {
      from { opacity: 0; transform: translateY(-4px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
}

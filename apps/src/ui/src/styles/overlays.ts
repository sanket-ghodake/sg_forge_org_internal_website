/**
 * @forge/ui - Dropdowns, Modals, Dialogs & Toast Notifications (2026 LTS)
 */

export function getOverlayStyles(): string {
  return `
    /* Astryx Modern Select & Dropdowns (Anti-Browser OS Menus) */
    select, .astryx-select {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-color: var(--forge-bg-card);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 14px 14px;
      padding: 0.45rem 2.2rem 0.45rem 0.75rem;
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius-sm);
      color: var(--forge-text-main);
      font-size: 0.84rem;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      transition: var(--forge-transition);
    }

    select:hover, .astryx-select:hover {
      border-color: var(--forge-border-medium);
      background-color: var(--forge-bg-card-hover);
    }

    select:focus, select:focus-visible, .astryx-select:focus, .astryx-select:focus-visible {
      border-color: var(--forge-primary);
      box-shadow: 0 0 0 2px rgba(62, 207, 142, 0.25);
    }

    select option {
      background-color: var(--forge-bg-surface);
      color: var(--forge-text-main);
      padding: 0.5rem;
    }

    select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Astryx Universal Modals & Popups (Anti-Native Dialogs) */
    .astryx-modal-backdrop {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      opacity: 0;
      transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .astryx-modal-backdrop.open {
      display: flex;
      opacity: 1;
    }

    .astryx-modal {
      background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border-medium);
      border-radius: var(--forge-radius);
      box-shadow: var(--forge-shadow-hover);
      width: 100%;
      max-width: 620px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.96) translateY(8px);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .astryx-modal-backdrop.open .astryx-modal {
      transform: scale(1) translateY(0);
    }

    .astryx-modal-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--forge-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--forge-bg-card);
    }

    .astryx-modal-header h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--forge-text-main);
      margin: 0;
    }

    .astryx-modal-close {
      background: transparent;
      border: none;
      color: var(--forge-text-muted);
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: var(--forge-radius-sm);
      transition: var(--forge-transition);
    }

    .astryx-modal-close:hover {
      background: var(--forge-bg-card-hover);
      color: var(--forge-text-main);
    }

    .astryx-modal-body {
      padding: 1.25rem;
      overflow-y: auto;
      font-size: 0.88rem;
      color: var(--forge-text-main);
      line-height: 1.6;
    }

    .astryx-modal-footer {
      padding: 0.85rem 1.25rem;
      border-top: 1px solid var(--forge-border);
      background: var(--forge-bg-card);
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    /* Astryx Toast Notification System (Anti-Browser alert()) */
    .astryx-toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      max-width: 420px;
      width: calc(100vw - 3rem);
      pointer-events: none;
    }

    .astryx-toast {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      background: var(--forge-bg-surface);
      border: 1px solid var(--forge-border-medium);
      border-radius: var(--forge-radius);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      color: var(--forge-text-main);
      font-size: 0.84rem;
      line-height: 1.45;
      animation: astryxToastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transition: opacity 0.2s ease, transform 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    @keyframes astryxToastSlideIn {
      from { transform: translateY(16px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .astryx-toast-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
      line-height: 1;
      margin-top: 1px;
    }

    .astryx-toast-content {
      flex: 1;
      word-break: break-word;
    }

    .astryx-toast-close {
      background: transparent;
      border: none;
      color: var(--forge-text-muted);
      cursor: pointer;
      font-size: 1.1rem;
      line-height: 1;
      padding: 0 0.2rem;
      margin-left: auto;
      border-radius: 3px;
      transition: var(--forge-transition);
    }

    .astryx-toast-close:hover {
      color: var(--forge-text-main);
    }

    .astryx-toast-success { border-left: 4px solid var(--forge-success); }
    .astryx-toast-error { border-left: 4px solid var(--forge-accent); }
    .astryx-toast-warning { border-left: 4px solid #f59e0b; }
    .astryx-toast-info { border-left: 4px solid var(--forge-primary); }

    @media (max-width: 768px) {
      .astryx-toast-container {
        right: 1rem;
        bottom: 1rem;
        width: calc(100vw - 2rem);
      }
    }
  `;
}

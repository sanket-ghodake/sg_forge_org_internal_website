/**
 * @forge/ui - Astryx Toast Notification Client Engine (2026 LTS)
 * Lightweight zero-dependency client script injecting accessible, animated Astryx toasts.
 * Replaces native browser alert() and confirm() dialogs across the platform.
 */

export function getAstryxToastScript(): string {
  return `
    (function() {
      if (typeof window === 'undefined') return;

      function ensureToastContainer() {
        let container = document.getElementById('astryx-toast-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'astryx-toast-container';
          container.className = 'astryx-toast-container';
          container.setAttribute('aria-live', 'polite');
          container.setAttribute('aria-atomic', 'true');
          document.body.appendChild(container);
        }
        return container;
      }

      const ICON_MAP = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };

      /**
       * Dispatches an Astryx toast notification to the viewport.
       * @param {string} message Toast message text or HTML
       * @param {'success'|'error'|'warning'|'info'} [type='info'] Notification status
       * @param {number} [duration=4000] Auto-dismiss duration in ms (0 for persistent)
       */
      window.astryxToast = function(message, type = 'info', duration = 4000) {
        try {
          const container = ensureToastContainer();
          const toast = document.createElement('div');
          toast.className = 'astryx-toast astryx-toast-' + type;

          const icon = document.createElement('span');
          icon.className = 'astryx-toast-icon';
          icon.textContent = ICON_MAP[type] || 'ℹ️';

          const content = document.createElement('div');
          content.className = 'astryx-toast-content';
          content.textContent = message;

          const closeBtn = document.createElement('button');
          closeBtn.className = 'astryx-toast-close';
          closeBtn.innerHTML = '&times;';
          closeBtn.title = 'Dismiss notification';
          closeBtn.setAttribute('aria-label', 'Close');
          closeBtn.onclick = function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(12px) scale(0.95)';
            setTimeout(() => toast.remove(), 200);
          };

          toast.appendChild(icon);
          toast.appendChild(content);
          toast.appendChild(closeBtn);
          container.appendChild(toast);

          if (duration > 0) {
            setTimeout(function() {
              if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(12px) scale(0.95)';
                setTimeout(() => toast.remove(), 200);
              }
            }, duration);
          }
        } catch (e) {
          console.error('[Astryx Toast Error]', e);
        }
      };
    })();
  `;
}

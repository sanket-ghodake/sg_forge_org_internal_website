/**
 * @forge/ui - Meta Astryx Design System (v2.0.0 LTS 2026)
 * Enterprise-Grade UI Design Tokens, Accessible Theme Engine & Navigation Header
 */

export const ASTRYX_VERSION = '2.0.0';

export const themeTokens = {
  dark: {
    bgRoot: '#06090e',
    bgSurface: '#0c1017',
    bgCard: '#121824',
    bgCardHover: '#172030',
    bgElevated: '#1a2334',
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    borderMedium: 'rgba(255, 255, 255, 0.15)',
    primary: '#00f2fe',
    primaryGradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    accent: '#8b5cf6',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    textSubtle: '#64748b',
    success: '#10b981',
    successBg: 'rgba(16, 185, 129, 0.12)',
    shadowCard: '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
    shadowHover: '0 12px 32px -4px rgba(0, 0, 0, 0.7), 0 0 20px -4px rgba(0, 242, 254, 0.25)',
  },
  light: {
    bgRoot: '#f8fafc',
    bgSurface: '#ffffff',
    bgCard: '#ffffff',
    bgCardHover: '#f1f5f9',
    bgElevated: '#e2e8f0',
    borderSubtle: '#e2e8f0',
    borderMedium: '#cbd5e1',
    primary: '#0284c7',
    primaryGradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
    accent: '#7c3aed',
    textMain: '#0f172a',
    textMuted: '#475569',
    textSubtle: '#94a3b8',
    success: '#059669',
    successBg: 'rgba(5, 150, 105, 0.1)',
    shadowCard: '0 4px 16px -1px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
    shadowHover: '0 10px 25px -3px rgba(0, 0, 0, 0.12), 0 0 15px -3px rgba(2, 132, 199, 0.2)',
  },
};

/**
 * Returns complete Meta Astryx CSS stylesheet with dynamic theme custom properties.
 */
export function getAstryxStyles(): string {
  const d = themeTokens.dark;
  const l = themeTokens.light;

  return `
    :root, [data-theme="dark"] {
      --forge-bg-root: ${d.bgRoot};
      --forge-bg-surface: ${d.bgSurface};
      --forge-bg-card: ${d.bgCard};
      --forge-bg-card-hover: ${d.bgCardHover};
      --forge-bg-elevated: ${d.bgElevated};
      --forge-border: ${d.borderSubtle};
      --forge-border-medium: ${d.borderMedium};
      --forge-primary: ${d.primary};
      --forge-primary-gradient: ${d.primaryGradient};
      --forge-accent: ${d.accent};
      --forge-text-main: ${d.textMain};
      --forge-text-muted: ${d.textMuted};
      --forge-text-subtle: ${d.textSubtle};
      --forge-success: ${d.success};
      --forge-success-bg: ${d.successBg};
      --forge-shadow-card: ${d.shadowCard};
      --forge-shadow-hover: ${d.shadowHover};
      --forge-radius: 10px;
      --forge-radius-sm: 6px;
      --forge-radius-full: 9999px;
      --forge-transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    [data-theme="light"] {
      --forge-bg-root: ${l.bgRoot};
      --forge-bg-surface: ${l.bgSurface};
      --forge-bg-card: ${l.bgCard};
      --forge-bg-card-hover: ${l.bgCardHover};
      --forge-bg-elevated: ${l.bgElevated};
      --forge-border: ${l.borderSubtle};
      --forge-border-medium: ${l.borderMedium};
      --forge-primary: ${l.primary};
      --forge-primary-gradient: ${l.primaryGradient};
      --forge-accent: ${l.accent};
      --forge-text-main: ${l.textMain};
      --forge-text-muted: ${l.textMuted};
      --forge-text-subtle: ${l.textSubtle};
      --forge-success: ${l.success};
      --forge-success-bg: ${l.successBg};
      --forge-shadow-card: ${l.shadowCard};
      --forge-shadow-hover: ${l.shadowHover};
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      background-color: var(--forge-bg-root);
      color: var(--forge-text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    .astryx-container {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
    }

    /* Enterprise Navigation Header */
    .astryx-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 2rem;
      background: var(--forge-bg-surface);
      border-bottom: 1px solid var(--forge-border);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: background-color 0.25s ease, border-color 0.25s ease;
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
    }

    .astryx-logo-badge {
      background: var(--forge-primary-gradient);
      color: #040711;
      padding: 0.25rem 0.65rem;
      border-radius: var(--forge-radius-sm);
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    /* Theme Toggle Button */
    .astryx-theme-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
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
      width: 18px;
      height: 18px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* Hero Section */
    .astryx-hero {
      text-align: center;
      padding: 4rem 1rem 3rem;
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

    /* Astryx Card Primitive */
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

    /* Status Badges */
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

    /* Buttons */
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

    /* Grid Layout */
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
      .astryx-grid {
        grid-template-columns: 1fr;
      }
      .astryx-container {
        padding: 1.5rem 1rem;
      }
      .astryx-hero {
        padding: 2.5rem 0.5rem 1.5rem;
      }
    }
  `;
}

/**
 * Renders standard Meta Astryx Navigation Header with interactive Sun/Moon theme toggler.
 */
export function getAstryxHeaderHtml(badgeLabel = 'SG', title = 'FORGE PLATFORM'): string {
  return `
  <header class="astryx-header">
    <a href="/" class="astryx-logo">
      <span class="astryx-logo-badge">${badgeLabel}</span>
      <span>${title}</span>
    </a>
    <div style="display: flex; gap: 1rem; align-items: center;">
      <span class="astryx-badge badge-online">
        <span class="badge-dot"></span> Port 80/443 Gateway
      </span>
      <button class="astryx-theme-toggle" id="theme-toggle-btn" title="Toggle Light / Dark Theme" aria-label="Toggle Theme">
        <!-- Sun Icon (shown in dark mode) -->
        <svg id="sun-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <!-- Moon Icon (shown in light mode) -->
        <svg id="moon-icon" viewBox="0 0 24 24" style="display: none;">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </div>
  </header>
  <script>
    (function() {
      const savedTheme = localStorage.getItem('sg-forge-theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeIcons(savedTheme);

      const btn = document.getElementById('theme-toggle-btn');
      if (btn) {
        btn.addEventListener('click', function() {
          const current = document.documentElement.getAttribute('data-theme') || 'dark';
          const next = current === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          localStorage.setItem('sg-forge-theme', next);
          updateThemeIcons(next);
        });
      }

      function updateThemeIcons(theme) {
        const sun = document.getElementById('sun-icon');
        const moon = document.getElementById('moon-icon');
        if (sun && moon) {
          if (theme === 'dark') {
            sun.style.display = 'block';
            moon.style.display = 'none';
          } else {
            sun.style.display = 'none';
            moon.style.display = 'block';
          }
        }
      }
    })();
  </script>
  `;
}

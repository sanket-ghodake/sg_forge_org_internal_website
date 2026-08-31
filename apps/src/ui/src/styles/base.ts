/**
 * @forge/ui - Base Styles, CSS Custom Properties & Scrollbars (2026 LTS)
 */

import { themeTokens } from '../tokens';

export function getBaseStyles(): string {
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

    /* Custom Slim Astryx Scrollbars (Anti-Browser Defaults) */
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--forge-border-medium) transparent;
    }

    *::-webkit-scrollbar {
      width: 7px;
      height: 7px;
    }

    *::-webkit-scrollbar-track {
      background: transparent;
    }

    *::-webkit-scrollbar-thumb {
      background: var(--forge-border-medium);
      border-radius: var(--forge-radius-full);
      border: 2px solid transparent;
      background-clip: padding-box;
      transition: background-color 0.2s ease;
    }

    *::-webkit-scrollbar-thumb:hover {
      background: var(--forge-primary);
    }

    *::-webkit-scrollbar-corner {
      background: transparent;
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
      padding: 2rem 1.5rem;
    }
  `;
}

/**
 * @forge/ui/state - Zero Layout Shift (FOUC) Head Script Generator
 * Generates an ultra-fast, synchronous, blocking inline script for the HTML <head>.
 * Restores visual state (Theme, Sidebar status, Density) BEFORE initial layout paint.
 *
 * @module @forge/ui/state/head-script
 * @license SG-Forge-Enterprise-LTS-2026
 */

/**
 * Options for configuring the blocking <head> hydration script.
 */
export interface HeadStateScriptOptions {
  /** Default theme if none is stored in localStorage ('dark' | 'light') */
  defaultTheme?: 'dark' | 'light';
  /** Primary theme storage key */
  themeKey?: string;
  /** Sidebar collapse storage key */
  sidebarKey?: string;
}

/**
 * Returns raw JavaScript (or full <script> tag) to embed in HTML <head>
 * for instantaneous theme and layout state initialization.
 *
 * @param options - Customization options.
 * @param wrapScriptTag - If true, wraps in `<script>...</script>`. Defaults to true.
 */
export function getHeadStateScript(
  options: HeadStateScriptOptions = {},
  wrapScriptTag: boolean = true
): string {
  const defaultTheme = options.defaultTheme || 'dark';
  const themeKey = options.themeKey || 'forge:v1:platform:theme';
  const sidebarKey = options.sidebarKey || 'forge:v1:platform:sidebar-collapsed';

  const js = `(function(){
    try {
      var rawTheme = localStorage.getItem('${themeKey}') || localStorage.getItem('sg-forge-theme');
      var theme = '${defaultTheme}';
      if (rawTheme) {
        try {
          var env = JSON.parse(rawTheme);
          theme = (env && typeof env === 'object' && env.data) ? env.data : env;
        } catch(e) {
          theme = rawTheme;
        }
      }
      if (theme !== 'light' && theme !== 'dark') theme = '${defaultTheme}';
      document.documentElement.setAttribute('data-theme', theme);

      var rawSidebar = localStorage.getItem('${sidebarKey}');
      if (rawSidebar) {
        try {
          var envS = JSON.parse(rawSidebar);
          var collapsed = (envS && typeof envS === 'object' && 'data' in envS) ? envS.data : envS;
          if (collapsed === true || collapsed === 'true') {
            document.documentElement.setAttribute('data-sidebar-collapsed', 'true');
          }
        } catch(e) {}
      }
    } catch(err) {}
  })();`.replace(/\s+/g, ' ').trim();

  return wrapScriptTag ? `<script>${js}</script>` : js;
}

/**
 * @forge/portal - Universal Command Palette (⌘K) Component (2026 LTS)
 * Fast keyboard-driven quick switcher across views, colleagues, tools, and actions.
 */

export function renderCommandPalette(): string {
  return `
    <div class="portal-search-modal" id="portal-search-modal" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="portal-search-box">
        <div class="command-palette-header">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--forge-primary)" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="portal-search-input" id="portal-search-input" placeholder="Type a command, page name, or search colleague... (Esc to close)" autocomplete="off" />
          <kbd class="portal-kbd">Esc</kbd>
        </div>

        <div id="portal-search-results" class="command-results-list">
          <div class="command-group-label">Quick Navigation</div>
          <div class="command-item" data-action="nav" data-target="canvas">
            <span class="cmd-icon">🗺️</span>
            <span class="cmd-text">Company Map & Org Canvas</span>
            <span class="cmd-shortcut">Jump</span>
          </div>
          <div class="command-item" data-action="nav" data-target="apps">
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Apps & Tools Hub</span>
            <span class="cmd-shortcut">Jump</span>
          </div>
          <div class="command-item" data-action="nav" data-target="directory">
            <span class="cmd-icon">👥</span>
            <span class="cmd-text">People Directory</span>
            <span class="cmd-shortcut">Jump</span>
          </div>
          <div class="command-item" data-action="nav" data-target="notifications">
            <span class="cmd-icon">🔔</span>
            <span class="cmd-text">Announcements & Inbox</span>
            <span class="cmd-shortcut">Jump</span>
          </div>
          <div class="command-item" data-action="nav" data-target="profile">
            <span class="cmd-icon">👤</span>
            <span class="cmd-text">My Profile & Security</span>
            <span class="cmd-shortcut">Jump</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

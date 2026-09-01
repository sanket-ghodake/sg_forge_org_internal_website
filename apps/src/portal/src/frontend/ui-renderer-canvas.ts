/**
 * @forge/portal - Company Map & Org Canvas View Renderer (2026 LTS)
 * 2D Visual Map with Real Database Hierarchy, 5-Level Progressive Loading,
 * Interactive Subtree Expansion, and Semantic Zooming.
 */

export function renderCanvasView(): string {
  return `
    <div id="view-canvas" class="portal-page-view">
      <!-- Top Control Bar -->
      <div class="portal-view-header">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="portal-view-badge">
              <span class="badge-dot"></span>
              <span>Live Organization Graph</span>
            </div>
            <span class="portal-view-audience" style="font-size: 0.74rem; color: var(--forge-text-subtle);">
              Audience: <strong style="color: var(--forge-text-muted); font-weight: 500;">All Employees & Staff</strong>
            </span>
          </div>
          <h1 class="portal-view-title">Company Map & Org Canvas</h1>
          <p class="portal-view-desc">
            Visual interactive graph of company hierarchy, reporting chains, and team clusters.
            Loads 5 depth levels progressively with 1-click subtree expansion.
          </p>
        </div>

        <div class="portal-view-actions">
          <!-- Level Depth Controller -->
          <div class="canvas-depth-selector" style="display: flex; align-items: center; gap: 0.35rem; background: var(--forge-bg-card); border: 1px solid var(--forge-border); border-radius: var(--forge-radius-sm); padding: 2px 6px;">
            <span style="font-size: 0.72rem; color: var(--forge-text-muted); font-weight: 600;">Depth:</span>
            <button class="depth-btn" data-depth="3" title="Show 3 Levels">3 Lvl</button>
            <button class="depth-btn active" data-depth="5" title="Show 5 Levels (Default)">5 Lvl</button>
            <button class="depth-btn" data-depth="8" title="Show Deep Levels">All</button>
          </div>

          <!-- Zoom & Pan Controls -->
          <div class="canvas-zoom-controls">
            <button class="astryx-btn btn-sm btn-ghost" id="canvas-zoom-out" title="Zoom Out" aria-label="Zoom Out">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <span class="canvas-zoom-level" id="canvas-zoom-level">100%</span>
            <button class="astryx-btn btn-sm btn-ghost" id="canvas-zoom-in" title="Zoom In" aria-label="Zoom In">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <button class="astryx-btn btn-sm btn-outline" id="canvas-reset-btn" title="Reset Viewport">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
              <span>Reset</span>
            </button>
          </div>

          <button class="astryx-btn btn-primary" id="canvas-find-me-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>
            <span>Find My Team</span>
          </button>
        </div>
      </div>

      <!-- Canvas Search & Filter Strip -->
      <div class="canvas-search-bar">
        <div class="canvas-search-input-wrap">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="canvas-search-input" placeholder="Search team member name, role, or email..." />
        </div>
        <div class="canvas-filter-pills" id="canvas-dept-filters">
          <button class="filter-pill active" data-dept="all">All Divisions</button>
        </div>
        <div id="canvas-status-summary" style="margin-left: auto; font-size: 0.76rem; color: var(--forge-text-muted); display: flex; align-items: center; gap: 0.75rem;">
          <span id="canvas-node-count">Loading organization...</span>
        </div>
      </div>

      <!-- Interactive 2D Canvas Viewport -->
      <div class="canvas-viewport-frame" id="canvas-viewport">
        <!-- Canvas Drag & Pan Surface -->
        <div class="canvas-pan-surface" id="canvas-surface">
          <!-- Dynamic SVG Connection Lines Layer -->
          <svg class="canvas-connections-svg" id="canvas-svg-layer"></svg>

          <!-- Dynamic Hierarchical Nodes Layer -->
          <div id="canvas-nodes-container" class="canvas-nodes-layer"></div>
        </div>

        <!-- Floating Colleague Inspector Panel -->
        <div id="canvas-node-inspector" class="canvas-inspector-card" style="display: none;">
          <div class="inspector-header">
            <span class="inspector-title" id="inspector-name">Colleague Details</span>
            <button class="inspector-close" id="inspector-close-btn">&times;</button>
          </div>
          <div class="inspector-body">
            <div class="inspector-avatar-row">
              <div class="node-avatar" id="inspector-avatar" style="width: 38px; height: 38px; font-size: 0.95rem;">--</div>
              <div>
                <div class="inspector-emp-name" id="inspector-full-name">--</div>
                <div class="inspector-emp-role" id="inspector-role">--</div>
              </div>
            </div>
            <div class="inspector-meta-list">
              <div class="detail-row"><span class="detail-label">Division</span><span class="detail-val" id="inspector-division">--</span></div>
              <div class="detail-row"><span class="detail-label">Department</span><span class="detail-val" id="inspector-department">--</span></div>
              <div class="detail-row"><span class="detail-label">Work Email</span><span class="detail-val" id="inspector-email" style="font-family: var(--forge-font-mono, monospace);">--</span></div>
              <div class="detail-row"><span class="detail-label">Hierarchy Level</span><span class="detail-val" id="inspector-level">--</span></div>
              <div class="detail-row"><span class="detail-label">Direct Reports</span><span class="detail-val" id="inspector-reports">--</span></div>
            </div>
            <div class="inspector-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
              <button class="astryx-btn btn-sm btn-outline" id="inspector-focus-sub-btn" style="flex: 1;">Focus Subtree</button>
              <button class="astryx-btn btn-sm btn-primary" id="inspector-copy-email-btn" style="flex: 1;">Copy Email</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

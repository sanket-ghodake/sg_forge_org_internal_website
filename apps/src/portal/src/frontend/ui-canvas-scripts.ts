/**
 * @forge/portal - Progressive 5-Level Org Canvas Client Script (2026 LTS)
 * Dynamic SQLite hierarchy rendering, smooth bezier connections,
 * depth bounding (5-levels), on-click subtree expansion, and interactive inspector.
 */

export function getCanvasClientScript(): string {
  return `
    (function initCanvasEngine() {
      let currentZoom = 1.0;
      let currentMaxDepth = 5;
      let activeRootId = null;
      let activeOrgTree = null;
      let allRenderedNodes = [];

      const viewport = document.getElementById('canvas-viewport');
      const surface = document.getElementById('canvas-surface');
      const nodesContainer = document.getElementById('canvas-nodes-container');
      const svgLayer = document.getElementById('canvas-svg-layer');
      const zoomLevelEl = document.getElementById('canvas-zoom-level');
      const searchInput = document.getElementById('canvas-search-input');
      const nodeCountEl = document.getElementById('canvas-node-count');
      const deptFiltersContainer = document.getElementById('canvas-dept-filters');
      const inspector = document.getElementById('canvas-node-inspector');
      const inspectorCloseBtn = document.getElementById('inspector-close-btn');

      function updateTransform() {
        if (!surface || !zoomLevelEl) return;
        surface.style.transform = 'scale(' + currentZoom + ')';
        zoomLevelEl.textContent = Math.round(currentZoom * 100) + '%';
      }

      // Zoom Controls
      const zoomInBtn = document.getElementById('canvas-zoom-in');
      const zoomOutBtn = document.getElementById('canvas-zoom-out');
      const resetBtn = document.getElementById('canvas-reset-btn');

      if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
          if (currentZoom < 2.0) {
            currentZoom = Math.min(2.0, currentZoom + 0.15);
            updateTransform();
          }
        });
      }

      if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
          if (currentZoom > 0.4) {
            currentZoom = Math.max(0.4, currentZoom - 0.15);
            updateTransform();
          }
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', function() {
          currentZoom = 1.0;
          activeRootId = null;
          updateTransform();
          loadCanvasTree(currentMaxDepth, null);
        });
      }

      // Depth Buttons (3 Lvl, 5 Lvl, All)
      document.querySelectorAll('.canvas-depth-selector .depth-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          document.querySelectorAll('.canvas-depth-selector .depth-btn').forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentMaxDepth = parseInt(btn.getAttribute('data-depth') || '5', 10);
          loadCanvasTree(currentMaxDepth, activeRootId);
        });
      });

      // Fetch Real Database Tree
      async function loadCanvasTree(depth, rootId) {
        if (!nodesContainer || !svgLayer) return;
        if (nodeCountEl) nodeCountEl.textContent = 'Loading live organization...';

        try {
          const prefix = window.location.pathname.startsWith('/portal') ? '/portal' : '';
          const endpoint = prefix + '/api/v1/portal/canvas/tree?max_depth=' + depth + (rootId ? '&root_id=' + encodeURIComponent(rootId) : '');
          const res = await fetch(endpoint, { headers: { 'Accept': 'application/json' } });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const body = await res.json();
          activeOrgTree = body.data;

          if (nodeCountEl && activeOrgTree) {
            nodeCountEl.textContent = activeOrgTree.totalEmployees + ' Colleagues (' + (activeOrgTree.divisions || []).length + ' Divisions)';
          }

          renderDynamicFilters(activeOrgTree.divisions || []);
          renderCanvasNodesAndEdges(activeOrgTree.root);
        } catch(e) {
          if (nodeCountEl) nodeCountEl.textContent = 'Live tree sync offline';
        }
      }

      // Render Dynamic Division Filter Buttons
      function renderDynamicFilters(divisions) {
        if (!deptFiltersContainer) return;
        deptFiltersContainer.innerHTML = '<button class="filter-pill active" data-div="all">All Divisions</button>' +
          divisions.map(function(d) {
            return '<button class="filter-pill" data-div="' + d.name + '">' + d.name + ' (' + d.headCount + ')</button>';
          }).join('');

        deptFiltersContainer.querySelectorAll('.filter-pill').forEach(function(pill) {
          pill.addEventListener('click', function() {
            deptFiltersContainer.querySelectorAll('.filter-pill').forEach(function(p) { p.classList.remove('active'); });
            pill.classList.add('active');
            const targetDiv = pill.getAttribute('data-div');
            filterNodesByDivision(targetDiv);
          });
        });
      }

      function filterNodesByDivision(divName) {
        document.querySelectorAll('.canvas-org-cluster').forEach(function(c) {
          const nodeDiv = c.getAttribute('data-division');
          if (divName === 'all' || nodeDiv === divName) {
            c.style.opacity = '1';
            c.style.filter = 'none';
          } else {
            c.style.opacity = '0.2';
            c.style.filter = 'grayscale(100%)';
          }
        });
      }

      // Layout Algorithm & Coordinate Computation
      function renderCanvasNodesAndEdges(rootNode) {
        if (!rootNode) {
          nodesContainer.innerHTML = '<div style="padding: 2rem; color: var(--forge-text-muted);">No organization nodes found.</div>';
          svgLayer.innerHTML = '';
          return;
        }

        allRenderedNodes = [];
        const levels = {};
        const nodePositions = new Map();

        // Group nodes by level (1 to 5+)
        function traverse(node, parentId) {
          if (!levels[node.level]) levels[node.level] = [];
          levels[node.level].push({ node: node, parentId: parentId });
          allRenderedNodes.push(node);
          (node.children || []).forEach(function(c) { traverse(c, node.id); });
        }
        traverse(rootNode, null);

        const cardWidth = 270;
        const cardHeight = 110;
        const levelYSpacing = 170;
        const startY = 40;

        // Determine max breadth across all rendered levels
        let maxBreadth = 1;
        Object.keys(levels).forEach(function(lvl) {
          if (levels[lvl].length > maxBreadth) maxBreadth = levels[lvl].length;
        });

        const totalWidth = Math.max(1800, maxBreadth * (cardWidth + 40) + 200);
        const totalHeight = Math.max(1000, Object.keys(levels).length * levelYSpacing + 300);
        surface.style.width = totalWidth + 'px';
        surface.style.height = totalHeight + 'px';

        // Compute X & Y coordinates
        Object.keys(levels).forEach(function(lvlStr) {
          const lvl = parseInt(lvlStr, 10);
          const nodesInLevel = levels[lvl];
          const spacing = totalWidth / (nodesInLevel.length + 1);
          const y = startY + (lvl - 1) * levelYSpacing;

          nodesInLevel.forEach(function(item, idx) {
            const x = spacing * (idx + 1) - (cardWidth / 2);
            nodePositions.set(item.node.id, { x: x, y: y, item: item });
          });
        });

        // Generate SVG Bezier Connection Lines
        let svgHtml = '';
        nodePositions.forEach(function(pos, nodeId) {
          const parentId = pos.item.parentId;
          if (parentId && nodePositions.has(parentId)) {
            const parentPos = nodePositions.get(parentId);
            const px = parentPos.x + cardWidth / 2;
            const py = parentPos.y + cardHeight;
            const cx = pos.x + cardWidth / 2;
            const cy = pos.y;
            const midY = (py + cy) / 2;

            svgHtml += '<path class="canvas-edge-line" d="M ' + px + ' ' + py + ' C ' + px + ' ' + midY + ', ' + cx + ' ' + midY + ', ' + cx + ' ' + cy + '" />';
          }
        });
        svgLayer.innerHTML = svgHtml;

        // Generate Node Cards
        let nodesHtml = '';
        nodePositions.forEach(function(pos, nodeId) {
          const n = pos.item.node;
          const initials = n.name.split(' ').map(function(w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
          const statusClass = n.status === 'ONLINE' ? 'status-online' : (n.status === 'BUSY' ? 'status-busy' : 'status-away');

          let expandHtml = '';
          if (n.hasMoreChildren) {
            expandHtml = '<button class="node-expand-btn" data-expand-id="' + n.id + '">+ ' + n.directReportCount + ' Reports (Expand Lvl ' + (n.level + 1) + ')</button>';
          }

          nodesHtml += '<div class="canvas-org-cluster" style="left: ' + pos.x + 'px; top: ' + pos.y + 'px;" data-node-id="' + n.id + '" data-division="' + n.division + '">' +
            '<div class="cluster-header">' +
              '<span class="cluster-badge">' + n.department + '</span>' +
              '<span class="cluster-count">Lvl ' + n.level + (n.directReportCount > 0 ? ' • ' + n.directReportCount + ' reports' : '') + '</span>' +
            '</div>' +
            '<div class="org-node-card ' + (n.level === 1 ? 'node-lead' : '') + '">' +
              '<div class="node-avatar">' + initials + '</div>' +
              '<div class="node-info">' +
                '<div class="node-name">' + n.name + '</div>' +
                '<div class="node-role">' + n.title + '</div>' +
              '</div>' +
              '<span class="status-indicator ' + statusClass + '" title="' + n.status + '"></span>' +
            '</div>' +
            expandHtml +
          '</div>';
        });
        nodesContainer.innerHTML = nodesHtml;

        // Attach Node Interaction Listeners
        attachNodeListeners();
      }

      function attachNodeListeners() {
        // Node Selection & Inspector Display
        document.querySelectorAll('.canvas-org-cluster').forEach(function(card) {
          card.addEventListener('click', function(e) {
            if (e.target.closest('.node-expand-btn')) return;
            const nId = card.getAttribute('data-node-id');
            const targetNode = allRenderedNodes.find(function(item) { return item.id === nId; });
            if (targetNode) showNodeInspector(targetNode);
          });
        });

        // On-Click Progressive Subtree Expansion (for Level 5+ Nodes)
        document.querySelectorAll('.node-expand-btn').forEach(function(btn) {
          btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const expandId = btn.getAttribute('data-expand-id');
            activeRootId = expandId;
            loadCanvasTree(currentMaxDepth, expandId);
          });
        });
      }

      // Show Colleague Inspector Panel
      function showNodeInspector(node) {
        if (!inspector) return;
        document.querySelectorAll('.canvas-org-cluster').forEach(function(c) { c.classList.remove('selected-node'); });
        const selected = document.querySelector('.canvas-org-cluster[data-node-id="' + node.id + '"]');
        if (selected) selected.classList.add('selected-node');

        const initials = node.name.split(' ').map(function(w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
        document.getElementById('inspector-avatar').textContent = initials;
        document.getElementById('inspector-full-name').textContent = node.name;
        document.getElementById('inspector-role').textContent = node.title;
        document.getElementById('inspector-division').textContent = node.division;
        document.getElementById('inspector-department').textContent = node.department;
        document.getElementById('inspector-email').textContent = node.email;
        document.getElementById('inspector-level').textContent = 'Level ' + node.level;
        document.getElementById('inspector-reports').textContent = node.directReportCount + ' direct (' + node.totalSubtreeCount + ' total in subtree)';

        const focusBtn = document.getElementById('inspector-focus-sub-btn');
        if (focusBtn) {
          focusBtn.onclick = function() {
            activeRootId = node.id;
            loadCanvasTree(currentMaxDepth, node.id);
          };
        }

        const copyBtn = document.getElementById('inspector-copy-email-btn');
        if (copyBtn) {
          copyBtn.onclick = function() {
            if (navigator.clipboard) navigator.clipboard.writeText(node.email);
            if (window.astryxToast) window.astryxToast.show('Copied email: ' + node.email, 'success');
          };
        }

        inspector.style.display = 'block';
      }

      if (inspectorCloseBtn) {
        inspectorCloseBtn.addEventListener('click', function() {
          if (inspector) inspector.style.display = 'none';
        });
      }

      // Search & Center on Node
      if (searchInput) {
        searchInput.addEventListener('input', function(e) {
          const q = (e.target.value || '').toLowerCase().trim();
          document.querySelectorAll('.canvas-org-cluster').forEach(function(card) {
            const text = (card.textContent || '').toLowerCase();
            if (!q || text.includes(q)) {
              card.style.opacity = '1';
              card.style.filter = 'none';
            } else {
              card.style.opacity = '0.2';
              card.style.filter = 'grayscale(100%)';
            }
          });
        });
      }

      // Find My Team (Center on Level 1 Lead)
      const findMeBtn = document.getElementById('canvas-find-me-btn');
      if (findMeBtn && viewport) {
        findMeBtn.addEventListener('click', function() {
          const lead = document.querySelector('.canvas-org-cluster[style*="top: 40px"]');
          if (lead) {
            lead.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            lead.classList.add('selected-node');
            setTimeout(function() { lead.classList.remove('selected-node'); }, 2000);
          }
        });
      }

      // Initialize on load
      loadCanvasTree(currentMaxDepth, null);
    })();
  `;
}

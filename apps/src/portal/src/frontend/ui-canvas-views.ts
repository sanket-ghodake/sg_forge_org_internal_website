/**
 * @forge/portal - Canvas Perspectives: Divisions Matrix & Leadership Pipeline (2026 LTS)
 * High-craft Supabase/Railway-style matrix cards and topology tier flow.
 */

export function getCanvasViewsScript(): string {
  return `
    // ── Render Mode 2: Divisions Matrix ──
    function renderDivisionsMatrix() {
      const grid = document.getElementById('divisions-fleet-grid');
      if (!grid || !activeOrgTree) return;

      const divs = activeOrgTree.divisions || [];
      if (!divs.length) {
        grid.innerHTML = '<div style="color:var(--forge-text-muted); padding:2rem;">No divisions data available.</div>';
        return;
      }

      grid.innerHTML = divs.map(function(d) {
        const members = allRenderedNodes.filter(function(item) { return item.division === d.name; });
        const lead = members.find(function(item) { return item.level <= 2; }) || members[0];
        const onlineCount = members.filter(function(item) { return item.status === 'ONLINE'; }).length;

        const leadInit = lead ? lead.name.split(' ').map(function(w) { return w[0]; }).join('').slice(0, 2).toUpperCase() : '--';
        const memberAvatars = members.slice(0, 5).map(function(m) {
          const init = m.name.split(' ').map(function(w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
          return '<span class="stacked-avatar" title="' + m.name + ' (' + m.title + ')">' + init + '</span>';
        }).join('');

        return '<div class="division-fleet-card">' +
          '<div class="div-card-top">' +
            '<div>' +
              '<h3 class="div-card-title">' + d.name + '</h3>' +
              '<div class="div-card-subtitle">' + (lead ? lead.title : 'Operational Division') + '</div>' +
            '</div>' +
            '<span class="astryx-badge badge-running">' + d.headCount + ' Members</span>' +
          '</div>' +
          '<div class="div-card-body">' +
            (lead ? '<div class="div-lead-row">' +
              '<div class="node-avatar-sm">' + leadInit + '</div>' +
              '<div style="min-width:0; flex:1;">' +
                '<div style="font-size:0.8rem; font-weight:600; color:var(--forge-text-main);">' + lead.name + '</div>' +
                '<div style="font-size:0.7rem; color:var(--forge-text-muted);">Division Lead</div>' +
              '</div>' +
            '</div>' : '') +
            '<div class="div-stats-row">' +
              '<span>Live Presence:</span>' +
              '<strong style="color:var(--forge-success);">' + onlineCount + '/' + d.headCount + ' Active</strong>' +
            '</div>' +
            '<div class="div-members-preview">' +
              '<div class="stacked-avatars-row">' + memberAvatars + '</div>' +
              (members.length > 5 ? '<span style="font-size:0.72rem; color:var(--forge-text-subtle);">+' + (members.length - 5) + ' more</span>' : '') +
            '</div>' +
          '</div>' +
          '<div class="div-card-footer">' +
            '<button class="astryx-btn btn-sm btn-outline" style="width:100%;" onclick="focusDivisionInCanvas(\\'' + d.name + '\\')">View Division in Canvas</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    window.focusDivisionInCanvas = function(divName) {
      const canvasTab = document.querySelector('.canvas-tab-pill[data-mode="canvas"]');
      if (canvasTab) canvasTab.click();
      const pill = document.querySelector('.filter-pill[data-div="' + divName + '"]');
      if (pill) pill.click();
    };

    // ── Render Mode 3: Leadership Pipeline ──
    function renderLeadershipPipeline() {
      const flow = document.getElementById('leadership-pipeline-flow');
      if (!flow || !allRenderedNodes.length) return;

      const tiers = [
        { level: 1, name: 'Tier 1: Executive Council', roleLabel: 'CEO & Co-Founders' },
        { level: 2, name: 'Tier 2: Division Heads', roleLabel: 'Vice Presidents & Global Directors' },
        { level: 3, name: 'Tier 3: Team Leads', roleLabel: 'Engineering & Operational Leads' },
        { level: 4, name: 'Tier 4: Senior Pods', roleLabel: 'Senior Specialists & Staff' },
      ];

      flow.innerHTML = tiers.map(function(tier) {
        const members = allRenderedNodes.filter(function(item) { return item.level === tier.level; });
        if (!members.length) return '';

        const memberCards = members.map(function(m) {
          const init = m.name.split(' ').map(function(w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
          return '<div class="leadership-node-item" onclick="inspectById(\\'' + m.id + '\\')">' +
            '<div class="node-avatar-sm">' + init + '</div>' +
            '<div style="min-width:0; flex:1;">' +
              '<div style="font-size:0.8rem; font-weight:600; color:var(--forge-text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + m.name + '</div>' +
              '<div style="font-size:0.7rem; color:var(--forge-text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + m.title + '</div>' +
            '</div>' +
            '<span class="astryx-micro-pill">' + m.division + '</span>' +
          '</div>';
        }).join('');

        return '<div class="leadership-tier-block">' +
          '<div class="tier-block-header">' +
            '<span class="tier-title">' + tier.name + '</span>' +
            '<span class="tier-badge">' + members.length + ' Leaders</span>' +
          '</div>' +
          '<div class="tier-grid">' + memberCards + '</div>' +
        '</div>';
      }).join('');
    }
  `;
}

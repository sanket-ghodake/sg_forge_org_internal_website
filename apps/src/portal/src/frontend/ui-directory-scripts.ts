/**
 * @forge/portal - Directory Client Scripts (2026 LTS)
 * Real-time fuzzy filtering, colleague search, copy email, and live timezone clocks.
 */

export function getDirectoryClientScript(): string {
  return `
    (function initDirectoryEngine() {
      const searchInput = document.getElementById('directory-search-input');
      const divFilter = document.getElementById('dir-filter-division');
      const statusFilter = document.getElementById('dir-filter-status');
      const countLabel = document.getElementById('directory-count-label');
      const cards = document.querySelectorAll('.colleague-card');

      function updateDirectoryView() {
        const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
        const selectedDiv = divFilter ? divFilter.value : 'all';
        const selectedStatus = statusFilter ? statusFilter.value : 'all';

        let visibleCount = 0;

        cards.forEach(function(card) {
          const name = card.getAttribute('data-name') || '';
          const division = card.getAttribute('data-division') || '';
          const status = card.getAttribute('data-status') || '';
          const fullText = (card.textContent || '').toLowerCase();

          const matchesSearch = !query || name.includes(query) || fullText.includes(query);
          const matchesDiv = selectedDiv === 'all' || division === selectedDiv;
          const matchesStatus = selectedStatus === 'all' || status === selectedStatus;

          if (matchesSearch && matchesDiv && matchesStatus) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (countLabel) {
          countLabel.innerHTML = 'Showing <strong>' + visibleCount + '</strong> colleagues';
        }
      }

      if (searchInput) searchInput.addEventListener('input', updateDirectoryView);
      if (divFilter) divFilter.addEventListener('change', updateDirectoryView);
      if (statusFilter) statusFilter.addEventListener('change', updateDirectoryView);

      // Copy Email Toast Action
      document.querySelectorAll('.copy-email-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const email = btn.getAttribute('data-email');
          if (email && navigator.clipboard) {
            navigator.clipboard.writeText(email);
            if (window.astryxToast) {
              window.astryxToast('Copied ' + email + ' to clipboard', 'success');
            }
          }
        });
      });

      // View on Map Jump Action
      document.querySelectorAll('.view-on-canvas-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (window.portalSPA) {
            window.portalSPA.navigate('canvas');
          }
        });
      });

      // Live Timezone Clock Updates
      function updateTimezoneClocks() {
        const clockEls = document.querySelectorAll('.tz-live-clock');
        const now = new Date();

        clockEls.forEach(function(el) {
          const tz = el.getAttribute('data-tz');
          if (!tz) return;
          try {
            const timeStr = now.toLocaleTimeString('en-US', {
              timeZone: tz,
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            el.textContent = timeStr;
          } catch(e) {
            el.textContent = '--:--';
          }
        });
      }

      updateTimezoneClocks();
      setInterval(updateTimezoneClocks, 30000);
    })();
  `;
}

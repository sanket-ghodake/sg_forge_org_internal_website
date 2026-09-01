import { getCanvasClientScript } from './ui-canvas-scripts';
import { getAdminClientScript } from './ui-admin-scripts';
import { getAppsClientScript } from './ui-apps-scripts';
import { getInboxClientScript } from './ui-inbox-scripts';

export function getPortalClientScript(): string {
  return `
    (function() {
      // 0. Browser Telemetry & Log Bridge
      try {
        window.addEventListener('error', function(e) {
          try {
            if (e.filename && (e.filename.startsWith('chrome-extension:') || e.filename.startsWith('moz-extension:') || e.filename.includes('VM') || e.filename.includes('extensions::'))) {
              return;
            }
            if (e.message && e.message.includes("reading 'startTime'")) {
              return;
            }
            if (navigator.sendBeacon) {
              navigator.sendBeacon('/portal/api/logs/browser', JSON.stringify({
                service: 'portal-service',
                severity: 'ERROR',
                message: e.message || 'Client runtime error',
                source: 'browser'
              }));
            }
          } catch(err) {}
        });
      } catch(e) {}
      var STORAGE_KEY_VIEW = 'forge:v1:portal:view';
      var STORAGE_KEY_ROLE = 'forge:v1:portal:preview_role';
      var THEME_KEY = 'forge:v1:platform:theme';
      var LEGACY_THEME_KEY = 'sg-forge-theme';
      var CHANNEL_NAME = 'sg_forge_state_sync_bus';

      var sidebar = document.getElementById('portal-sidebar');
      var profileBtn = document.getElementById('user-profile-menu-btn');
      var profilePopover = document.getElementById('user-profile-popover');
      var roleToggleBtn = document.getElementById('role-preview-toggle');
      var roleLabel = document.getElementById('role-preview-label');
      var popoverRoleText = document.getElementById('popover-role-text');
      var adminSection = document.getElementById('portal-admin-section');
      var searchModal = document.getElementById('portal-search-modal');
      var searchBtn = document.getElementById('portal-search-btn');
      var searchInput = document.getElementById('portal-search-input');
      var searchResults = document.getElementById('portal-search-results');
      var themeBadge = document.getElementById('theme-badge');

      // ── 1. User Profile Popover Controller with Viewport Containment ──
      function positionPopover() {
        if (!profilePopover || !profileBtn) return;
        var rect = profileBtn.getBoundingClientRect();
        var popoverWidth = profilePopover.offsetWidth || 260;
        var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        if (rect.right < popoverWidth + 10) {
          profilePopover.style.right = 'auto';
          profilePopover.style.left = '0';
        } else {
          profilePopover.style.left = 'auto';
          profilePopover.style.right = '0';
        }
      }

      function toggleProfilePopover(force) {
        if (!profilePopover || !profileBtn) return;
        var isOpen = force !== undefined ? force : !profilePopover.classList.contains('active');
        profilePopover.classList.toggle('active', isOpen);
        profileBtn.classList.toggle('active', isOpen);
        profileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) positionPopover();
      }

      function closeProfilePopover() {
        toggleProfilePopover(false);
      }

      if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleProfilePopover();
        });
      }

      if (profilePopover) {
        profilePopover.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }

      document.addEventListener('click', function() {
        closeProfilePopover();
      });

      // ── 2. Astryx Theme Synchronization Engine ──
      function getSavedTheme() {
        try {
          var raw = localStorage.getItem(THEME_KEY) || localStorage.getItem(LEGACY_THEME_KEY);
          if (!raw) return 'dark';
          var env = JSON.parse(raw);
          return (env && typeof env === 'object' && env.data) ? env.data : (env || 'dark');
        } catch(e) {
          return 'dark';
        }
      }

      function updateThemeIcons(theme) {
        var sun = document.getElementById('sun-icon');
        var moon = document.getElementById('moon-icon');
        if (sun && moon) {
          sun.style.display = (theme === 'dark') ? 'block' : 'none';
          moon.style.display = (theme === 'dark') ? 'none' : 'block';
        }
        if (themeBadge) {
          themeBadge.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }
      }

      function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcons(theme);
      }

      function saveTheme(theme) {
        try {
          var env = { version: 1, updatedAt: new Date().toISOString(), data: theme };
          localStorage.setItem(THEME_KEY, JSON.stringify(env));
          localStorage.setItem(LEGACY_THEME_KEY, theme);
          if (typeof BroadcastChannel !== 'undefined') {
            var bc = new BroadcastChannel(CHANNEL_NAME);
            bc.postMessage({ key: THEME_KEY, data: theme, timestamp: Date.now() });
            bc.close();
          }
        } catch(e) {}
      }

      var currentTheme = getSavedTheme();
      applyTheme(currentTheme);

      var themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) {
        themeBtn.addEventListener('click', function() {
          var cur = document.documentElement.getAttribute('data-theme') || 'dark';
          var next = (cur === 'dark') ? 'light' : 'dark';
          applyTheme(next);
          saveTheme(next);
        });
      }

      // ── 3. View Navigation & Routing ──
      function switchView(viewId, updateHistory) {
        if (!viewId) return;
        try { document.documentElement.setAttribute('data-active-view', viewId); } catch(e) {}

        // Update nav items active state
        document.querySelectorAll('.portal-nav-item[data-view]').forEach(function(btn) {
          btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
        });

        // Update page view containers
        var targetView = document.getElementById('view-' + viewId);
        if (targetView) {
          document.querySelectorAll('.portal-page-view').forEach(function(v) {
            v.classList.remove('active');
          });
          targetView.classList.add('active');
          try { sessionStorage.setItem(STORAGE_KEY_VIEW, viewId); } catch(e) {}
        }

        if (updateHistory !== false) {
          var url = new URL(window.location.href);
          url.searchParams.set('view', viewId);
          window.history.replaceState({ view: viewId }, '', url.toString());
        }
      }

      window.portalSPA = { navigate: switchView };

      document.querySelectorAll('.portal-nav-item[data-view]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var target = btn.getAttribute('data-view');
          if (target) switchView(target, true);
        });
      });

      document.querySelectorAll('.popover-nav-action[data-nav]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var target = btn.getAttribute('data-nav');
          if (target) {
            switchView(target, true);
            closeProfilePopover();
          }
        });
      });

      // ── 4. Auto-Collapsible Sidebar Blur Handler ──
      if (sidebar) {
        sidebar.addEventListener('mouseleave', function() {
          if (document.activeElement && sidebar.contains(document.activeElement) && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
          }
        });
      }

      // ── 5. Role Preview Switcher (Admin ↔ Employee) ──
      var currentRole = localStorage.getItem(STORAGE_KEY_ROLE) || 'Admin';

      function setRole(role) {
        currentRole = role;
        localStorage.setItem(STORAGE_KEY_ROLE, role);
        if (roleLabel) roleLabel.textContent = role;
        if (popoverRoleText) popoverRoleText.textContent = role + ' Access';
        if (adminSection) adminSection.style.display = (role === 'Admin') ? 'block' : 'none';

        var currentActiveNav = document.querySelector('.portal-nav-item.active');
        if (currentActiveNav && currentActiveNav.closest('.portal-admin-section') && role !== 'Admin') {
          switchView('canvas', true);
        }
      }

      if (roleToggleBtn) {
        roleToggleBtn.addEventListener('click', function() {
          var nextRole = (currentRole === 'Admin') ? 'Employee' : 'Admin';
          setRole(nextRole);
          if (window.astryxToast) {
            window.astryxToast('Switched workspace mode to ' + nextRole, 'info');
          }
        });
      }
      setRole(currentRole);

      // ── 6. Quick Finder / Command Palette (⌘K) ──
      var searchPages = [
        { id: 'canvas', title: 'Company Map & Org Canvas', category: 'Workspace' },
        { id: 'apps', title: 'Apps & Tools Hub', category: 'Workspace' },
        { id: 'profile', title: 'My Profile & Account', category: 'Workspace' },
        { id: 'notifications', title: 'Notifications & Announcements', category: 'Workspace' },
        { id: 'admin-members', title: 'Team & Member Management', category: 'Admin Console' },
        { id: 'admin-apps', title: 'App Store & Permissions', category: 'Admin Console' },
        { id: 'admin-org', title: 'Organization Chart Builder', category: 'Admin Console' },
        { id: 'admin-audit', title: 'Security & Audit Logs', category: 'Admin Console' },
        { id: 'admin-settings', title: 'Company Settings & Security', category: 'Admin Console' }
      ];

      function openSearch() {
        if (!searchModal) return;
        searchModal.classList.add('active');
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
          renderSearchResults('');
        }
      }

      function closeSearch() {
        if (searchModal) searchModal.classList.remove('active');
      }

      function renderSearchResults(query) {
        if (!searchResults) return;
        var q = (query || '').toLowerCase().trim();
        var matches = searchPages.filter(function(p) {
          if (currentRole !== 'Admin' && p.category === 'Admin Console') return false;
          return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        });

        if (matches.length === 0) {
          searchResults.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--forge-text-muted); font-size: 0.85rem;">No matching items found</div>';
          return;
        }

        searchResults.innerHTML = matches.map(function(item) {
          return '<div class="portal-search-item command-item" data-target="' + item.id + '">' +
            '<span class="badge-dot" style="background: var(--forge-primary); width: 6px; height: 6px; border-radius: 50%;"></span>' +
            '<span class="cmd-text" style="font-weight: 500;">' + item.title + '</span>' +
            '<span class="cmd-shortcut">' + item.category + '</span>' +
          '</div>';
        }).join('');

        searchResults.querySelectorAll('.portal-search-item').forEach(function(row) {
          row.addEventListener('click', function() {
            var target = row.getAttribute('data-target');
            if (target) {
              switchView(target, true);
              closeSearch();
            }
          });
        });
      }

      if (searchBtn) searchBtn.addEventListener('click', openSearch);
      if (searchInput) searchInput.addEventListener('input', function(e) { renderSearchResults(e.target.value); });
      if (searchModal) {
        searchModal.addEventListener('click', function(e) {
          if (e.target === searchModal) closeSearch();
        });
      }

      // ── 7. Keyboard Shortcuts (⌘K & Escape) ──
      window.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (searchModal && searchModal.classList.contains('active')) {
            closeSearch();
          } else {
            openSearch();
          }
        }
        if (e.key === 'Escape') {
          if (searchModal && searchModal.classList.contains('active')) closeSearch();
          if (profilePopover && profilePopover.classList.contains('active')) closeProfilePopover();
        }
      });

      // ── 8. Sign Out ──
      var logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
          try {
            await fetch('/api/v1/auth/logout', { method: 'POST' });
          } catch(e) {}
          window.location.href = '/auth/login?return_url=/portal';
        });
      }

      // Initial route hydration: Priority URL param -> Hash -> SessionStorage -> Default 'canvas'
      var initialParamView = new URLSearchParams(window.location.search).get('view');
      var hashView = window.location.hash ? window.location.hash.slice(1) : '';
      switchView(initialParamView || hashView || 'canvas', false);
    })();

    ${getCanvasClientScript()}
    ${getAppsClientScript()}
    ${getAdminClientScript()}
    ${getInboxClientScript()}
  `;
}

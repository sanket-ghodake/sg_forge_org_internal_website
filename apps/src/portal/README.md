# 🧭 Main Workspace & Admin Portal (`@forge/portal`)

Primary enterprise employee workspace, admin governance center, visual 2D interactive organizational canvas, and sandboxed micro-app host serving on Port `:3001` (proxied at `/portal`).

---

## 🏛️ Core Architecture Directives & Rules

1. **Strict Single Page Application (SPA)**:
   - The portal operates strictly as an SPA.
   - Zero full-page hard refreshes when switching between views.
   - All navigation links consume client-side routing (`data-view` / `data-nav` attributes and `switchView()`), with seamless URL query parameter synchronization (`history.replaceState`) and reload state preservation.
2. **Fluid Multi-Device Responsiveness (320px Guarantee)**:
   - Enforces responsive design across mobile (320px - 768px), tablet (768px - 1024px), and desktop (>1024px).
   - Zero horizontal overflow scrolling down to 320px viewport width.
   - Fluid auto-collapsing sidebar, responsive search trigger, and responsive user profile popover.
3. **100% Meta Astryx Design Tokens (`@forge/ui`)**:
   - Zero ad-hoc CSS or browser defaults.
   - Seamless dark/light theme switching with cross-tab `BroadcastChannel` synchronization.

---

## 🚀 Features
* **Top Header Bar**: Multi-tenant organization selector, command finder trigger (`⌘K`), theme switcher, and modern top-right user profile popover.
* **Auto-Collapsible Left Sidebar**: Compact 56px icon rail and 224px expanded navigation drawer with hover-peek and role-guarded Admin Console.
* **10 Purpose-Built Views**: 5 Employee views (*Company Map, Apps Hub, People Directory, My Profile, Announcements*) + 5 Admin Console views (*Member Management, App Permissions, Org Chart Editor, Security & Audit, Workspace Settings*).
* **Zero-Trust SSO Integration**: Integrated with central `@forge/auth` gateway and ASVS 5.0 security tokens.

---

## 🏃 Local Execution
```bash
bun apps/src/portal/src/server.ts
```

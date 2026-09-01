# 🎨 Portal Frontend UI Architecture (`@forge/portal/frontend`)

Modular, accessible, and performant frontend presentation layer for SG Forge Portal (2026 LTS).

---

## 🏛️ Component Architecture

1. **`layout-header.ts`**: Top navigation bar with multi-tenant branding, search trigger (`⌘K`), theme switcher, and user avatar popover.
2. **`layout-sidebar.ts`**: Auto-collapsible sidebar with precision monochrome icons, hover-peek, and role-guarded Admin Console.
3. **`ui-renderer-canvas.ts`**: 2D Org Map & interactive visual hierarchy canvas.
4. **`ui-renderer-apps.ts`**: Microservices & Tools Launcher Hub with health indicators and access request flow.
5. **`ui-renderer-directory.ts`**: Searchable People Directory with live local timezone clocks and colleague actions.
6. **`ui-renderer-profile.ts`**: Personal profile, assigned IAM scopes, active session revocation, and PAT generator.
7. **`ui-renderer-inbox.ts`**: Announcements & notifications feed with priority badges.
8. **`ui-admin-members.ts`**: Team & Member management with employee roster table and invite modal.
9. **`ui-admin-apps.ts`**: App Catalog registry, ingress port mapper, and department permission matrix.
10. **`ui-admin-org.ts`**: Visual Org Chart Builder and tree hierarchy editor.
11. **`ui-admin-audit.ts`**: Immutable RFC 7807 security audit stream with PII redaction.
12. **`ui-admin-settings.ts`**: Workspace identity branding, Google/SAML SSO configuration, and Turso DB health cards.
13. **`ui-modals.ts`**: Viewport-safe slide-out action drawers and confirmation dialogs.
14. **`ui-command-palette.ts`**: Universal `⌘K` Quick Search overlay indexing all views, colleagues, and tools.
15. **`ui-canvas-scripts.ts`**: Interactive 2D pan/zoom and node centering engine.
16. **`ui-directory-scripts.ts`**: Client-side fuzzy filtering and live timezone clock updates.
17. **`ui-admin-scripts.ts`**: Admin action handlers and feedback toasts.
18. **`ui-styles.ts`**: Meta Astryx CSS styles conforming strictly to `--forge-*` custom properties.
19. **`ui-scripts.ts`**: Master client-side router, ⌘K command modal, and state persistence.
20. **`ui-renderer.ts`**: Master HTML layout assembler.

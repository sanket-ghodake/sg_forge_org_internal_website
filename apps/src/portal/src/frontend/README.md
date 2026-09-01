# 🎨 Portal Frontend UI Architecture (`@forge/portal/frontend`)

Modular, accessible, and performant frontend presentation layer for SG Forge Portal (2026 LTS).

---

## 🏛️ Component Architecture

1. **`layout-header.ts`**: Top navigation bar with multi-tenant organization selector, command finder trigger (`⌘K`), live role preview switcher, and user avatar.
2. **`layout-sidebar.ts`**: Supabase-inspired auto-expandable sidebar with dual rail (`58px`) / drawer (`240px`) states, hover-peek, pin toggle (`⌘B`), and role-guarded Admin Console.
3. **`page-cards.ts`**: Structured overview and roadmap containers for 5 Employee views and 5 Admin views.
4. **`ui-styles.ts`**: Meta Astryx CSS styles conforming strictly to `--forge-*` custom properties.
5. **`ui-scripts.ts`**: Client-side router, ⌘K command modal, and state persistence.
6. **`ui-renderer.ts`**: Master HTML layout assembler.

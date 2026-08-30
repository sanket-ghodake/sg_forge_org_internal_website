# Google-Grade Client State & Browser Storage Directives

> ⚠️ **MANDATORY CLIENT STATE DIRECTIVE FOR ALL SESSIONS & AI AGENTS**
> Client state persistence across all SG Forge web interfaces and micro-apps MUST adhere to Google's **4-Tier State Hierarchy**. Arbitrary, un-namespaced `localStorage` dumps and unhandled `JSON.parse` crashes are strictly forbidden.

---

## 🛑 THE 6 BROWSER STATE INVARIANTS

### 1. The 4-Tier State Classification (Strict Partitioning)
Every piece of state in a web application must be placed into its correct tier:
- **Tier 1 (URL Search Params & History API)**: Active sub-tabs (`?tab=services`), search queries (`?q=auth`), filter toggles, active entity IDs, and modal states. **Single source of truth for sharable/bookmarkable state**.
- **Tier 2 (`localStorage` with Versioned Envelopes)**: Visual theme (`dark`/`light`), sidebar collapse state, table column widths, density modes (`compact`/`comfortable`), last active workspace ID.
- **Tier 3 (`sessionStorage` for Tab Isolation)**: In-flight multi-step form data, uncommitted draft inputs, modal staging buffers. Cleared when tab closes to prevent parallel-tab collisions.
- **Tier 4 (`IndexedDB`)**: Heavy graph datasets, offline telemetry queues, large query results.

### 2. Standardized Key Namespacing & Versioning
- Storage keys MUST follow the format: `forge:v<version>:<appName>:<category>` (e.g., `forge:v1:portal:theme`, `forge:v1:devcenter:active-tab`).
- Never use un-namespaced keys like `theme`, `tab`, or `settings`.

### 3. Zero Layout Shift (FOUC Prevention)
- Critical visual variables (`data-theme`, `data-sidebar-collapsed`) MUST be restored synchronously in the HTML `<head>` using `getHeadStateScript()` from `@forge/ui` before the document body begins painting.

### 4. Zero-Throw Defensive JSON Parsing
- Raw `JSON.parse` is forbidden on client storage reads without defensive error handling.
- Always use `createStateStore` from `@forge/ui/state` or a `try/catch` fallback returning safe defaults.

### 5. Real-Time Cross-Tab Synchronization
- Global preference changes (e.g., Theme, Active Organization) must broadcast instantly across all open browser windows/tabs using `BroadcastChannel('sg_forge_state_sync_bus')` and storage events.

### 6. Zero Sensitive Data in Client Storage
- Passwords, long-lived API tokens, OAuth refresh tokens, and PII are **HARD BLOCKED** from `localStorage` and `sessionStorage`. Sandboxed iframes communicate state strictly via secure `postMessage` protocol.

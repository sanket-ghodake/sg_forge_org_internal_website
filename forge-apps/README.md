# 🧩 Forge Micro-Apps (`forge-apps/`)

Independent, polyglot, sandboxed micro-frontends running in Docker containers with dedicated Turso (libSQL/SQLite) databases.

---

## 📊 Micro-Apps Catalog & Code Metrics Matrix

*Generated using portable toolchain (`portables/bin/scc` & `scripts/verify-gate.ts`)*

| Micro-App | Service Port | Public Route | Dedicated Database | Tech Stack & Pattern | Files | Lines (SLOC) | Complexity | 5-Tier Tests | Status |
| :--- | :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **[`expenses/`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/expenses/)** | `:8085` | `/apps/expenses` | `expenses.db` (Dedicated Turso) | TS / Python Contract (Approval Chains & Scoped Hierarchy) | 11 | 316 | 32 | 5 | **Passing** ✅ |
| **[`billing/`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/billing/)** | `:8086` | `/apps/billing` | `billing.db` (Dedicated Turso) | TS / Go Fiber Contract (Financial Ledger & Invoicing CRUD) | 13 | 363 | 29 | 5 | **Passing** ✅ |
| **[`telemetry/`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/telemetry/)** | `:8087` | `/apps/telemetry` | `telemetry.db` (Dedicated Turso) | TS / Hono (Public Live Metrics & SSE Streaming) | 13 | 313 | 19 | 5 | **Passing** ✅ |
| **[`app-template/`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/app-template/)** | `:8099` | Dynamic | `template.db` (Dedicated Turso) | 1-Command Scaffolding Reference Boilerplate | 20 | 339 | 26 | 10 | **Passing** ✅ |
| **Micro-Apps Total** | — | — | **Dedicated Turso DBs** | **Polyglot Microservices** | **57** | **1,331** | **106** | **25 Pass** | **100% Verified** ✅ |

---

## 🏛️ Micro-App Architectural Directives & Rules

1. **Dedicated Database Isolation**:
   - Every Forge App operates with its own isolated Turso (libSQL/SQLite) database instance in `apps/data/<app-name>.db`.
   - Micro-apps MUST NEVER directly connect to or query another app's database.
2. **Zero-Trust Auth & RBAC**:
   - All protected endpoints consume `@forge/sdk` `authGuard(req, options)` to validate JWT session tokens and enforce specific role permissions.
3. **Meta Astryx UI Compliance**:
   - All micro-app user interfaces consume `@forge/ui` (`getAstryxHeaderHtml()`, `getAstryxStyles()`) with `--forge-*` design tokens and zero browser defaults.
4. **4-Pillar Observability**:
   - Every micro-app maintains its own isolated `logs/` directory with structured JSON logging (`createLogger`) and automatic PII redaction.
5. **1-Command Scaffolding**:
   - Scaffold a new microservice instantly using `rtk bun scripts/create-app.ts <app-name>`.

# System Architecture, Modularity & Code Standards (Google & Meta Standard 2026)

> ⚠️ **MANDATORY ARCHITECTURAL DIRECTIVES FOR ALL AI SESSIONS & DEVELOPERS**
> The codebase must be maintained at the level of a flagship Google/Meta infrastructure product. Code must be highly modular, maintainable, rigorously documented, and strictly isolated.

---

## 🏛️ 1. Directional Layer Boundaries & Clean Architecture

All modules across `apps/src/` and `forge-apps/` must strictly adhere to directional layer boundaries:
$$\text{UI Layer (@forge/ui)} \longleftrightarrow \text{Application Services (apps/src/*)} \longleftrightarrow \text{Forge Micro-Apps (forge-apps/*)} \longleftrightarrow \text{Turso SQLite Storage}$$

1. **UI Layer (`@forge/ui`)**:
   - Consumes Meta Astryx tokens and component wrappers.
   - **Strictly Forbidden**: Direct database queries, raw SQL execution, filesystem writes, or subprocess spawning.
2. **Platform Services (`apps/src/{landing, auth, portal, dev-dashboard, dev-hub}`)**:
   - Orchestrates authentication, routing, and developer dashboards.
   - Must use `@forge/sdk` for structured JSON logging and RFC 7807 safe error boundaries.
3. **Independent Micro-Apps (`forge-apps/*`)**:
   - Each app is completely self-contained in its own directory with dedicated schemas, routes, and tests.
   - **Dedicated Turso DB Isolation**: Each app queries strictly its own isolated Turso libSQL SQLite database instance. Querying another app's DB is **strictly prohibited**.

---

## 📦 2. Clean Aliases & Zero Traversal Sprawl

All TypeScript imports across services and micro-apps MUST use clean, configured package aliases:
- `@forge/sdk` &rarr; `apps/src/sdk/src/index.ts` (Logging, Error handling, Client bridge)
- `@forge/ui` &rarr; `apps/src/ui/src/index.ts` (Meta Astryx tokens, accessible components, Theme engine)
- `@forge/types` &rarr; `apps/src/types/src/index.ts` (Domain models, RBAC interfaces, Event types)

Messy relative traversal imports (`../../..`) are strictly prohibited.

---

## 📊 3. Centralized Structured Logging & Error Handling Standard

Every service and route handler MUST implement centralized, structured observability:
1. **Structured Logging**: Use `createLogger(serviceName)` from `@forge/sdk` instead of raw `console.log`.
   * Formats JSON in production for automated SRE telemetry ingestion.
   * Colorized for local terminal readability.
2. **Safe Error Boundaries (RFC 7807)**:
   * Use `createSafeHandler(serviceName, handler)` from `@forge/sdk`.
   * Catches unhandled promise exceptions and formats standardized HTTP problem responses (`application/problem+json`) without exposing raw stack traces to end users.

---

## 📝 4. Mandatory Header Comment Blocks & Understandable Documentation

Every source file (`.ts`, `.tsx`, `.py`, `.go`, `.sh`, `.css`) MUST begin with a standardized header comment:
```typescript
/**
 * @forge/<service-or-app> - <Description>
 * Role: <Brief architectural responsibility>
 * Compliance: Meta Astryx UI / ASVS 5.0 Zero-Trust / Google SRE Logging
 */
```
- **TSDoc / JSDoc**: All exported functions, classes, interfaces, and options must include descriptive comments with `@param` and `@returns`.
- **Inline Logic Commentary**: Explain non-obvious engineering decisions and rationale, not just what the syntax does.

---

## 🔄 5. Hot Reloading & Environment Configuration Invariant

- **Zero Hardcoded Ports**: All ingress ports, service ports, and database credentials must be driven dynamically by `.env` (`${LANDING_PORT:-3000}`, `${PORTAL_PORT:-3001}`, etc.).
- **Hot-Reloading in Development**: All Docker containers and native runners execute via `bun --watch` so modifications to source files hot-reload immediately without rebuilding images.
- **Persistent Named Volumes**: Database files and package caches must reside in persistent named volumes (`sg_forge_db_data`, `sg_forge_bun_cache`) ensuring zero data loss on container recreation.

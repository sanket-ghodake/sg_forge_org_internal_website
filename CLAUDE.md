# AI AGENT DIRECTIVES - SG FORGE (2026 CLEAN ARCHITECTURE & ENGINEERING STANDARDS)

> ⚠️ **CRITICAL ENFORCEMENT NOTICE FOR ALL AI SESSIONS & LLMs**
> These directives are STRICT, NON-NEGOTIABLE, and IMMUTABLE across all sessions, agent personas, and IDE integrations (Antigravity, Claude, Cursor, Copilot, Windsurf). Every session agent MUST adhere to these rules without exception. Deviations constitute an immediate task failure.

---

## ⚡ 1. PRE-FLIGHT & PRE-COMMIT VERIFICATION GATE (14 CHECKS)
Before writing code, running commands, or staging/committing changes, verify:
1. [ ] **RTK Command Prefix**: Every bash command MUST be prefixed with `rtk` (e.g. `rtk git status`, `rtk bun test`, `rtk git add .`).
2. [ ] **Zero Host Modification**: All runtimes/tools strictly use portable repo binaries (`portables/bun/bin/bun`, `portables/bin/*`) or Docker. ZERO host modifications (`apt`, `brew`, `npm -g`, `pip install`).
3. [ ] **500-Line Soft File Cap**: Source files must remain cohesive and **$\le 500$ lines** ($\le 300$ lines ideal). Block files exceeding 500 lines without explicit domain aggregation exemption.
4. [ ] **Strict Meta Astryx UI**: Frontend UI code MUST strictly use Meta Astryx design tokens and components (`@forge/ui`). ZERO bespoke unapproved CSS or random component libraries.
5. [ ] **Centralized Logging & Error Handling**: Services MUST use `createLogger` and `createSafeHandler` from `@forge/sdk` (Google SRE standard structured JSON logs & RFC 7807 problem responses).
6. [ ] **Dedicated Turso DB Isolation**: Dedicated Turso (libSQL) database per Forge App. Micro-apps MUST NEVER query another app's database.
7. [ ] **Clean Package Aliases**: Imports must use `@forge/sdk`, `@forge/ui`, `@forge/types`. ZERO relative traversal sprawl (`../../..`).
8. [ ] **Folder Documentation (README per folder)**: Every single folder across the codebase MUST maintain its own descriptive `README.md`.
9. [ ] **Isolated Per-App Logs & 4-Pillar Observability**: Every microservice MUST maintain its own colocated `logs/` directory with `README.md` and `.gitignore`. Must implement 4 pillars (Dual-Probe Health, Browser Console, Docker Logs, Backend/DB Logs).
10. [ ] **ABSOLUTE ZERO AUTO-COMMITS (HARD BLOCKED)**: AI agents are STRICTLY FORBIDDEN from running `git commit` unless the user explicitly types `"commit changes"` or `"git commit"` in the CURRENT message. Past permissions do NOT carry over. Cleaning, refactoring, fixing, or auditing NEVER justifies committing.
11. [ ] **Per-Conversation Worklog Auto-Update**: Every conversation task completion MUST append strictly ONE single line to `logs/WORKLOGS.md` (`YYYY-MM-DD HH:mm | <brief summary>`) via `rtk bun scripts/append-worklog.ts "<summary>"`. When a git commit occurs, post-commit hook records ground truth to `logs/commits.jsonl`.
12. [ ] **AI-Driven Ignore & Attrib Governance**: Before staging, AI Agent MUST contextually audit all newly created files in session diff. If any cache, transient, build output, SQLite DB, or secret was introduced, ensure it is added to the canonical ignore/attrib definitions via `rtk bun scripts/sync-ignores.ts`.
13. [ ] **5-Tier Microservice Test Governance**: Every microservice across `apps/src/*` and `forge-apps/*` MUST maintain an isolated `test/` folder with required subtiers (`unit/`, `integration/`, `security/`, `contracts/`, `e2e/`). 100% Branch Coverage on Auth & RBAC; $\ge 90\%$ on business logic.
14. [ ] **AI Semantic Scenario Audit**: All critical security invariants (anti-brute force, token replay defense, tamper detection, cross-tenant isolation) MUST have explicit negative assertion tests.

---

## 🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD)

### 1. Correctness, Grounding & "No Guessing"
- **NEVER** hallucinate, assume, or invent APIs, database columns, schemas, or behaviors.
- **ALWAYS** inspect callers, schemas, types, and existing tests using Graphify (`.agents/rules/graphify.md`) and ripgrep before editing.

### 2. Strict File Size Governance & 500-Line Soft Cap
- **$\le 300$ lines**: Healthy modular standard.
- **$301 - 500$ lines**: Cohesion boundary. Allowed for state conductors and route dispatchers.
- **$> 500$ lines**: **HARD GATE BLOCKED** by pre-commit checks. Refactor into feature-colocated sub-modules unless exempt (e.g. multi-table Drizzle schema or test fixtures).

### 3. Strict UI Standard: Meta Astryx Design System (`@forge/ui`)
- **MANDATORY**: All UI views, cards, modals, tables, headers, and buttons across the platform MUST strictly use Meta Astryx design system tokens and component wrappers (`@forge/ui`).
- Strictly adhere to `--forge-*` CSS variables (`--forge-bg-root`, `--forge-bg-surface`, `--forge-bg-card`, `--forge-border`, `--forge-primary`, `--forge-accent`, `--forge-text-main`, `--forge-text-muted`).
- Zero horizontal scrolling down to 320px viewport. Modals, dropdowns, and overlays render with proper top-layer z-index and accessibility.

### 4. Centralized Structured Logging & RFC 7807 Error Boundaries
- **Google SRE Observability**: All platform services and micro-apps MUST use `@forge/sdk` (`createLogger` and `createSafeHandler`).
- Standardized JSON telemetry output with timestamp, severity, service tag, and trace IDs. Never leak raw stack traces to end users.

### 5. Multi-Tenant Data Isolation & Dedicated Turso DB per App
- Dedicated Turso (libSQL) database instance per Forge App. Apps MUST NEVER access or query another app's database.
- Non-negotiable `org_id` / `user_id` scoping across all portal queries and mutations.

### 6. Directional Architectural Boundaries & Clean Modularity
- Clean monorepo structure: `apps/src/` (Core Platform Services & Shared Libraries) $\longleftrightarrow$ `forge-apps/` (Independent Micro-Apps).
- **UI Layer**: Built with Meta Astryx components, never directly touches raw filesystem or database.

### 7. Clean Package Aliases (Zero Traversal Sprawl)
- All imports across the monorepo MUST use configured path aliases (`@forge/sdk`, `@forge/ui`, `@forge/types`).

### 8. Risk-Tiered 5-Tier Testing Rigor (3A Pattern)
- **Folder Structure**: Every service (`apps/src/*`, `forge-apps/*`) must house tests in `test/unit/`, `test/integration/`, `test/security/`, `test/contracts/`, `test/e2e/`.
- **100% Branch Coverage** required on Auth, RBAC, and Iframe Sandbox boundaries; $\ge 90\%$ on business logic.
- Mandatory **3A Pattern** (Arrange, Act, Assert) across all unit and integration tests.

### 9. Single-Location Dynamic Ingress & Absolute Zero Auto-Commits
- Ingress paths and ports are driven exclusively from `.env` via `@forge/sdk/registry` and `scripts/generate-proxy.ts`.
- **ABSOLUTE ZERO AUTO-COMMITS**: AI agents MUST NEVER run `git commit` under any circumstances (including cleanup, audit, refactoring, or testing tasks) unless the user explicitly requests `"commit changes"` in the active prompt. Treat unprompted `git commit` as a critical protocol violation.

### 10. Code Preservation, Observability & Per-Conversation Worklog Auto-Update
- **Comprehensive Header Comments & TSDoc**: Every file begins with standard header comment block; all exports have TSDoc descriptions.
- **Per-Conversation Worklog Auto-Update**: At the end of every conversation task, the AI agent MUST append strictly ONE single line to `logs/WORKLOGS.md` (`YYYY-MM-DD HH:mm | <brief summary>`) using `rtk bun scripts/append-worklog.ts "<summary>"`. When a git commit occurs, post-commit hook automatically logs commit metadata to `logs/commits.jsonl`.

---

## 🛠️ TECH STACK BASELINE (2026 LTS)
- **Runtime**: Bun v1.3.14 (Standalone portable inside `portables/bun/`) / Node 24 LTS.
- **Frontend / Framework**: Next.js 16 (App Router), React 19, TypeScript 5.
- **UI System**: Meta Astryx Design System (`@forge/ui`), CSS Variables (`--forge-*`).
- **Database & ORM**: Dedicated Turso (libSQL) per app, Drizzle ORM (`drizzle-orm/libsql`).
- **Reverse Proxy**: Caddy / Nginx gateway on Ports `80` & `443`.
- **Testing**: Vitest, Bun Test, Playwright E2E.

---

## 🧭 DOMAIN RULE ROUTER
- **Core System & Tooling**: [`.agents/rules/core.md`](file:///.agents/rules/core.md)
- **Architecture, Monorepo & DB**: [`.agents/rules/architecture.md`](file:///.agents/rules/architecture.md)
- **Frontend UI & Astryx Tokens**: [`.agents/rules/frontend-ui.md`](file:///.agents/rules/frontend-ui.md)
- **Client State & Storage (Google Standard)**: [`.agents/rules/frontend-state.md`](file:///.agents/rules/frontend-state.md)
- **Security & Zero-Trust**: [`.agents/rules/security-practices.md`](file:///.agents/rules/security-practices.md)
- **Testing Standards (5-Tier)**: [`.agents/rules/testing.md`](file:///.agents/rules/testing.md)
- **Graphify Knowledge Graph**: [`.agents/rules/graphify.md`](file:///.agents/rules/graphify.md)
- **RTK Token Optimization**: [`.agents/rules/rtk.md`](file:///.agents/rules/rtk.md)
- **Microservice Observability & Logs**: [`.agents/rules/observability.md`](file:///.agents/rules/observability.md)

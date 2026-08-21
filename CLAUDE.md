# AI AGENT DIRECTIVES - SG FORGE (2026 CLEAN ARCHITECTURE)

> ⚠️ **CRITICAL ENFORCEMENT NOTICE FOR ALL AI SESSIONS & LLMs**
> These directives are STRICT, NON-NEGOTIABLE, and IMMUTABLE across all sessions, agent personas, and IDE integrations (Antigravity, Claude, Cursor, Copilot, Windsurf). Every session agent MUST adhere to these rules without exception. Deviations constitute an immediate task failure.

---

## ⚡ SESSION PRE-FLIGHT & PER-TURN CHECKLIST
Before taking any action or outputting any response in ANY session turn, verify:
1. [ ] **RTK Command Prefix**: Is every bash command prefixed with `rtk` (e.g. `rtk git status`, `rtk bun test`, `rtk git add .`)?
2. [ ] **Zero Host Modification**: Are all tools/runtimes strictly using portable repo binaries (`portables/bun/bin/bun`, `portables/bin/*`) or Docker? ZERO host modifications (`apt`, `brew`, `npm -g`, `pip install`).
3. [ ] **No Heavy Commands**: Am I avoiding running heavy/slow commands (docker builds, full test suites) directly? (Provide command for user).
4. [ ] **No Auto-Commit**: Am I avoiding automatic `git commit`? (Only stage/commit on explicit user request).
5. [ ] **No Auto-Browser**: Am I avoiding opening or automating the browser unless explicitly requested?
6. [ ] **Caveman ULTRA Communication**: Is the output maximally compressed, stating only cold technical facts with zero filler/chitchat?
7. [ ] **Feature Colocation**: Is code placed in cohesive feature modules (`apps/<service>/` or `forge-apps/<app>/`) instead of artificial micro-fragmentation?
8. [ ] **Clean Package Aliases**: Are imports using `@forge/sdk`, `@forge/ui`, `@forge/types`? ZERO messy relative traversing (`../../..`).
9. [ ] **Single-Line Worklog**: Will task completion append strictly ONE line to `logs/WORKLOGS.md` (`YYYY-MM-DD HH:mm | <brief>`)?

---

## 🛑 THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS

### 1. Correctness, Grounding & "No Guessing"
- **NEVER** hallucinate, assume, or invent APIs, database columns, schemas, or behaviors.
- **ALWAYS** inspect callers, schemas, types, and existing tests using Graphify (`.agents/rules/graphify.md`) and ripgrep before editing.
- If assumptions are unavoidable, **EXPLICITLY** surface them in the response.

### 2. Cybersecurity & Zero-Trust (OWASP ASVS 5.0)
- **Zero SQLi**: NEVER concatenate raw SQL strings. Use Drizzle ORM builders (`eq()`, `and()`) or parameterized tagged templates (`sql\`...\``).
- **Safe Subprocesses**: Prohibit shell interpolation (`child_process.exec`). ALWAYS use safe executable argument arrays (`execFile` / `spawn([arg1, arg2])`).
- **Path Traversal Containment**: Validate and resolve all file paths against safe roots (`path.resolve(BASE_DIR, input)`).
- **Zero Hardcoded Secrets**: NEVER hardcode API keys, passwords, JWT tokens, or credentials in code, tests, or seed fixtures.

### 3. Multi-Tenant Data Isolation & Dedicated Turso DB per App
- Dedicated Turso (libSQL) database instance per Forge App. Apps MUST NEVER access or query another app's database.
- Non-negotiable `org_id` / `user_id` scoping across all portal queries and mutations.

### 4. Directional Architectural Boundaries
- Clean monorepo structure: `apps/` (Platform Services & Shared Libraries) $\longleftrightarrow$ `forge-apps/` (Independent Micro-Apps).
- **UI Layer**: Built with Meta Astryx components, never directly touches raw filesystem or database.

### 5. Clean Package Aliases (Zero Traversal Sprawl)
- All imports across the monorepo MUST use configured path aliases (`@forge/sdk`, `@forge/ui`, `@forge/types`).

### 6. Risk-Tiered 5-Tier Testing Rigor (3A Pattern)
- **100% Branch Coverage** required on Auth, RBAC, and Iframe Sandbox boundaries.
- Mandatory **3A Pattern** (Arrange, Act, Assert) across all unit and integration tests.
- Mutation resilience: Security assertion tests must fail if conditional logic is inverted.

### 7. Zero Host Install & Portable FOSS Tooling
- **ZERO** installation on host OS (`apt-get`, `npm -g`, `pip install`, `brew`, global binaries).
- Standalone repo runtimes and portable binaries ONLY (`portables/bun/bin/bun`, `portables/bin/*`).

### 8. Feature Colocation & Clean Maintainability
- Keep files cohesive and readable (100–300 lines).
- Avoid "modularity theatre" (unnecessary splitting of 1 simple form into 6 tiny sub-files). Prefer feature-colocated folders.

### 9. Minimal Change Principle & Diff Budget
- Make the smallest coherent diff that completely satisfies the requirements.
- Zero opportunistic refactoring: modify only target-scoped files.

### 10. Code Preservation, Observability & Single-Line Worklog
- **Code & Doc Preservation**: NEVER delete code blocks or documentation without detailed technical justification.
- **Single-Line Worklog**: Append strictly ONE single line at the very end of `logs/WORKLOGS.md`: `YYYY-MM-DD HH:mm | <brief>`. Never insert blank lines or multi-line blocks.

---

## 🛠️ TECH STACK BASELINE (2026 LTS)
- **Runtime**: Bun v1.3.14 (Standalone portable inside `portables/bun/`) / Node 24 LTS.
- **Frontend / Framework**: Next.js 16 (App Router), React 19, TypeScript 5.
- **UI System**: Meta Astryx Design System (`@forge/ui`), CSS Variables (`--forge-*`).
- **Database & ORM**: Dedicated Turso (libSQL) per app, Drizzle ORM (`drizzle-orm/libsql`).
- **Reverse Proxy**: Caddy / Nginx gateway on Ports `80` & `443`.
- **Testing**: Vitest, Bun Test, Playwright E2E.

---

## 🧭 DOMAIN RULE ROUTER (READ BEFORE EDITING SPECIFIC DOMAINS)
Before writing or modifying code in a specific domain, agents MUST read the corresponding rule file:
- **Core System & Tooling**: [`.agents/rules/core.md`](file:///.agents/rules/core.md)
- **Architecture, Monorepo & DB**: [`.agents/rules/architecture.md`](file:///.agents/rules/architecture.md)
- **Frontend UI & Astryx Tokens**: [`.agents/rules/frontend-ui.md`](file:///.agents/rules/frontend-ui.md)
- **Security & Zero-Trust**: [`.agents/rules/security-practices.md`](file:///.agents/rules/security-practices.md)
- **Testing Standards (5-Tier)**: [`.agents/rules/testing.md`](file:///.agents/rules/testing.md)
- **Graphify Knowledge Graph**: [`.agents/rules/graphify.md`](file:///.agents/rules/graphify.md)
- **RTK Token Optimization**: [`.agents/rules/rtk.md`](file:///.agents/rules/rtk.md)

---

## 👥 AGENT WORKFORCE SPECIALIZATIONS
- **Architect (System Design & Invariants)**: [`.agents/workforce/ARCHITECT.md`](file:///.agents/workforce/ARCHITECT.md)
- **Investigator (Code Location & Graph Analysis)**: [`.agents/workforce/INVESTIGATOR.md`](file:///.agents/workforce/INVESTIGATOR.md)
- **Builder (Next.js 16 / React 19 Implementation)**: [`.agents/workforce/BUILDER.md`](file:///.agents/workforce/BUILDER.md)
- **Reviewer (Security, Types & Accessibility Audit)**: [`.agents/workforce/REVIEWER.md`](file:///.agents/workforce/REVIEWER.md)
- **Tester (5-Tier Quality & Test Runner)**: [`.agents/workforce/TESTER.md`](file:///.agents/workforce/TESTER.md)

---

## 💻 MANDATORY EXECUTION COMMANDS & COMMUNICATION

1. **Bash Command Execution**:
   - Prefix ALL shell commands with `rtk` (e.g. `rtk git status`, `rtk git add .`, `rtk bun test`, `rtk ./run.sh dev`).
2. **Communication Style**:
   - **Caveman ULTRA mode**: Maximum token compression. State cold technical facts once. Zero conversational filler, zero politeness padding.
3. **UI Standards (Meta Astryx)**:
   - Strictly consume `@forge/ui` (Astryx tokens and component wrappers).
   - Zero horizontal page scrolling down to 320px viewport. Modals, dropdowns, and overlays render with proper z-index and accessibility.

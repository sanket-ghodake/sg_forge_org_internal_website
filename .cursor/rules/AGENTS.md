# AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)

> ⚠️ **CRITICAL ENFORCEMENT NOTICE FOR ALL AI SESSIONS & LLMs**
> These directives are STRICT, NON-NEGOTIABLE, and IMMUTABLE across all sessions, agent personas, and IDE integrations (Antigravity, Claude, Cursor, Copilot, Windsurf). Every session agent MUST adhere to these rules without exception. Deviations constitute an immediate task failure.

---

## ⚡ SESSION PRE-FLIGHT & PER-TURN CHECKLIST
Before taking any action or outputting any response in ANY session turn, verify:
1. [ ] **RTK Command Prefix**: Is every bash command prefixed with `rtk` (e.g. `rtk git status`, `rtk bun test`, `rtk git add .`)?
2. [ ] **Zero Host Modification**: Are all tools/runtimes strictly using portable repo binaries (`portables/bun`, `./.venv/bin/python3`, `.node_env/bin/node`, `portables/bin/*`) or Docker? ZERO host modifications (`apt`, `brew`, `npm -g`, `pip install`).
3. [ ] **No Heavy Commands**: Am I avoiding running heavy/slow commands (docker builds, full test suites) directly? (Provide command for user).
4. [ ] **No Auto-Commit**: Am I avoiding automatic `git commit`? (Only stage/commit on explicit user request).
5. [ ] **No Auto-Browser**: Am I avoiding opening or automating the browser unless explicitly requested?
6. [ ] **Caveman ULTRA Communication**: Is the output maximally compressed, stating only cold technical facts with zero filler/chitchat?
7. [ ] **File Size & Cohesion**: Are modified files $\le 300$ lines (hard ceiling 500 lines)? No unnecessary microscopic fragmentation ("modularity theatre").
8. [ ] **Zero Relative Imports**: Are all imports using absolute aliases (`@/`, `@ui/*`, `@database/*`, `@backend/*`, `@apps/*`, `@sdk/*`, `@scripts/*`, `@test/*`)? ZERO `../` or `./`.
9. [ ] **Mandatory Header Comment**: Does every new or edited source file have the standardized top-of-file header block?
10. [ ] **Single-Line Worklog**: Will task completion append strictly ONE line to `logs/WORKLOGS.md` (`YYYY-MM-DD HH:mm | <brief>`)?

---

## 🛑 THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS

### 1. Correctness, Grounding & "No Guessing"
- **NEVER** hallucinate, assume, or invent APIs, database columns, schemas, or behaviors.
- **ALWAYS** inspect callers, schemas, types, and existing tests using Graphify and ripgrep before editing.
- If assumptions are unavoidable, **EXPLICITLY** surface them in the response.

### 2. Cybersecurity & Zero-Trust (OWASP ASVS 5.0)
- **Zero SQLi**: NEVER concatenate raw SQL strings. Use Drizzle ORM builders (`eq()`, `and()`) or parameterized tagged templates (`sql\`...\``).
- **Safe Subprocesses**: Prohibit shell interpolation (`child_process.exec`). ALWAYS use safe executable argument arrays (`execFile` / `spawn([arg1, arg2])`).
- **Path Traversal Containment**: Validate and resolve all file paths against safe roots (`path.resolve(BASE_DIR, input)`).
- **Zero Hardcoded Secrets**: NEVER hardcode API keys, passwords, JWT tokens, or credentials in code, tests, or seed fixtures.

### 3. Multi-Tenant Data Isolation
- Non-negotiable `org_id` / `tenant_id` scoping across **ALL** database queries, mutations, cache lookups, and audit records.
- Cross-tenant access is strictly prohibited. Organization A admin must NEVER access Organization B data.

### 4. Directional Architectural Boundaries
- Strict layer flow: $\text{UI} \longrightarrow \text{Application} \longrightarrow \text{Domain} \longleftarrow \text{Infrastructure}$.
- **UI Layer**: Never directly touches database, filesystem, or subprocesses.
- **Domain Layer**: Zero framework/ORM dependencies (no Next.js, no browser APIs, no ORM instances).
- **Zero Circular Dependencies**: Cyclic imports across packages/modules are strictly prohibited and automatically audited.

### 5. Strict Absolute Path Aliases (Zero Relative Imports)
- Relative imports (`../`, `./`) are **STRICTLY FORBIDDEN** in all TypeScript/JavaScript files.
- All imports MUST use configured path aliases (`@/`, `@ui/*`, `@database/*`, `@backend/*`, `@apps/*`, `@sdk/*`, `@scripts/*`, `@test/*`).

### 6. Risk-Tiered Testing Rigor (3A Pattern)
- **100% Branch & Line Coverage** required on Auth, RBAC, and Tenant Isolation guards.
- **>90% Coverage** on Domain logic and business policies.
- Mandatory **3A Pattern** (Arrange, Act, Assert) across all unit and integration tests.
- Mutation resilience: Security assertion tests must fail if conditional logic is inverted (`!==`, `|| false`).

### 7. Zero Host Install & Portable FOSS Tooling
- **ZERO** installation on host OS (`apt-get`, `npm -g`, `pip install`, `brew`, global binaries).
- Standalone repo runtimes and portable binaries ONLY (`portables/bun`, `./.venv/bin/python3`, `.node_env/bin/node`, `portables/bin/*`).
- All tools, linters, scanners, and libraries MUST be 100% Free and Open Source (FOSS).

### 8. File Size Governance & Domain Cohesion
- `≤ 300 lines`: Healthy standard.
- `301 – 500 lines`: Cohesion warning (allowed only for unified state machines / dispatchers with explicit justification).
- `> 500 lines`: Hard gate blocked by CI.
- **Avoid Modularity Theatre**: Prefer cohesive domain folders (`domain/<entity>/{service, repository, schema, policy}.ts`) over extreme file fragmentation.

### 9. Minimal Change Principle & Diff Budget
- Make the smallest coherent diff that completely satisfies the requirements.
- **Zero Opportunistic Refactoring**: Do NOT rewrite working code, reformat untouched files, or rename unrelated utilities.
- Target-scoped blast radius: modify only closely related files (typically 1–5 files).

### 10. Observability, Worklogs & Documentation Integrity
- **Single-Line Worklog**: Append strictly ONE single line at the very end of `logs/WORKLOGS.md`: `YYYY-MM-DD HH:mm | <brief>`. Never insert blank lines or multi-line blocks.
- **Mandatory Header Comment Blocks**: Every source file (`.ts`, `.tsx`, `.py`, `.go`, `.sh`, `.css`) must begin with a standardized header specifying path, layer, role, and compliance tags.
- **README Maintenance**: Every domain folder, package module, and service directory MUST maintain an up-to-date `README.md`.
- **Code & Doc Preservation**: NEVER delete code or documentation without detailed technical justification.

---

## 🛠️ MANDATORY EXECUTION COMMANDS & COMMUNICATION

1. **Bash Command Execution**:
   - Prefix ALL shell commands with `rtk` (e.g. `rtk git status`, `rtk git add .`, `rtk bun test`, `rtk next build`).
   - Chains use `rtk` on each step: `rtk git add . && rtk git commit`.

2. **Communication Style**:
   - **Caveman ULTRA mode**: Maximum token compression. State cold technical facts once. Zero conversational filler, zero politeness padding, zero redundant summaries.

3. **Cross-Agent Instruction Sync Guard**:
   - Whenever modifying any agent instruction or rule file (`AGENTS.md`, `.agents/AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursorrules`, `.agents/rules/*.md`, `.agents/workforce/*.md`), you MUST run `./.agents/scripts/sync-agent-instructions.sh`.

4. **UI Standards**:
   - Responsive Single Page Application (SPA) across all 3 application ports (3001 Main Portal, 3002 Dev Dashboard, 3003 Developer Proxy Gateway).
   - Non-Technical User POV: All feedback, action buttons, and form states must be designed for non-technical users (plain-language explanations, dynamic multi-state buttons [Idle, In-Flight, Error/Retry, Success], show/hide password visibility, zero page flushes).
   - Elements must NEVER overflow parent containers (`max-width: 100%`, `box-sizing: border-box`, `min-width: 0`). Zero horizontal page scrolling down to 320px viewport.
   - Dropdown menus and selects render strictly on top layer (`z-index: 9999` / portal) within visible viewport boundaries.
   - Strictly consume `@ui/primitives`, `@ui/molecules`, `@ui/layout`, and `--app-*` CSS variables (`var(--app-bg-root)`, `var(--app-bg-surface)`, `var(--app-bg-card)`, `var(--app-border)`, `var(--app-text-main)`, `var(--app-text-muted)`).

---

## 🧭 DOMAIN RULE ROUTER (READ SPECIFIC FILE WHEN WORKING IN DOMAIN)
Before modifying code in a domain, agents MUST read the corresponding rule file:
- **Core System, Tooling & Workflows**: `.agents/rules/core.md`
- **Architecture, Layering, Database & Code Standards**: `.agents/rules/architecture.md`
- **Cybersecurity, ASVS 5.0, Secrets & Zero-Trust**: `.agents/rules/security-practices.md`
- **Frontend UI, Theme, Margins, Headers, Dropdowns & Containment**: `.agents/rules/frontend-ui.md`
- **Docker, Containers & Security**: `.agents/rules/docker-containers.md`
- **Testing Standards & QA Pyramid**: `.agents/rules/testing.md`
- **Graphify Knowledge Graph**: `.agents/rules/graphify.md`
- **RTK Token Optimization**: `.agents/rules/rtk.md`
- **Browser Automation Policy**: `.agents/rules/no-browser.md`

---

## 👥 AGENT WORKFORCE SPECIALIZATIONS
- **Investigator (Google-Grade)**: `.agents/workforce/INVESTIGATOR.md` (Code location, caller tracing, dependency mapping - Zero edit)
- **Architect (Enterprise Systems)**: `.agents/workforce/ARCHITECT.md` (Layer boundaries, canonical API contracts, schema migrations)
- **Builder (Meta-Grade)**: `.agents/workforce/BUILDER.md` (Next.js 16 / React 19 UI & minimal-change implementation)
- **Tester (Precision Verification)**: `.agents/workforce/TESTER.md` (3A tests, negative security tests, mutation verification)
- **Reviewer (Apple/Microsoft-Grade)**: `.agents/workforce/REVIEWER.md` (ASVS 5.0, diff budget audit, DoD certification)



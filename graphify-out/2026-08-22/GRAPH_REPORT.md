# Graph Report - org_website_clone  (2026-08-21)

## Corpus Check
- 78 files · ~65,304 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 505 nodes · 498 edges · 66 communities (45 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ac10476`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_dev-dashboardserver.ts|dev-dashboard/server.ts]]
- [[_COMMUNITY_schema.ts|schema.ts]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_uipackage.json|ui/package.json]]
- [[_COMMUNITY_Card|Card]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_SG Forge (Modular Corporate Portal Engine) - v0.1.0|SG Forge (Modular Corporate Portal Engine) - v0.1.0]]
- [[_COMMUNITY_appIdpage.tsx|[appId]/page.tsx]]
- [[_COMMUNITY_connection.ts|connection.ts]]
- [[_COMMUNITY_Button|Button]]
- [[_COMMUNITY_developerpage.tsx|developer/page.tsx]]
- [[_COMMUNITY_getSession|getSession]]
- [[_COMMUNITY_AdminPanel.tsx|AdminPanel.tsx]]
- [[_COMMUNITY_ui-molecules.test.ts|ui-molecules.test.ts]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_suitesindex.ts|suites/index.ts]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_ui-organisms.test.ts|ui-organisms.test.ts]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_telemetry-dashboardapp.json|telemetry-dashboard/app.json]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_run.sh script|run.sh script]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_reference-expensespackage.json|reference-expenses/package.json]]
- [[_COMMUNITY_manager-operationsapp.json|manager-operations/app.json]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_exclude|exclude]]
- [[_COMMUNITY_🛠 Core Components|🛠 Core Components]]
- [[_COMMUNITY_pull_request_template|pull_request_template.md]]
- [[_COMMUNITY_AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)|AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)]]
- [[_COMMUNITY_AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)|AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)]]
- [[_COMMUNITY_AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)|AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)]]
- [[_COMMUNITY_WORKLOGS|WORKLOGS.md]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `getAstryxStyles()` - 16 edges
3. `getAstryxHeaderHtml()` - 16 edges
4. `createSafeHandler()` - 13 edges
5. `🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD)` - 11 edges
6. `🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD)` - 11 edges
7. `🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD)` - 11 edges
8. `🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD)` - 11 edges
9. `🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD)` - 11 edges
10. `ForgeLogger` - 8 edges

## Surprising Connections (you probably didn't know these)
- `generateCaddyfile()` --calls--> `loadServiceRegistry()`  [EXTRACTED]
  scripts/generate-proxy.ts → apps/src/sdk/src/registry.ts
- `renderAppHtml()` --calls--> `getAstryxStyles()`  [INFERRED]
  forge-apps/expenses/src/server.ts → apps/src/ui/src/index.ts
- `renderAppHtml()` --calls--> `getAstryxStyles()`  [INFERRED]
  forge-apps/telemetry/src/server.ts → apps/src/ui/src/index.ts
- `renderAppHtml()` --calls--> `getAstryxHeaderHtml()`  [INFERRED]
  forge-apps/expenses/src/server.ts → apps/src/ui/src/index.ts
- `renderAppHtml()` --calls--> `getAstryxHeaderHtml()`  [INFERRED]
  forge-apps/telemetry/src/server.ts → apps/src/ui/src/index.ts

## Import Cycles
- 1-file cycle: `apps/src/sdk/src/index.ts -> apps/src/sdk/src/index.ts`

## Communities (66 total, 21 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.12
Nodes (15): devDependencies, @types/node, typescript, name, private, scripts, clean, create-app (+7 more)

### Community 1 - "dev-dashboard/server.ts"
Cohesion: 0.17
Nodes (11): dependencies, @forge/sdk, @forge/types, @forge/ui, name, private, scripts, dev (+3 more)

### Community 2 - "schema.ts"
Cohesion: 0.17
Nodes (11): dependencies, @forge/sdk, @forge/types, @forge/ui, name, private, scripts, build (+3 more)

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): dependencies, @forge/sdk, @forge/types, @forge/ui, name, private, scripts, build (+3 more)

### Community 4 - "ui/package.json"
Cohesion: 0.18
Nodes (10): dependencies, @forge/types, @forge/ui, name, private, scripts, build, dev (+2 more)

### Community 5 - "Card"
Cohesion: 0.18
Nodes (10): dependencies, @forge/types, @forge/ui, name, private, scripts, build, dev (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (10): 1. 🔀 Dynamic Ingress Sync (`scripts/generate-proxy.ts`), 2. ⚡ Biome (`v2.2.0`), 2. 🔒 Gitleaks (`v8.30.1`), 🛡️ 2-Tier Automated Pre-Commit Quality Gate, 3. 🧹 Knip (`v6.32.2`), 4. 🚀 Autocannon (`v7.15.0`), 5. 📦 Repomix (`v1.10.2`), 6. 📏 SCC (`v3.4.0`) (+2 more)

### Community 7 - "SG Forge (Modular Corporate Portal Engine) - v0.1.0"
Cohesion: 0.25
Nodes (7): ⚡ 1-Command Developer Onboarding (Zero Host Install), Linux, macOS & WSL2, 🧭 Master Documentation & Architecture, 🛡️ Pre-Commit Quality Gate & Diagnostics, 📁 Repository Layout, 🚀 SG Forge - Modular Corporate Portal & Micro-App Sandbox Engine (v2.0.0), Windows Native (CMD & PowerShell)

### Community 8 - "[appId]/page.tsx"
Cohesion: 0.20
Nodes (9): dependencies, @forge/types, name, private, scripts, build, dev, type (+1 more)

### Community 9 - "connection.ts"
Cohesion: 0.20
Nodes (9): 03. Security, RBAC & Data Integrity Blueprint, 1.1 Iframe Security Flags, 1.2 Scoped JWT Token Issuer, 1. Zero-Trust Sandboxing Model, 2. Hierarchical Role-Based Access Control (RBAC), 3.1 Zero SQL Injection Guarantee, 3.2 Automated Turso DB Snapshots & Backups, 3. Data Integrity, Backups & Disaster Recovery (+1 more)

### Community 10 - "Button"
Cohesion: 0.20
Nodes (9): 04. Testing Strategy & Quality Assurance Pyramid, 1. The 5-Tier Testing Pyramid, 2. Testing Specifications by Tier, 3. Test Runner CLI Workflow, Tier 1: Unit & Component Testing, Tier 2: Integration & Database Testing, Tier 3: Contract & SDK Bridge Testing, Tier 4: End-to-End (E2E) Browser Journeys (Playwright) (+1 more)

### Community 11 - "developer/page.tsx"
Cohesion: 0.22
Nodes (8): 02. Forge Apps Specification & Polyglot SDK, 1. Forge Micro-App Architecture & Anatomy, 2. Dedicated Database per App (Turso / libSQL), 3. The Forge SDK Bridge Protocol, 4. App Access & Request Flow, SDK Client-Side Usage (`@forge/sdk`), Standardized Folder Anatomy Inside Every App (`forge-apps/<app-name>/`), Why Dedicated Turso DB per App?

### Community 12 - "getSession"
Cohesion: 0.22
Nodes (8): 05. Developer Experience & AI Maintainability, 1. The 1-Command Developer Experience, 2.1 Feature Colocation vs Over-Modularization, 2.2 Standard UI Component Contracts (Astryx UI), 2.3 Explicit Zod & Drizzle Contracts, 2. Why This Architecture Is AI-Agent Optimized, 3. Scaffolding a New Forge App (Workflow), CLI Command Reference

### Community 13 - "AdminPanel.tsx"
Cohesion: 0.29
Nodes (6): 01. Platform Architecture & Service Topology, 1. Network Topology & Port Mapping, 2. Core Service Boundaries, 3. Reverse Proxy Configuration Strategy, Key Responsibilities of Each Core App, Port Allocation Matrix

### Community 14 - "ui-molecules.test.ts"
Cohesion: 0.33
Nodes (5): 📌 Executive Summary, ⚡ High-Level Traffic & Interaction Flow, 🧭 Master Documentation Index, 🚀 SG Forge - Platform Master Blueprint & Specification, 🏛️ System Topology Infographic

### Community 15 - "compilerOptions"
Cohesion: 0.33
Nodes (5): main, name, type, types, version

### Community 16 - "suites/index.ts"
Cohesion: 0.08
Nodes (35): logger, PORT, logger, PORT, logger, PORT, logger, PORT (+27 more)

### Community 19 - "ui-organisms.test.ts"
Cohesion: 0.33
Nodes (5): main, name, type, types, version

### Community 24 - "Community 24"
Cohesion: 0.13
Nodes (9): ForgeAppManifest, ForgeClient, ForgeClientOptions, ForgeLogger, LogEntry, LogLevel, PostMessageEvent, UserContext (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.14
Nodes (13): AGENTS_REPORTS_DIR, agentsReportPath, latestCommitReportPath, LOGS_REPORTS_DIR, monthlyDir, monthlyReportPath, now, REPO_ROOT (+5 more)

### Community 26 - "Community 26"
Cohesion: 0.50
Nodes (3): 🛡️ SG Forge Pre-Commit Verification Gate Report, 🛠️ Tier 1: Deterministic Engine Checks (Checked by Logic & Open Source Tools), 🧠 Tier 2: AI Agent Semantic & Architecture Quality Checks (Token-Efficient Digest)

### Community 27 - "Community 27"
Cohesion: 0.50
Nodes (3): 🛡️ SG Forge Pre-Commit Verification Gate Report, 🛠️ Tier 1: Deterministic Engine Checks (Checked by Logic & Open Source Tools), 🧠 Tier 2: AI Agent Semantic & Architecture Quality Checks (Token-Efficient Digest)

### Community 28 - "Community 28"
Cohesion: 0.50
Nodes (3): 🛡️ SG Forge Pre-Commit Verification Gate Report, 🛠️ Tier 1: Deterministic Engine Checks (Checked by Logic & Open Source Tools), 🧠 Tier 2: AI Agent Semantic & Architecture Quality Checks (Token-Efficient Digest)

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (3): 🛡️ SG Forge Pre-Commit Verification Gate Report, 🛠️ Tier 1: Deterministic Engine Checks (Checked by Logic & Open Source Tools), 🧠 Tier 2: AI Agent Semantic & Architecture Quality Checks (Token-Efficient Digest)

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (3): 🛡️ SG Forge Pre-Commit Verification Gate Report, 🛠️ Tier 1: Deterministic Engine Checks (Checked by Logic & Open Source Tools), 🧠 Tier 2: AI Agent Semantic & Architecture Quality Checks (Token-Efficient Digest)

### Community 31 - "Community 31"
Cohesion: 0.50
Nodes (3): 🔒 Central Identity & Auth Service (`@forge/auth`), 🚀 Features, 🏃 Local Execution

### Community 32 - "Community 32"
Cohesion: 0.50
Nodes (3): 📊 Developer Monitoring Dashboard (`@forge/dev-dashboard`), 🚀 Features, 🏃 Local Execution

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (3): 🛡️ SG Forge Pre-Commit Verification Gate Report, 🛠️ Tier 1: Deterministic Engine Checks (Checked by Logic & Open Source Tools), 🧠 Tier 2: AI Agent Semantic & Architecture Quality Checks (Token-Efficient Digest)

### Community 34 - "Community 34"
Cohesion: 0.50
Nodes (3): 🛠️ Developer Hub & SDK Playground (`@forge/dev-hub`), 🚀 Features, 🏃 Local Execution

### Community 35 - "Community 35"
Cohesion: 0.50
Nodes (3): 🚀 Features, 🌐 Landing Discovery Hub (`@forge/landing`), 🏃 Local Execution

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (3): 🚀 Features, 🏃 Local Execution, 🧭 Main Workspace & 2D Org Canvas (`@forge/portal`)

### Community 39 - "telemetry-dashboard/app.json"
Cohesion: 0.25
Nodes (7): dependencies, @forge/types, main, name, type, types, version

### Community 41 - "run.sh script"
Cohesion: 0.67
Nodes (3): run.sh script, PATH, show_help()

### Community 49 - "Community 49"
Cohesion: 0.50
Nodes (3): 📜 Audit Logs, Worklogs & Commit Ledger (`logs/`), Commit Record JSON Schema, Files & Structure

### Community 54 - "Community 54"
Cohesion: 0.24
Nodes (10): CommitRecord, COMMITS_JSONL_PATH, CommitStats, extractAffectedApps(), LOGS_DIR, parseStats(), recordLatestCommit(), REPO_ROOT (+2 more)

### Community 55 - "Community 55"
Cohesion: 0.50
Nodes (3): 🛡️ SG Forge Pre-Commit Verification Gate Report, 🛠️ Tier 1: Deterministic Engine Checks (Checked by Logic & Open Source Tools), 🧠 Tier 2: AI Agent Semantic & Architecture Quality Checks (Token-Efficient Digest)

### Community 57 - "reference-expenses/package.json"
Cohesion: 0.25
Nodes (7): 🚀 1-Command Bootstrap, 📦 Bundled Portable Tool Matrix (Latest Stable 2026 LTS Releases), Linux, macOS & WSL2:, ⚡ Prerequisites, 🧰 SG Forge 2.0 - Portable Developer Setup Guide, 🩺 System Diagnostics & Health Check, Windows Native:

### Community 65 - "manager-operations/app.json"
Cohesion: 0.12
Nodes (15): 10. Code Preservation, Observability & Automated Commit Ledger, 1. Correctness, Grounding & "No Guessing", ⚡ 1. PRE-FLIGHT & PRE-COMMIT VERIFICATION GATE (10 CHECKS), 2. Strict File Size Governance & 500-Line Soft Cap, 🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD), 3. Strict UI Standard: Meta Astryx Design System (`@forge/ui`), 4. Centralized Structured Logging & RFC 7807 Error Boundaries, 5. Multi-Tenant Data Isolation & Dedicated Turso DB per App (+7 more)

### Community 72 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowJs, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx (+14 more)

### Community 87 - "exclude"
Cohesion: 0.15
Nodes (12): 1. 2026 Technology Stack Overview, 2. Portable Runtimes & Zero-Host-Pollution Strategy, 3. Standalone Runtime Setup Commands, 4. Standalone Code Analysis, Benchmarking & Tooling Setup, 5. Worklog Audit System & Hooks, 6. Multi-IDE Instruction Synchronization, 7. Development Commands Summary, Developer Setup Guide — Org Website (2026 Standalone Stack) (+4 more)

### Community 110 - "🛠 Core Components"
Cohesion: 0.12
Nodes (15): 10. Code Preservation, Observability & Automated Commit Ledger, 1. Correctness, Grounding & "No Guessing", ⚡ 1. PRE-FLIGHT & PRE-COMMIT VERIFICATION GATE (10 CHECKS), 2. Strict File Size Governance & 500-Line Soft Cap, 🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD), 3. Strict UI Standard: Meta Astryx Design System (`@forge/ui`), 4. Centralized Structured Logging & RFC 7807 Error Boundaries, 5. Multi-Tenant Data Isolation & Dedicated Turso DB per App (+7 more)

### Community 114 - "pull_request_template.md"
Cohesion: 0.50
Nodes (3): Architectural Layer, Description, Quality & Compliance Checklist

### Community 163 - "AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)"
Cohesion: 0.12
Nodes (15): 10. Code Preservation, Observability & Automated Commit Ledger, 1. Correctness, Grounding & "No Guessing", ⚡ 1. PRE-FLIGHT & PRE-COMMIT VERIFICATION GATE (10 CHECKS), 2. Strict File Size Governance & 500-Line Soft Cap, 🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD), 3. Strict UI Standard: Meta Astryx Design System (`@forge/ui`), 4. Centralized Structured Logging & RFC 7807 Error Boundaries, 5. Multi-Tenant Data Isolation & Dedicated Turso DB per App (+7 more)

### Community 165 - "AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)"
Cohesion: 0.12
Nodes (15): 10. Code Preservation, Observability & Automated Commit Ledger, 1. Correctness, Grounding & "No Guessing", ⚡ 1. PRE-FLIGHT & PRE-COMMIT VERIFICATION GATE (10 CHECKS), 2. Strict File Size Governance & 500-Line Soft Cap, 🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD), 3. Strict UI Standard: Meta Astryx Design System (`@forge/ui`), 4. Centralized Structured Logging & RFC 7807 Error Boundaries, 5. Multi-Tenant Data Isolation & Dedicated Turso DB per App (+7 more)

### Community 174 - "AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)"
Cohesion: 0.12
Nodes (15): 10. Code Preservation, Observability & Automated Commit Ledger, 1. Correctness, Grounding & "No Guessing", ⚡ 1. PRE-FLIGHT & PRE-COMMIT VERIFICATION GATE (10 CHECKS), 2. Strict File Size Governance & 500-Line Soft Cap, 🛑 2. THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS (GOOGLE & META STANDARD), 3. Strict UI Standard: Meta Astryx Design System (`@forge/ui`), 4. Centralized Structured Logging & RFC 7807 Error Boundaries, 5. Multi-Tenant Data Isolation & Dedicated Turso DB per App (+7 more)

## Knowledge Gaps
- **307 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+302 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createSafeHandler()` connect `suites/index.ts` to `Community 24`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getAstryxStyles()` (e.g. with `renderAppHtml()` and `renderAppHtml()`) actually correct?**
  _`getAstryxStyles()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `getAstryxHeaderHtml()` (e.g. with `renderAppHtml()` and `renderAppHtml()`) actually correct?**
  _`getAstryxHeaderHtml()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `createSafeHandler()` (e.g. with `startAuthServer()` and `startDevDashboardServer()`) actually correct?**
  _`createSafeHandler()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _307 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `suites/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07510204081632653 - nodes in this community are weakly interconnected._
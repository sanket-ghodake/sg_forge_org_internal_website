# Graph Report - org_website_clone  (2026-08-21)

## Corpus Check
- 38 files · ~51,499 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 334 nodes · 302 edges · 36 communities (29 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7e3049b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_dev-dashboardserver.ts|dev-dashboard/server.ts]]
- [[_COMMUNITY_schema.ts|schema.ts]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_uipackage.json|ui/package.json]]
- [[_COMMUNITY_Card|Card]]
- [[_COMMUNITY_Zero-Host-Install Portable Developer & Agent Ecosystem|Zero-Host-Install Portable Developer & Agent Ecosystem]]
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
- [[_COMMUNITY_telemetry-dashboardapp.json|telemetry-dashboard/app.json]]
- [[_COMMUNITY_run.sh script|run.sh script]]
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
2. `🛑 THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS` - 11 edges
3. `🛑 THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS` - 11 edges
4. `🛑 THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS` - 11 edges
5. `🛑 THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS` - 11 edges
6. `🛑 THE 10 NON-NEGOTIABLE ENGINEERING INVARIANTS` - 11 edges
7. `Developer Setup Guide — Org Website (2026 Standalone Stack)` - 8 edges
8. `scripts` - 7 edges
9. `AI AGENT DIRECTIVES - SG FORGE (2026 CLEAN ARCHITECTURE)` - 7 edges
10. `AI AGENT DIRECTIVES - SG FORGE (2026 CLEAN ARCHITECTURE)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `ForgeClient` --references--> `UserContext`  [EXTRACTED]
  apps/sdk/src/index.ts → apps/types/src/index.ts

## Import Cycles
- 1-file cycle: `apps/sdk/src/index.ts -> apps/sdk/src/index.ts`

## Communities (36 total, 7 thin omitted)

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

### Community 6 - "Zero-Host-Install Portable Developer & Agent Ecosystem"
Cohesion: 0.24
Nodes (6): ForgeAppManifest, ForgeClient, ForgeClientOptions, PostMessageEvent, UserContext, UserRole

### Community 7 - "SG Forge (Modular Corporate Portal Engine) - v0.1.0"
Cohesion: 0.25
Nodes (7): ⚡ 1-Command Developer Onboarding (Zero Host Install), Linux, macOS & WSL2, 🧭 Master Documentation & Architecture, 📁 Repository Layout, 🚀 SG Forge - Modular Corporate Portal & Micro-App Sandbox Engine (v2.0.0), 🩺 System Diagnostics & Health Check, Windows Native (CMD & PowerShell)

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

### Community 17 - "Community 17"
Cohesion: 0.50
Nodes (3): ⚡ Running Test Suites, 🧪 SG Forge 5-Tier Testing Suite, 📁 Testing Directory Structure

### Community 19 - "ui-organisms.test.ts"
Cohesion: 0.33
Nodes (5): main, name, type, types, version

### Community 39 - "telemetry-dashboard/app.json"
Cohesion: 0.25
Nodes (7): dependencies, @forge/types, main, name, type, types, version

### Community 41 - "run.sh script"
Cohesion: 0.67
Nodes (3): run.sh script, PATH, show_help()

### Community 57 - "reference-expenses/package.json"
Cohesion: 0.22
Nodes (8): 1. Operating System Compatibility Matrix, 2. 1-Command Developer Onboarding, 3. Bundled Portable Tooling & Binaries, 4. System Diagnostics, Linux, macOS & WSL2, Tool Command Quick Reference, Windows Native (CMD / PowerShell), Zero-Host-Install Portable Developer & Agent Ecosystem

### Community 65 - "manager-operations/app.json"
Cohesion: 0.11
Nodes (17): 10. Code Preservation, Observability & Single-Line Worklog, 1. Correctness, Grounding & "No Guessing", 2. Cybersecurity & Zero-Trust (OWASP ASVS 5.0), 3. Multi-Tenant Data Isolation & Dedicated Turso DB per App, 4. Directional Architectural Boundaries, 5. Clean Package Aliases (Zero Traversal Sprawl), 6. Risk-Tiered 5-Tier Testing Rigor (3A Pattern), 7. Zero Host Install & Portable FOSS Tooling (+9 more)

### Community 72 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowJs, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx (+14 more)

### Community 87 - "exclude"
Cohesion: 0.15
Nodes (12): 1. 2026 Technology Stack Overview, 2. Portable Runtimes & Zero-Host-Pollution Strategy, 3. Standalone Runtime Setup Commands, 4. Standalone Code Analysis, Benchmarking & Tooling Setup, 5. Worklog Audit System & Hooks, 6. Multi-IDE Instruction Synchronization, 7. Development Commands Summary, Developer Setup Guide — Org Website (2026 Standalone Stack) (+4 more)

### Community 110 - "🛠 Core Components"
Cohesion: 0.12
Nodes (16): 10. Observability, Worklogs & Documentation Integrity, 1. Correctness, Grounding & "No Guessing", 2. Cybersecurity & Zero-Trust (OWASP ASVS 5.0), 3. Multi-Tenant Data Isolation, 4. Directional Architectural Boundaries, 5. Strict Absolute Path Aliases (Zero Relative Imports), 6. Risk-Tiered Testing Rigor (3A Pattern), 7. Zero Host Install & Portable FOSS Tooling (+8 more)

### Community 114 - "pull_request_template.md"
Cohesion: 0.50
Nodes (3): Architectural Layer, Description, Quality & Compliance Checklist

### Community 163 - "AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)"
Cohesion: 0.11
Nodes (17): 10. Code Preservation, Observability & Single-Line Worklog, 1. Correctness, Grounding & "No Guessing", 2. Cybersecurity & Zero-Trust (OWASP ASVS 5.0), 3. Multi-Tenant Data Isolation & Dedicated Turso DB per App, 4. Directional Architectural Boundaries, 5. Clean Package Aliases (Zero Traversal Sprawl), 6. Risk-Tiered 5-Tier Testing Rigor (3A Pattern), 7. Zero Host Install & Portable FOSS Tooling (+9 more)

### Community 165 - "AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)"
Cohesion: 0.11
Nodes (17): 10. Code Preservation, Observability & Single-Line Worklog, 1. Correctness, Grounding & "No Guessing", 2. Cybersecurity & Zero-Trust (OWASP ASVS 5.0), 3. Multi-Tenant Data Isolation & Dedicated Turso DB per App, 4. Directional Architectural Boundaries, 5. Clean Package Aliases (Zero Traversal Sprawl), 6. Risk-Tiered 5-Tier Testing Rigor (3A Pattern), 7. Zero Host Install & Portable FOSS Tooling (+9 more)

### Community 174 - "AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)"
Cohesion: 0.12
Nodes (16): 10. Observability, Worklogs & Documentation Integrity, 1. Correctness, Grounding & "No Guessing", 2. Cybersecurity & Zero-Trust (OWASP ASVS 5.0), 3. Multi-Tenant Data Isolation, 4. Directional Architectural Boundaries, 5. Strict Absolute Path Aliases (Zero Relative Imports), 6. Risk-Tiered Testing Rigor (3A Pattern), 7. Zero Host Install & Portable FOSS Tooling (+8 more)

## Knowledge Gaps
- **234 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+229 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `name`, `version`, `private` to the rest of the system?**
  _234 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `manager-operations/app.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `🛠 Core Components` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `AI AGENT DIRECTIVES - ORG_WEBSITE (2026 TECH STACK)` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
# 🚀 SG Forge - Modular Corporate Portal & Micro-App Sandbox Engine (v2.0.0)

SG Forge is a modern, installable, and extensible organizational workspace portal. It allows organizations to host a visual semantic Org Canvas, centralize identity and hierarchical RBAC, and run isolated polyglot micro-frontends (Forge Apps in TS, Python, Go) with dedicated Turso (libSQL) database instances.

---

## 📊 Monorepo Architecture & Code Metrics Matrix

*Generated using portable toolchain (`portables/bin/scc` & `scripts/verify-gate.ts`)*

| Package / Service | Type / Category | Ingress Port | Ingress Route | Files | Total Lines | Code (SLOC) | Comments | Complexity | 5-Tier Tests | Database Instance | Status |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: |
| **[`@forge/landing`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/landing)** | Platform Service | `:3000` | `/` | 14 | 456 | 332 | 57 | 32 | 7 | Stateless | **Passing** ✅ |
| **[`@forge/portal`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/portal)** | Platform Service (SPA) | `:3001` | `/portal` | 49 | 6,338 | 5,324 | 372 | 952 | 25 | `portal.db` | **Passing** ✅ |
| **[`@forge/dev-dashboard`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/dev-dashboard)** | Platform Service (Studio) | `:3002` | `/devcenter` | 98 | 16,571 | 13,576 | 1,258 | 2,821 | 113 | `dev_dashboard.db` | **Passing** ✅ |
| **[`@forge/dev-hub`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/dev-hub)** | Platform Service (Docs) | `:3003` | `/gateway` | 30 | 2,397 | 1,908 | 242 | 181 | 17 | Stateless (SDK Mesh) | **Passing** ✅ |
| **[`@forge/auth`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/auth)** | Platform Service (Identity) | `:3004` | `/auth` | 47 | 4,261 | 3,333 | 337 | 559 | 37 | `auth.db` | **Passing** ✅ |
| **[`@forge/sdk`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/sdk)** | Core Library | N/A | Library | 22 | 1,911 | 1,478 | 194 | 395 | 26 | Turso SQLite Manager | **Passing** ✅ |
| **[`@forge/ui`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/ui)** | UI Design System | N/A | Library | 24 | 2,782 | 2,114 | 310 | 258 | 19 | Stateless (Astryx UI) | **Passing** ✅ |
| **[`@forge/types`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/types)** | Domain Contracts | N/A | Library | 3 | 139 | 117 | 4 | 30 | N/A | Stateless (TS Types) | **Passing** ✅ |
| **[`expenses`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/expenses)** | Micro-App (Approvals) | `:8085` | `/apps/expenses` | 11 | 425 | 316 | 47 | 32 | 5 | `expenses.db` | **Passing** ✅ |
| **[`billing`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/billing)** | Micro-App (Ledger) | `:8086` | `/apps/billing` | 13 | 489 | 363 | 53 | 29 | 5 | `billing.db` | **Passing** ✅ |
| **[`telemetry`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/telemetry)** | Micro-App (Real-Time) | `:8087` | `/apps/telemetry` | 13 | 429 | 313 | 50 | 19 | 5 | `telemetry.db` | **Passing** ✅ |
| **[`app-template`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/app-template)** | Reference Template | `:8099` | Dynamic | 20 | 471 | 339 | 53 | 26 | 10 | `template.db` | **Passing** ✅ |
| **SG Forge Monorepo Total** | **Entire Workspace** | **`:80 / :443`** | **`/`** | **548** | **108,743** | **98,264** | **3,595** | **6,012** | **300 Pass (0 Fail)** | **Dedicated Turso DBs** | **100% Verified** ✅ |

---

## ⚡ 1-Command Developer Onboarding (Zero Host Install)

Any developer or AI agent can clone the repository and run **one single command** to bootstrap the entire environment (no `apt`, `brew`, `pip install`, or `npm -g` required):

### Linux, macOS & WSL2
```bash
./run.sh setup
./run.sh dev
```

### Windows Native (CMD & PowerShell)
```cmd
run.bat setup
run.bat dev
```

---

## 🧭 Master Documentation & Architecture

* **[Organization Deployment & Quickstart Guide](file:///home/sanket/Desktop/Sanket/org_website_clone/docs/ORGANIZATION_DEPLOYMENT_AND_QUICKSTART_GUIDE.md)**: Production deployment instructions, `.env` configuration, port mapping, and operational commands.
* **[Portable Open-Source Toolchain Manual](file:///home/sanket/Desktop/Sanket/org_website_clone/docs/tools/PORTABLE_TOOLCHAIN.md)**: Complete guide to Gitleaks, Biome, Knip, Autocannon, Repomix, SCC, RTK, and Astryx CLI.
* **[Developer Workflow & Testing Guide](file:///home/sanket/Desktop/Sanket/org_website_clone/docs/setup/WORKFLOW_SETUP.md)**: Daily developer workflows, 5-tier testing pyramid, and engineering standards.
* **[Security & Zero-Trust Architecture](file:///home/sanket/Desktop/Sanket/org_website_clone/docs/security/README.md)**: Zero-trust iframe sandboxing, scoped JWT tokens, supply chain defense, and ASVS 5.0 invariants.
* **[API Contracts & SDK Specifications](file:///home/sanket/Desktop/Sanket/org_website_clone/docs/api/README.md)**: OpenAPI 3.1 specifications, SDK bridge, and multi-app integration contracts.
* **[Zero-Host Portable Setup Guide](file:///home/sanket/Desktop/Sanket/org_website_clone/docs/setup/PORTABLE_SETUP.md)**: Cross-platform portable runtimes (`bun`, `rtk`, `astryx`, `caveman`).

---

## 📁 Repository Layout

```text
.
├── apps/                          # 🏢 Core Platform Codebase
│   ├── src/                       # 📦 Platform Services & Shared Libraries
│   │   ├── landing/               # 1. Public Landing Page (Port 80/443 root)
│   │   ├── auth/                  # 2. Central Auth & JWT Token Issuer
│   │   ├── portal/                # 3. Main Workspace & Org Canvas (Port 3001)
│   │   ├── dev-dashboard/         # 4. Developer Monitoring Dashboard (Port 3002)
│   │   ├── dev-hub/               # 5. Developer Hub & Playground (Port 3003)
│   │   ├── sdk/                   # 6. Forge SDK bridge library (@forge/sdk)
│   │   ├── ui/                    # 7. Meta Astryx UI tokens & components (@forge/ui)
│   │   └── types/                 # 8. Shared TypeScript domain models (@forge/types)
│   └── test/                      # 🧪 5-Tier Test Suites (unit, integration, e2e, contract, security)
│
├── forge-apps/                    # 🧩 Independent Micro-Apps (Dockerized)
│   ├── expenses/                  # Expense Approval Engine (Port 8085)
│   ├── billing/                   # Invoicing & Billing Service (Port 8086)
│   ├── telemetry/                 # Live Telemetry Dashboard (Port 8087)
│   └── app-template/              # 1-Command Scaffolding Reference (Port 8099)
│
├── docker/                        # 🐳 Docker Environments
│   ├── dev/                       # docker-compose.yml (Development - Hot Reloading)
│   └── prod/                      # docker-compose.yml (Production)
│
├── proxy/                         # 🔀 Unified Reverse Proxy (Caddy / Nginx)
│   └── Caddyfile
│
├── portables/                     # 🧰 Standalone FOSS Runtimes (Zero Host Modification)
│   ├── bin/                       # gitleaks, biome, knip, hadolint, autocannon, repomix, scc, rtk, astryx
│   └── bun/                       # Portable Bun v1.3.14 (LTS 2026)
│
├── run.sh                         # ⚡ Linux / macOS / WSL2 Orchestration CLI
└── run.bat                        # ⚡ Windows Native Orchestration Script
```

---

## 🛡️ Pre-Commit Quality Gate & Diagnostics

```bash
# Run 2-Tier Quality Gate (15 Deterministic Checks + 7 AI Agent Semantic Audits):
./run.sh verify

# Run System Diagnostics & Health Checks:
./run.sh doctor

# Run HTTP Latency Benchmark:
./run.sh benchmark
```

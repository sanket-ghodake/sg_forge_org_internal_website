# 🚀 SG Forge - Modular Corporate Portal & Micro-App Sandbox Engine (v2.0.0)

SG Forge is a modern, installable, and extensible organizational workspace portal. It allows organizations to host a visual semantic Org Canvas, centralize identity and hierarchical RBAC, and run isolated polyglot micro-frontends (Forge Apps in TS, Python, Go) with dedicated Turso (libSQL) database instances.

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

* **[Master Blueprint & Specifications](file:///home/sanket/Desktop/Sanket/org_website_clone/idea/README.md)**: Full architecture breakdown, diagrams, and design specifications.
* **[System Topology & Port Routing](file:///home/sanket/Desktop/Sanket/org_website_clone/idea/01_ARCHITECTURE.md)**: Reverse proxy ingress (Port 80/443), portal (3001), dev dashboard (3002), dev hub (3003), and micro-apps (8085+).
* **[Forge Micro-Apps Spec](file:///home/sanket/Desktop/Sanket/org_website_clone/idea/02_FORGE_APPS_SPEC.md)**: App anatomy, dedicated Turso DB per app, and the Forge SDK bridge.
* **[Security & RBAC Blueprint](file:///home/sanket/Desktop/Sanket/org_website_clone/idea/03_SECURITY_AND_RBAC.md)**: Zero-trust iframe sandboxing, scoped JWT tokens, and automated snapshots.
* **[Testing Strategy](file:///home/sanket/Desktop/Sanket/org_website_clone/idea/04_TESTING_STRATEGY.md)**: 5-Tier Quality Assurance pyramid and automated test runners.
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
│   └── app-template/              # Standard starter template
│
├── docker/                        # 🐳 Docker Environments
│   ├── dev/                       # docker-compose.yml (Development)
│   └── prod/                      # docker-compose.yml (Production)
│
├── proxy/                         # 🔀 Unified Reverse Proxy (Caddy / Nginx)
│   └── Caddyfile
│
├── portables/                     # 🧰 Standalone FOSS Runtimes (Zero Host Modification)
│   ├── bun/                       # Portable Bun v1.3.14 (LTS 2026)
│   ├── rtk/                       # RTK Token Optimizer v0.42.3
│   ├── astryx/                    # Meta Astryx UI Tooling
│   └── caveman/                   # Caveman Ultra Compression CLI
│
├── idea/                          # 💡 Master System Blueprints & Infographics
├── run.sh                         # ⚡ Linux / macOS / WSL2 Orchestration CLI
└── run.bat                        # ⚡ Windows Native Orchestration Script
```

---

## 🩺 System Diagnostics & Health Check

```bash
./run.sh doctor
```

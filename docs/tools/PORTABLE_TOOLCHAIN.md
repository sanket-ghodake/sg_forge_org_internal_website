# 🧰 SG Forge 2.0 - Portable Open-Source Toolchain Manual

> **Zero Host Install Architecture (2026 LTS Baseline)**: All tools run directly from portable repo binaries (`portables/bin/*`) or portable Bun. ZERO installation required on host OS (`apt`, `brew`, `pip install`, `npm -g`).

---

## 🧭 Master Toolchain & Latest Stable Version Catalog (2026 LTS)

| Tool | Repo Bundled | Latest Stable Upstream | Category | Purpose | CLI Command | Speed |
| :--- | :---: | :---: | :--- | :--- | :--- | :---: |
| **Bun** | `v1.3.14` | `v1.3.14` | Runtime | Ultra-fast TypeScript & JavaScript execution runtime | `./portables/bun/bin/bun` | `< 10ms` |
| **RTK** | `v0.42.3` | `v0.42.3` | AI Optimizer | Terminal output token compression engine | `rtk <command>` | `< 2ms` |
| **Meta Astryx** | `v2.0.0` | `v2.0.0` | Design System | Enterprise UI design tokens & theme engine | `astryx status` | `< 5ms` |
| **Gitleaks** | `v8.30.1` | `v8.30.1` | Security | 160+ API key & secret scanner | `./run.sh secrets` | `< 10ms` |
| **Biome** | `v2.2.0` | `v2.2.0` | Code Quality | Ultra-fast Rust AST linter & code formatter | `./run.sh lint` | `< 15ms` |
| **Knip** | `v6.32.2` | `v6.32.2` | Architecture | Monorepo dead code & unexported symbol auditor | `./run.sh deadcode` | `< 40ms` |
| **Hadolint** | `v2.12.0` | `v2.12.0` | Containers | Dockerfile & OCI container standards validator | `bun portables/bin/hadolint` | `< 10ms` |
| **Autocannon** | `v7.15.0` | `v7.15.0` | Performance | Reverse proxy HTTP latency benchmark (< 10ms target) | `./run.sh benchmark [url]` | `< 500ms` |
| **Repomix** | `v1.10.2` | `v1.10.2` | AI Tooling | Token-compressed AI context packager | `./run.sh pack` | `< 50ms` |
| **SCC** | `v3.4.0` | `v3.4.0` | Metrics | Lines of code & 500-line soft cap counter | `scc apps/` | `< 5ms` |
| **Hyperfine** | `v1.18.0` | `v1.18.0` | Benchmarking | Statistical execution time benchmark engine | `hyperfine --warmup 3` | `< 100ms` |
| **Caveman** | `v1.0.0` | `v1.0.0` | AI Communication | Agent token compression CLI (Ultra mode) | `caveman status` | `< 2ms` |
| **Graphify** | `v0.5.0` | `v0.5.0` | Knowledge Graph | AST knowledge graph & dependency visualizer | `graphify update .` | `< 30ms` |
| **Caddy Server** | `v2.11.4` | `v2.11.4` | Reverse Proxy | Ingress gateway on Ports 80 & 443 | Docker Container | `< 1ms` |

---

## 🛠️ Detailed Usage & Command Reference

### 1. 🔒 Gitleaks (`v8.30.1`)
* **What it does**: Audits staged git diffs and source files for high-entropy tokens (AWS, Stripe, OpenAI, Google keys, RSA keys).
* **Execution**:
  ```bash
  ./run.sh secrets
  ```

### 2. ⚡ Biome (`v2.2.0`)
* **What it does**: 50x-100x faster than legacy ESLint/Prettier. Enforces Google/Meta coding standards and strict equality.
* **Execution**:
  ```bash
  ./run.sh lint
  ```

### 3. 🧹 Knip (`v6.32.2`)
* **What it does**: Analyzes monorepo workspaces (`apps/src/*`, `forge-apps/*`) for dead files and unused exports.
* **Execution**:
  ```bash
  ./run.sh deadcode
  ```

### 4. 🚀 Autocannon (`v7.15.0`)
* **What it does**: Fires concurrent requests against Caddy reverse proxy on Port 80/443 to guarantee `< 10ms` routing.
* **Execution**:
  ```bash
  ./run.sh benchmark http://localhost/
  ./run.sh benchmark http://localhost/portal
  ```

### 5. 📦 Repomix (`v1.10.2`)
* **What it does**: Bundles codebase context into an XML package (`repomix-output.xml`) for AI agents, cutting context overhead.
* **Execution**:
  ```bash
  ./run.sh pack
  ```

### 6. 📏 SCC (`v3.4.0`)
* **What it does**: Scans physical lines of code, blank lines, and comments to enforce the **500-line soft cap**.
* **Execution**:
  ```bash
  ./portables/bin/scc apps/src/
  ```

---

## 🛡️ 2-Tier Automated Pre-Commit Quality Gate

Run the complete 12-gate deterministic verification suite:
```bash
./run.sh verify
```
Structured Markdown audit report is saved automatically to `.agents/reports/VERIFICATION_REPORT.md`.

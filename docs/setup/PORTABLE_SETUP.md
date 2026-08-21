# 🧰 SG Forge 2.0 - Portable Developer Setup Guide

This repository is engineered with a **Zero-Host-Modification Policy**. All development runtimes, testing frameworks, linters, analyzers, and benchmarking tools run from pre-bundled portable repo binaries or isolated Docker containers.

---

## ⚡ Prerequisites

* **Linux (x86_64 / ARM64), macOS (Apple Silicon / Intel), or Windows (WSL2 / Native CMD)**.
* **Git** installed on host.
* **Docker** (Optional, for running full containerized stack).

---

## 📦 Bundled Portable Tool Matrix (Latest Stable 2026 LTS Releases)

| Component | Active Version | Upstream Latest | Path / Binary | Host Install Needed? |
| :--- | :---: | :---: | :--- | :---: |
| **Bun Runtime** | `v1.3.14` | `v1.3.14` | `portables/bun/bin/bun` | ❌ No |
| **RTK Token Optimizer** | `v0.42.3` | `v0.42.3` | `portables/bin/rtk` | ❌ No |
| **Meta Astryx CLI** | `v2.0.0` | `v2.0.0` | `portables/bin/astryx` | ❌ No |
| **Gitleaks Secret Scanner** | `v8.30.1` | `v8.30.1` | `portables/bin/gitleaks` | ❌ No |
| **Biome Fast Linter** | `v2.2.0` | `v2.2.0` | `portables/bin/biome` | ❌ No |
| **Knip Dead Code Auditor** | `v6.32.2` | `v6.32.2` | `portables/bin/knip` | ❌ No |
| **Hadolint Docker Linter** | `v2.12.0` | `v2.12.0` | `portables/bin/hadolint` | ❌ No |
| **Autocannon Benchmark** | `v7.15.0` | `v7.15.0` | `portables/bin/autocannon` | ❌ No |
| **Repomix Context Packager** | `v1.10.2` | `v1.10.2` | `portables/bin/repomix` | ❌ No |
| **SCC Complexity Counter** | `v3.4.0` | `v3.4.0` | `portables/bin/scc` | ❌ No |
| **Hyperfine Benchmarker** | `v1.18.0` | `v1.18.0` | `portables/bin/hyperfine` | ❌ No |
| **Caveman CLI** | `v1.0.0` | `v1.0.0` | `portables/bin/caveman` | ❌ No |
| **Graphify Knowledge Graph** | `v0.5.0` | `v0.5.0` | `portables/bin/graphify` | ❌ No |

---

## 🚀 1-Command Bootstrap

### Linux, macOS & WSL2:
```bash
./run.sh setup
./run.sh dev
```

### Windows Native:
```cmd
run.bat setup
run.bat dev
```

---

## 🩺 System Diagnostics & Health Check

```bash
./run.sh doctor
```

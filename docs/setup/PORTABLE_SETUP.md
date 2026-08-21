# Zero-Host-Install Portable Developer & Agent Ecosystem

The SG Forge platform implements a strict **Zero-Host-Install** architecture. Developers and AI agents can clone the repository on any operating system and immediately develop, test, run AI agents, and build micro-apps without running package managers against the host operating system (`no apt-get`, `no brew`, `no pip install`, `no npm -g`).

---

## 1. Operating System Compatibility Matrix

| Operating System | Architecture | Primary Shell | Bootstrap Command | Execution Engine |
| :--- | :--- | :--- | :--- | :--- |
| **Linux (Ubuntu, Debian, Fedora, Arch, Alpine)** | x86_64 / aarch64 | `bash` / `zsh` | `./run.sh setup` | Native Portable Bun / Local `.venv` / Docker |
| **macOS (Apple Silicon M1-M4)** | arm64 | `zsh` / `bash` | `./run.sh setup` | Native Darwin Bun / Local `.venv` / Docker |
| **macOS (Intel)** | x86_64 | `zsh` / `bash` | `./run.sh setup` | Native Darwin Bun / Local `.venv` / Docker |
| **Windows 10 / 11 (WSL 2)** | x86_64 / arm64 | `bash` | `./run.sh setup` | WSL Linux Portable Subsystem |
| **Windows 10 / 11 (Native)** | x86_64 | PowerShell / `cmd` | `run.bat setup` | Win64 Portable Bun / `run.bat` |

---

## 2. 1-Command Developer Onboarding

### Linux, macOS & WSL2
```bash
# 1. Clone the repository
git clone https://github.com/sanket-ghodake/sg-forge.git
cd sg-forge

# 2. Run automated bootstrap
./run.sh setup

# 3. Launch development environment
./run.sh dev
```

### Windows Native (CMD / PowerShell)
```cmd
:: 1. Clone repository
git clone https://github.com/sanket-ghodake/sg-forge.git
cd sg-forge

:: 2. Run Windows automated portable setup
run.bat setup

:: 3. Launch stack
run.bat dev
```

---

## 3. Bundled Portable Tooling & Binaries

All dependencies and runtimes reside strictly inside `portables/`:

```text
portables/
├── bun/bin/bun                # Standalone Bun runtime binary (v1.3.14 LTS)
├── rtk/bin/rtk                # RTK token optimizer binary (v0.42.3)
├── astryx/                    # Meta Astryx Design System CLI
├── caveman/                   # Caveman Ultra token compression CLI
└── bin/                       # Executable path wrappers (astryx, caveman, rtk, scc, tree)
```

### Tool Command Quick Reference

| Tool | CLI Command | Purpose |
| :--- | :--- | :--- |
| **Bun** | `bun` or `./portables/bun/bin/bun` | Fast JS/TS runtime, package manager, and test runner. |
| **RTK** | `rtk <cmd>` or `./portables/bin/rtk` | Token optimizer and output compressor for AI agents. |
| **Meta Astryx** | `astryx` or `./portables/bin/astryx` | Scaffold & validate accessible Meta Astryx UI components. |
| **Caveman** | `caveman` or `./portables/bin/caveman` | Token compression controller for AI agent turns. |

---

## 4. System Diagnostics

Verify all portable runtimes and environment readiness:

```bash
./run.sh doctor
```

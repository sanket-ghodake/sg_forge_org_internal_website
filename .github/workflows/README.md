# SG Forge CI/CD Workflows

This directory contains the GitHub Actions workflow configurations for the SG Forge enterprise platform.

## Architecture

SG Forge enforces a **single, unified manual pipeline** ([pipeline.yml](file:///.github/workflows/pipeline.yml)) with step-by-step DAG (Directed Acyclic Graph) nodes rather than fragmented separate workflows.

```
Manual Dispatch (workflow_dispatch)
  │
  ├──► [Node 1: Secrets & File Hygiene] (< 10s)
  │      │
  │      ▼
  ├──► [Node 2: Typecheck & 21-Gate Verification] (< 25s)
  │      │
  │      ▼
  ├──► [Node 3: 5-Tier Test Suites] (< 30s)
  │      │
  │      ├───────────────┬───────────────┐
  │      ▼               ▼               │
  ├──► [Node 4: CodeQL] [Node 5: SBOM]   │
  │      │               │               │
  │      └───────────────┴───────────────┘
  │                      │
  │                      ▼
  └──► [Node 6: Pipeline Summary & Receipt]
```

## How to Trigger

This workflow is configured with `workflow_dispatch` **only** to prevent unnecessary runner minutes on every commit. It can be triggered on demand:

### 1. Via GitHub Web Interface
1. Go to the repository's **Actions** tab.
2. Select **SG Forge Unified CI/CD Pipeline** in the left sidebar.
3. Click **Run workflow**.
4. Select the target branch and choose whether to run optional deep scans (`run_codeql`, `run_sbom`).

### 2. Via GitHub CLI (`gh`)
```bash
# Run full pipeline with all nodes
gh workflow run pipeline.yml --ref main

# Run ultra-fast (<30s) gate without CodeQL or SBOM
gh workflow run pipeline.yml --ref main -f run_codeql=false -f run_sbom=false
```

## Performance & Invariant Optimizations

- **Deterministic 21-Gate Parity**: Node 2 executes `scripts/verify-gate.ts`, providing 100% parity with local pre-commit checks.
- **Bun Cache Keying**: Caches `~/.bun/install/cache` against `bun.lock`, enabling sub-2-second installs.
- **Fail-Fast Hierarchy**: Halts in $< 10$ seconds if secret leaks or syntax issues exist before running heavy analysis.
- **Zero OS Host Modifications**: Portable Bun runtime (1.3.14) with frozen lockfile validation.

# SG Forge CI/CD Workflows

This directory contains the GitHub Actions workflow configurations for the SG Forge enterprise platform.

## Architecture

SG Forge enforces a **single, unified pipeline** ([pipeline.yml](file:///.github/workflows/pipeline.yml)) running as one streamlined, end-to-end job in a single runner environment:

```
[SG Forge Unified CI/CD Pipeline]
  ├── 1. Checkout Code & Setup Bun Runtime (1.3.14)
  ├── 2. Ensure Executable Permissions on All Portables & Scripts
  ├── 3. Frozen Lockfile Install (with Bun Cache) & Environment Setup
  ├── 4. Gitleaks Secret Audit (160+ Token Rules)
  ├── 5. TypeScript Static Compilation (tsc --noEmit)
  ├── 6. Deterministic 27-Gate Quality Verification (verify-gate.ts)
  ├── 7. Full 5-Tier Test Suites (bun test across all microservices)
  ├── 8. CycloneDX 1.5 SBOM Generation & Artifact Upload
  └── 9. Optional CodeQL Deep Security SAST Analysis
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

- **Deterministic 27-Gate Parity**: Node 2 executes `scripts/verify-gate.ts`, providing 100% parity with local pre-commit checks.
- **Bun Cache Keying**: Caches `~/.bun/install/cache` against `bun.lock`, enabling sub-2-second installs.
- **Fail-Fast Hierarchy**: Halts in $< 10$ seconds if secret leaks or syntax issues exist before running heavy analysis.
- **Zero OS Host Modifications**: Portable Bun runtime (1.3.14) with frozen lockfile validation.

---
description: Unified Agent & Developer Verification Quality Gate (Google & Meta Standard)
---

# Unified Verification Quality Gate

Use this workflow before completing any feature, refactoring, or bugfix to guarantee zero production gaps and strict compliance with repository directives.

## Step 1: Strict TypeScript Typecheck
Verify all frontend and backend TypeScript project configs compile with zero errors:
```bash
rtk tsc --noEmit -p core/src/frontend/tsconfig.json && rtk tsc --noEmit
```

## Step 2: Architecture & File Size Compliance Suite
Run the automated compliance tests to verify that no component exceeds 300 lines, imports use aliases, and design tokens are properly consumed:
```bash
rtk bun test test/unit/file-size-guard.test.ts test/unit/architecture-compliance.test.ts test/unit/relativeImports.test.ts
```

## Step 3: Domain Unit & Integration Test Suites
Run all domain sub-view and conductor test suites:
```bash
rtk bun test test/unit/admin-views.test.ts test/unit/launchpad-views.test.ts test/unit/devcenter-views.test.ts test/integration/conductor-integration.test.ts test/integration/authGuard.test.ts
```

## Step 4: Synchronize Multi-Agent Instructions (Rule 9)
Ensure all agent instructions remain identical across `AGENTS.md`, `.agents/AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`:
```bash
./.agents/scripts/sync-agent-instructions.sh
```

## Step 5: Validate Worklog Integrity (Rule 7)
Verify that `logs/WORKLOGS.md` conforms strictly to the atomic single-line format:
```bash
./.agents/hooks/validate-worklog.sh
```

## Step 6: Append Work Log Entry (Rule 7)
Append exactly one single-line summary of changes:
```bash
./.agents/hooks/append-log.sh "<brief summary of task accomplishments>"
```

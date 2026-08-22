#!/usr/bin/env bash
# ==============================================================================
# SG Forge - Git Post-Commit Automated Log & Ledger Hook (Option B: Auto-Amend)
# ==============================================================================
set -e

# Prevent infinite recursion when amending log files into the commit
if [ "${FORGE_AMENDING_LOG:-0}" = "1" ]; then
    exit 0
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Run automated commit logger using portable Bun runtime
BUN_BIN="bun"
if [ -f "$REPO_ROOT/portables/bun/bin/bun" ]; then
    BUN_BIN="$REPO_ROOT/portables/bun/bin/bun"
fi

"$BUN_BIN" run scripts/log-commit.ts

# Option B: If log files are modified, amend them into the commit cleanly
LOGS_DIRTY=$(git status --porcelain logs/commits.jsonl logs/WORKLOGS.md 2>/dev/null || true)

if [ -n "$LOGS_DIRTY" ]; then
    export FORGE_AMENDING_LOG=1
    git add logs/commits.jsonl logs/WORKLOGS.md
    git commit --amend --no-edit --no-verify
fi

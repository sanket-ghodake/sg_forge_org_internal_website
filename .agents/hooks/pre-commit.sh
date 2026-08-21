#!/usr/bin/env bash
# ==============================================================================
# SG Forge - Git Pre-Commit AI Agent Quality Gate Hook
# ==============================================================================
set -e

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

echo "⚡ [Git Pre-Commit Hook] Running SG Forge Quality Gate..."
"$REPO_ROOT/portables/bun/bin/bun" run "$REPO_ROOT/scripts/verify-gate.ts"

# Automatically stage generated verification reports into the current atomic commit
if [ -d "$REPO_ROOT/logs/reports" ]; then
    git add "$REPO_ROOT/logs/reports"
fi

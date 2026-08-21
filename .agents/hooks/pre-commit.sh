#!/usr/bin/env bash
# ==============================================================================
# SG Forge - Git Pre-Commit AI Agent Quality Gate Hook
# ==============================================================================
set -e

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

echo "⚡ [Git Hook] Running SG Forge Pre-Commit Quality Gate..."
"$REPO_ROOT/portables/bun/bin/bun" run "$REPO_ROOT/scripts/verify-gate.ts"

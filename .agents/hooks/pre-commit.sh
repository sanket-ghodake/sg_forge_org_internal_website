#!/usr/bin/env bash
# ==============================================================================
# SG Forge - Git Pre-Commit AI Agent Quality Gate Hook
# ==============================================================================
set -e

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

echo "⚡ [Git Pre-Commit Hook] Running SG Forge Quality Gate (12 Deterministic Gates)..."

# Determine bun runtime
BUN_BIN="bun"
if [ -f "$REPO_ROOT/portables/bun/bin/bun" ]; then
    BUN_BIN="$REPO_ROOT/portables/bun/bin/bun"
fi

# Run pre-commit quality gate. Exit with non-zero on failure to strictly block git commit.
if ! "$BUN_BIN" run "$REPO_ROOT/scripts/verify-gate.ts"; then
    echo "❌ [PRE-COMMIT GATE FAILED] Git commit aborted. Fix all errors above before committing."
    exit 1
fi

# Automatically stage updated Graphify outputs if git staging is active
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git add "$REPO_ROOT/graphify-out/graph.json" "$REPO_ROOT/graphify-out/graph.html" "$REPO_ROOT/graphify-out/GRAPH_REPORT.md" "$REPO_ROOT/graphify-out/manifest.json" 2>/dev/null || true
fi


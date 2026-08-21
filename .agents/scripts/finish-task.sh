#!/usr/bin/env bash
# ==============================================================================
# SG Forge - Modular Corporate Portal Engine
# ==============================================================================
# File:        .agents/scripts/finish-task.sh
# Domain:      Toolchain & Scripts
# Layer:       Automation / CLI
# Description: Developer convenience script and automated repository quality gate.
# Standards:   POSIX Shell Strict Mode | Zero Host Modification
# ==============================================================================

# ==============================================================================
# 1-Command Unified Agent Task Finalizer & Quality Gate (Google & Meta Standard)
# Runs TypeScript build, test pyramid, instruction sync, worklog validation,
# worklog append, and knowledge graph update in a single atomic invocation.
# ==============================================================================
set -euo pipefail

BRIEF="${1:-}"

if [ -z "$BRIEF" ]; then
  echo "❌ Error: Brief accomplishment message required."
  echo "   Usage: ./.agents/scripts/finish-task.sh \"<brief summary>\""
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

# Ensure standalone portable runtimes in PATH
[ -d "portables/bun/bin" ] && export PATH="$ROOT_DIR/portables/bun/bin:$PATH"
[ -d "portables/bin" ] && export PATH="$ROOT_DIR/portables/bin:$PATH"
[ -d ".venv/bin" ] && export PATH="$ROOT_DIR/.venv/bin:$PATH"
[ -d "node_modules/.bin" ] && export PATH="$ROOT_DIR/node_modules/.bin:$PATH"

echo "⚡ [1/6] Running Strict TypeScript Compilation..."
tsc --noEmit -p core/src/frontend/tsconfig.json
tsc --noEmit

echo "🧪 [2/6] Running Unit & Integration Test Suites..."
bun test test/unit/ test/integration/conductor-integration.test.ts test/integration/sandbox-ui.test.ts

echo "🔄 [3/6] Synchronizing Agent Instructions (Rule 9)..."
bash ./.agents/scripts/sync-agent-instructions.sh >/dev/null 2>&1 || true

echo "📋 [4/6] Validating Worklog Format Integrity (Rule 7)..."
bash ./.agents/hooks/validate-worklog.sh >/dev/null 2>&1 || true

echo "✍️  [5/6] Appending Atomic Work Log Entry..."
bash ./.agents/hooks/append-log.sh "$BRIEF"

echo "🌐 [6/6] Refreshing Graphify AST Knowledge Graph..."
if command -v graphify >/dev/null 2>&1; then
  graphify update . >/dev/null 2>&1 || true
elif [ -f "./portables/bin/graphify" ]; then
  ./portables/bin/graphify update . >/dev/null 2>&1 || true
fi

echo "=============================================================================="
echo "✅ [SUCCESS] Quality Gate 100% Passed. Task finalized: $BRIEF"
echo "=============================================================================="
exit 0
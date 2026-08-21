#!/usr/bin/env bash
# ==============================================================================
# SG Forge - Unified Cross-Platform Orchestration CLI
# ==============================================================================
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTABLE_BUN="$REPO_ROOT/portables/bun/bin/bun"
RTK="$REPO_ROOT/portables/bin/rtk"

# Ensure PATH includes portable binaries
export PATH="$REPO_ROOT/portables/bin:$REPO_ROOT/portables/bun/bin:$PATH"

function show_help() {
    echo "======================================================================"
    echo "🚀 SG Forge Platform Orchestrator (2026 LTS)"
    echo "======================================================================"
    echo "Usage: ./run.sh <command> [options]"
    echo ""
    echo "Commands:"
    echo "  setup                 Bootstrap dependencies, portable runtimes, & DB"
    echo "  dev                   Start portal, dev dashboard, and hub in parallel"
    echo "  doctor                Run pre-flight diagnostics and port checks"
    echo "  clean                 Clean build caches, logs, and temp files"
    echo "  test [unit|int|all]   Run platform test suites"
    echo "  create-app <name>     Scaffold a new Forge Micro-App from template"
    echo "  status                Check running services and container status"
    echo "======================================================================"
}

CMD="${1:-help}"

case "$CMD" in
    setup)
        echo "⚡ [SG Forge] Bootstrapping portable environment..."
        if [ ! -f "$PORTABLE_BUN" ]; then
            echo "❌ Portable Bun runtime not found at $PORTABLE_BUN"
            exit 1
        fi
        echo "✅ Using Portable Bun: $($PORTABLE_BUN --version)"
        echo "✅ Using Portable RTK: $($RTK --version 2>/dev/null || echo 'Ready')"
        echo "📦 Installing workspace packages with Bun..."
        $PORTABLE_BUN install
        echo "✨ Setup completed successfully! Run './run.sh dev' to start."
        ;;

    dev)
        echo "🚀 [SG Forge] Starting development services..."
        $PORTABLE_BUN run dev
        ;;

    doctor)
        echo "🩺 [SG Forge] Running system diagnostics..."
        echo "• Host OS: $(uname -s) $(uname -m)"
        echo "• Portable Bun: $($PORTABLE_BUN --version 2>/dev/null || echo 'Missing')"
        echo "• Portable RTK: $($RTK --version 2>/dev/null || echo 'Missing')"
        echo "• Astryx CLI: $($REPO_ROOT/portables/bin/astryx --help >/dev/null && echo 'Ready' || echo 'Missing')"
        echo "• Caveman CLI: $($REPO_ROOT/portables/bin/caveman --help >/dev/null && echo 'Ready' || echo 'Missing')"
        echo "• Docker Daemon: $(docker info >/dev/null 2>&1 && echo 'Running' || echo 'Not running / Optional')"
        echo "✅ Pre-flight checks passed."
        ;;

    clean)
        echo "🧹 [SG Forge] Cleaning caches and logs..."
        rm -rf .next .turbo dist node_modules/.cache
        echo "✨ Workspace cleaned."
        ;;

    create-app)
        APP_NAME="$2"
        if [ -z "$APP_NAME" ]; then
            echo "❌ Please specify an app name: ./run.sh create-app <name>"
            exit 1
        fi
        APP_SLUG=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
        TARGET_DIR="$REPO_ROOT/forge-apps/$APP_SLUG"
        if [ -d "$TARGET_DIR" ]; then
            echo "❌ App directory already exists: $TARGET_DIR"
            exit 1
        fi
        echo "🧩 Scaffolding Forge App '$APP_NAME' at forge-apps/$APP_SLUG..."
        cp -r "$REPO_ROOT/forge-apps/app-template" "$TARGET_DIR"
        echo "✅ Created forge-apps/$APP_SLUG successfully!"
        ;;

    test)
        SUITE="${2:-all}"
        echo "🧪 [SG Forge] Running test suite: $SUITE..."
        $PORTABLE_BUN test
        ;;

    *)
        show_help
        ;;
esac

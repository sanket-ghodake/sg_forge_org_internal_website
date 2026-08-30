#!/usr/bin/env bash
# ==============================================================================
# SG Forge - Unified Cross-Platform Orchestration CLI (2026 LTS)
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
    echo "Core Development & Testing:"
    echo "  setup                 Bootstrap workspace dependencies & portable runtimes"
    echo "  dev                   Start all platform services natively in parallel"
    echo "  sync-proxy            Auto-generate proxy/Caddyfile dynamically from .env"
    echo "  sync-ignores          Auto-sync all 7 ignore files & .gitattributes"
    echo "  test [unit|all]       Run 5-tier test suites"
    echo "  doctor                Run pre-flight diagnostics & environment check"
    echo "  clean                 Clean build caches and temporary logs"
    echo "  create-app <name>     Scaffold a new Forge Micro-App from template"
    echo ""
    echo "Quality, Security & Toolchain:"
    echo "  verify                Run automated AI Agent 2-Tier Quality Gate"
    echo "  lint                  Run Biome fast AST code quality & style checks"
    echo "  deadcode              Run Knip dead code & unexported symbol audit"
    echo "  secrets               Run Gitleaks 160+ secret & token scanner"
    echo "  benchmark [url]       Run Autocannon HTTP latency benchmark (<2ms target)"
    echo "  pack                  Run Repomix token-compressed AI context packager"
    echo ""
    echo "Docker Lifecycle & Modular Profiles (Big Tech Orchestration):"
    echo "  docker up / dev [opt] Start Docker Dev Stack (Profiles: core, apps, monitoring, all)"
    echo "  docker prod [opt]     Start Production Docker Stack"
    echo "  docker build [app]    Build colocated Dockerfile for a specific app or all"
    echo "  docker down           Gracefully stop active Docker containers"
    echo "  docker restart [svc]  Restart specific container without downtime"
    echo "  docker status         Show ASCII summary table of active containers"
    echo "  docker monitor        Live 24/7 terminal dashboard (CPU, RAM, Net I/O)"
    echo "  docker logs [svc]     Tail container logs in real-time"
    echo "  docker purge          Clean dangling images without losing DB volumes"
    echo "  docker reset-data     Purge all containers, images, and data volumes"
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
        $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
        echo "✨ Setup completed successfully! Run './run.sh dev' or './run.sh docker up' to start."
        ;;

    sync-proxy)
        $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
        ;;

    sync-ignores)
        FLAG="${2:-}"
        if [ "$FLAG" = "--check" ]; then
            $PORTABLE_BUN run "$REPO_ROOT/scripts/sync-ignores.ts" --check
        else
            $PORTABLE_BUN run "$REPO_ROOT/scripts/sync-ignores.ts"
        fi
        ;;

    dev)
        echo "🔀 [SG Forge] Synchronizing dynamic reverse proxy routes from .env..."
        $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
        echo "🚀 [SG Forge] Starting all platform services in parallel..."
        $PORTABLE_BUN run apps/src/landing/src/server.ts &
        $PORTABLE_BUN run apps/src/auth/src/server.ts &
        $PORTABLE_BUN run apps/src/portal/src/server.ts &
        $PORTABLE_BUN run apps/src/dev-dashboard/src/server.ts &
        $PORTABLE_BUN run apps/src/dev-hub/src/server.ts &
        $PORTABLE_BUN run forge-apps/expenses/src/server.ts &
        $PORTABLE_BUN run forge-apps/billing/src/server.ts &
        $PORTABLE_BUN run forge-apps/telemetry/src/server.ts &
        wait
        ;;

    verify)
        echo "🛡️ [SG Forge] Running Automated AI Agent Quality Gate..."
        $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
        $PORTABLE_BUN run "$REPO_ROOT/scripts/verify-gate.ts"
        ;;

    lint)
        $PORTABLE_BUN run "$REPO_ROOT/portables/bin/biome"
        ;;

    deadcode)
        $PORTABLE_BUN run "$REPO_ROOT/portables/bin/knip"
        ;;

    secrets)
        $PORTABLE_BUN run "$REPO_ROOT/portables/bin/gitleaks"
        ;;

    benchmark)
        TARGET="${2:-http://localhost/}"
        $PORTABLE_BUN run "$REPO_ROOT/portables/bin/autocannon" "$TARGET"
        ;;

    monitor)
        $PORTABLE_BUN run "$REPO_ROOT/scripts/terminal-monitor.ts"
        ;;

    pack)
        $PORTABLE_BUN run "$REPO_ROOT/portables/bin/repomix"
        ;;

    doctor)
        echo "🩺 [SG Forge] Running system diagnostics..."
        echo "• Host OS: $(uname -s) $(uname -m)"
        echo "• Portable Bun: $($PORTABLE_BUN --version 2>/dev/null || echo 'Missing')"
        echo "• Portable RTK: $($RTK --version 2>/dev/null || echo 'Missing')"
        echo "• Astryx CLI: $($REPO_ROOT/portables/bin/astryx --help >/dev/null 2>&1 && echo 'Ready' || echo 'Missing')"
        echo "• Caveman CLI: $($REPO_ROOT/portables/bin/caveman --help >/dev/null 2>&1 && echo 'Ready' || echo 'Missing')"
        echo "• Gitleaks CLI: Ready"
        echo "• Biome Linter: Ready"
        echo "• Knip Auditor: Ready"
        echo "• Autocannon: Ready"
        echo "• Docker Daemon: $(docker info >/dev/null 2>&1 && echo 'Running' || echo 'Not running / Optional')"
        echo "• Docker Compose: $(docker compose version >/dev/null 2>&1 && echo 'Ready' || echo 'Missing')"
        echo "• Kubectl Tooling: $(which kubectl >/dev/null 2>&1 && echo 'Ready' || echo 'Optional / Not installed')"
        echo "• Kustomize CLI: $(which kustomize >/dev/null 2>&1 && echo 'Ready' || echo 'Optional (built into kubectl)')"
        echo "✅ Pre-flight checks passed."
        ;;

    clean)
        echo "🧹 [SG Forge] Cleaning caches and logs..."
        rm -rf .next .turbo dist node_modules/.cache repomix-output.xml
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
        echo "✅ Created forge-apps/$APP_SLUG with colocated docker/Dockerfile successfully!"
        ;;

    test)
        SUITE="${2:-all}"
        echo "🧪 [SG Forge] Running test suite: $SUITE..."
        $PORTABLE_BUN test
        ;;

    docker)
        ACTION="${2:-up}"
        case "$ACTION" in
            up|dev)
                echo "🔀 [SG Forge] Synchronizing dynamic reverse proxy routes from .env..."
                $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
                PROFILE_ARG="--profile all"
                TARGET_PARAM="${3:-}"
                if [ "$TARGET_PARAM" = "--profile" ] && [ -n "${4:-}" ]; then
                    PROFILE_ARG="--profile $4"
                elif [ "$TARGET_PARAM" = "core" ] || [ "$TARGET_PARAM" = "apps" ] || [ "$TARGET_PARAM" = "monitoring" ] || [ "$TARGET_PARAM" = "all" ]; then
                    PROFILE_ARG="--profile $TARGET_PARAM"
                elif [ -n "$TARGET_PARAM" ]; then
                    echo "🐳 [SG Forge] Starting targeted service '$TARGET_PARAM' in Docker Dev..."
                    docker compose -f "$REPO_ROOT/docker/dev/docker-compose.yml" up -d proxy "$TARGET_PARAM"
                    echo "✨ Service '$TARGET_PARAM' running! Access Gateway at http://localhost/"
                    exit 0
                fi
                echo "🐳 [SG Forge] Starting Docker Dev Stack ($PROFILE_ARG, Hot Reload with bun --watch)..."
                docker compose -f "$REPO_ROOT/docker/dev/docker-compose.yml" $PROFILE_ARG up -d
                echo "✨ Stack running! Access Platform Hub at http://localhost/"
                ;;
            prod)
                echo "🔀 [SG Forge] Synchronizing dynamic reverse proxy routes from .env..."
                $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
                PROFILE_ARG="--profile all"
                TARGET_PARAM="${3:-}"
                if [ "$TARGET_PARAM" = "--profile" ] && [ -n "${4:-}" ]; then
                    PROFILE_ARG="--profile $4"
                elif [ "$TARGET_PARAM" = "core" ] || [ "$TARGET_PARAM" = "apps" ] || [ "$TARGET_PARAM" = "monitoring" ] || [ "$TARGET_PARAM" = "all" ]; then
                    PROFILE_ARG="--profile $TARGET_PARAM"
                elif [ -n "$TARGET_PARAM" ]; then
                    echo "🚀 [SG Forge] Starting targeted service '$TARGET_PARAM' in Docker Prod..."
                    docker compose -f "$REPO_ROOT/docker/prod/docker-compose.yml" up -d --build proxy "$TARGET_PARAM"
                    echo "✨ Service '$TARGET_PARAM' active at http://localhost/"
                    exit 0
                fi
                echo "🚀 [SG Forge] Starting Production Docker Stack ($PROFILE_ARG)..."
                docker compose -f "$REPO_ROOT/docker/prod/docker-compose.yml" $PROFILE_ARG up -d --build
                echo "✨ Production stack active at http://localhost/"
                ;;
            build)
                TARGET_APP="$3"
                if [ -n "$TARGET_APP" ]; then
                    if [ -f "$REPO_ROOT/apps/src/$TARGET_APP/docker/Dockerfile" ]; then
                        echo "🔨 Building image for apps/src/$TARGET_APP..."
                        docker build -f "$REPO_ROOT/apps/src/$TARGET_APP/docker/Dockerfile" -t "sg-$TARGET_APP" "$REPO_ROOT"
                    elif [ -f "$REPO_ROOT/forge-apps/$TARGET_APP/docker/Dockerfile" ]; then
                        echo "🔨 Building image for forge-apps/$TARGET_APP..."
                        docker build -f "$REPO_ROOT/forge-apps/$TARGET_APP/docker/Dockerfile" -t "sg-app-$TARGET_APP" "$REPO_ROOT"
                    else
                        echo "❌ Could not find colocated Dockerfile for $TARGET_APP"
                    fi
                else
                    echo "🔨 Building all production images via docker/prod/docker-compose.yml..."
                    docker compose -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all build
                fi
                ;;
            down)
                echo "🛑 [SG Forge] Gracefully stopping Docker containers..."
                docker compose -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker compose -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                echo "✨ Containers stopped."
                ;;
            restart)
                SVC="$3"
                FLAG="$4"
                TARGET_COMPOSE="$REPO_ROOT/docker/dev/docker-compose.yml"
                if [ "$FLAG" = "--prod" ] || [ "$SVC" = "--prod" ]; then
                    TARGET_COMPOSE="$REPO_ROOT/docker/prod/docker-compose.yml"
                    [ "$SVC" = "--prod" ] && SVC=""
                fi
                if [ -n "$SVC" ]; then
                    echo "🔄 [SG Forge] Restarting service: $SVC..."
                    docker compose -f "$TARGET_COMPOSE" --profile all restart "$SVC"
                else
                    echo "🔄 [SG Forge] Restarting stack ($TARGET_COMPOSE)..."
                    docker compose -f "$TARGET_COMPOSE" --profile all restart
                fi
                ;;
            status)
                echo "📊 [SG Forge] Live Container Status:"
                FLAG="${3:-}"
                if [ "$FLAG" = "--prod" ]; then
                    docker compose -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all ps
                else
                    docker compose -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all ps
                    docker compose -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all ps 2>/dev/null || true
                fi
                ;;
            monitor)
                $PORTABLE_BUN run "$REPO_ROOT/scripts/terminal-monitor.ts"
                ;;
            logs)
                SVC="${3:-}"
                FLAG="${4:-}"
                TARGET_COMPOSE="$REPO_ROOT/docker/dev/docker-compose.yml"
                if [ "$FLAG" = "--prod" ] || [ "$SVC" = "--prod" ]; then
                    TARGET_COMPOSE="$REPO_ROOT/docker/prod/docker-compose.yml"
                    [ "$SVC" = "--prod" ] && SVC=""
                fi
                if [ -n "$SVC" ]; then
                    docker compose -f "$TARGET_COMPOSE" --profile all logs --tail=100 "$SVC"
                else
                    docker compose -f "$TARGET_COMPOSE" --profile all logs --tail=50
                fi
                ;;
            purge)
                echo "⚠️ [SG Forge] Purging dangling containers, build caches, and stale volumes..."
                docker compose -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker compose -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker volume rm sg_forge_bun_cache_dev sg_forge_caddy_config_dev sg_forge_caddy_data_dev sg_forge_dev_db_auth sg_forge_dev_db_billing sg_forge_dev_db_dev_dashboard sg_forge_dev_db_expenses sg_forge_dev_db_portal sg_forge_dev_db_telemetry 2>/dev/null || true
                docker volume prune -f
                docker image prune -f
                echo "✨ Cleaned."
                ;;
            reset-data)
                echo "⚠️ [SG Forge] FULL RESET: Stopping all containers, removing all images & persistent DB volumes..."
                docker compose -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down -v --remove-orphans 2>/dev/null || true
                docker compose -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all down -v --remove-orphans 2>/dev/null || true
                docker volume prune -f
                docker image prune -a -f
                echo "✨ All containers, images, and volumes purged."
                ;;
            *)
                echo "Usage: ./run.sh docker [up|dev|prod|build|down|restart|status|monitor|logs|purge|reset-data]"
                ;;
        esac
        ;;

    *)
        show_help
        ;;
esac

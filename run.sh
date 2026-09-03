#!/usr/bin/env bash
# ==============================================================================
# Dynamic Platform Orchestration CLI (2026 LTS)
# 100% Dynamically Configured from .env (Brand, Docker, Proxy & Microservices)
# ==============================================================================
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTABLE_BUN="$REPO_ROOT/portables/bun/bin/bun"
RTK="$REPO_ROOT/portables/bin/rtk"

# Ensure PATH includes portable binaries
export PATH="$REPO_ROOT/portables/bin:$REPO_ROOT/portables/bun/bin:$PATH"

# Dynamically resolve branding and container variables from .env
if [ -f "$REPO_ROOT/.env" ]; then
    BRAND_NAME="$(grep -E '^NEXT_PUBLIC_BRAND_NAME=' "$REPO_ROOT/.env" | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)"
    CONTAINER_PREFIX="$(grep -E '^CONTAINER_PREFIX=' "$REPO_ROOT/.env" | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)"
    COMPOSE_PROJECT_NAME="$(grep -E '^COMPOSE_PROJECT_NAME=' "$REPO_ROOT/.env" | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)"
fi
BRAND_NAME="${BRAND_NAME:-AG Dashboard}"
CONTAINER_PREFIX="${CONTAINER_PREFIX:-ag}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-ag_dashboard}"

function show_help() {
    echo "======================================================================"
    echo "🚀 ${BRAND_NAME} Platform Orchestrator (2026 LTS)"
    echo "======================================================================"
    echo "Usage: ./run.sh <command> [options]"
    echo ""
    echo "Core Development & Testing:"
    echo "  setup                 Bootstrap workspace dependencies & portable runtimes"
    echo "  dev                   Start all platform services natively in parallel"
    echo "  sync-proxy            Auto-generate proxy/Caddyfile dynamically from .env"
    echo "  sync-ignores          Auto-sync all 7 ignore files & .gitattributes"
    echo "  test [unit|all]       Run 5-tier test suites"
    echo "  reset-db              Reset local development databases to pristine state"
    echo "  doctor                Run pre-flight diagnostics & environment check"
    echo "  clean                 Clean build caches and temporary logs"
    echo "  create-app <name>     Scaffold a new Micro-App from template"
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
        echo "⚡ [${BRAND_NAME}] Bootstrapping portable environment..."
        if [ ! -f "$PORTABLE_BUN" ]; then
            echo "❌ Portable Bun runtime not found at $PORTABLE_BUN"
            exit 1
        fi
        # Cross-platform permission & git attribute hardening (Windows/WSL/macOS/Linux)
        chmod +x "$REPO_ROOT"/portables/bin/* "$REPO_ROOT"/portables/bun/bin/* "$REPO_ROOT"/run.sh 2>/dev/null || true
        if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
            git config core.filemode false
            git config core.autocrlf false
        fi
        echo "✅ Using Portable Bun: $($PORTABLE_BUN --version)"
        echo "✅ Using Portable RTK: $($RTK --version 2>/dev/null || echo 'Ready')"
        echo "📦 Installing workspace packages with Bun..."
        $PORTABLE_BUN install
        $PORTABLE_BUN run "$REPO_ROOT/scripts/sync-ignores.ts"
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
        echo "🔀 [${BRAND_NAME}] Synchronizing dynamic reverse proxy routes from .env..."
        $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
        echo "🚀 [${BRAND_NAME}] Starting all platform services in parallel..."
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
        echo "🛡️ [${BRAND_NAME}] Running Automated AI Agent Quality Gate (21 Deterministic Gates)..."
        $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
        $PORTABLE_BUN run "$REPO_ROOT/scripts/verify-gate.ts"
        ;;

    lint)
        "$REPO_ROOT/portables/bin/biome" "$@"
        ;;

    deadcode)
        "$REPO_ROOT/portables/bin/knip" "$@"
        ;;

    secrets)
        "$REPO_ROOT/portables/bin/gitleaks" "$@"
        ;;

    arch)
        echo "🏛️ [${BRAND_NAME}] Auditing monorepo architecture and circular dependencies..."
        "$REPO_ROOT/portables/bin/depcruise" apps/src forge-apps
        "$REPO_ROOT/portables/bin/madge" apps/src
        ;;

    typecheck)
        "$REPO_ROOT/portables/bin/type-coverage" "$@"
        ;;

    shellcheck)
        "$REPO_ROOT/portables/bin/shellcheck" "$@"
        ;;

    semgrep)
        "$REPO_ROOT/portables/bin/semgrep" "$@"
        ;;

    a11y)
        "$REPO_ROOT/portables/bin/axe" "$@"
        ;;

    spectral)
        "$REPO_ROOT/portables/bin/spectral" "$@"
        ;;

    vuln)
        "$REPO_ROOT/portables/bin/osv-scanner" "$@"
        ;;

    trivy)
        "$REPO_ROOT/portables/bin/trivy" "$@"
        ;;

    sbom)
        "$REPO_ROOT/scripts/generate-sbom.sh" "$@"
        ;;

    lhci)
        "$REPO_ROOT/portables/bin/lhci" "$@"
        ;;

    benchmark)
        shift
        "$REPO_ROOT/portables/bin/autocannon" "$@"
        ;;

    pack)
        "$REPO_ROOT/portables/bin/repomix" "$@"
        ;;

    doctor)
        echo "🩺 [${BRAND_NAME}] Running Pre-Flight Diagnostics & Toolchain Inspection..."
        echo "1. Portable Bun Runtime:"
        $PORTABLE_BUN --version
        echo "2. Portable Bunx Wrapper:"
        "$REPO_ROOT/portables/bun/bin/bunx" --version
        echo "3. Portable RTK Token Compressor:"
        $RTK --version 2>/dev/null || echo "RTK Portable Ready"
        echo "4. Active Environment Brand:"
        echo "   Brand Name:     $BRAND_NAME"
        echo "   Container Pfx:  $CONTAINER_PREFIX"
        echo "   Compose Name:   $COMPOSE_PROJECT_NAME"
        echo "5. Cross-Platform Git Configuration:"
        if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
            echo "   core.filemode:  $(git config core.filemode || echo 'unset')"
            echo "   core.autocrlf:  $(git config core.autocrlf || echo 'unset')"
        fi
        echo "6. Ingress Reverse Proxy Configuration:"
        $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
        echo "✅ Diagnostics Completed."
        ;;

    clean)
        echo "🧹 [${BRAND_NAME}] Cleaning workspace caches, temporary logs, and build artifacts..."
        rm -rf "$REPO_ROOT/.next" "$REPO_ROOT/.turbo" "$REPO_ROOT/dist"
        find "$REPO_ROOT" -type d -name "logs" -exec sh -c 'rm -f "$1"/*.log "$1"/*.txt' _ {} \; 2>/dev/null || true
        echo "✨ Workspace cleaned."
        ;;

    create-app)
        shift
        $PORTABLE_BUN run "$REPO_ROOT/scripts/create-app.ts" "$@"
        ;;

    test)
        SUITE="${2:-all}"
        echo "🧪 [${BRAND_NAME}] Running test suite: $SUITE..."
        NODE_ENV=test BUN_ENV=test FORGE_TEST_MODE=true $PORTABLE_BUN test "$@"
        ;;

    reset-db)
        echo "⚠️ [${BRAND_NAME}] Development Database Reset Tool"
        FORCE="${2:-}"
        if [ "$FORCE" = "--force" ] || [ "$FORCE" = "-y" ]; then
            CONFIRM="y"
        else
            read -p "Are you sure you want to delete and re-seed all local development databases? [y/N]: " -n 1 -r CONFIRM
            echo
        fi
        if [[ $CONFIRM =~ ^[Yy]$ ]]; then
            rm -f "$REPO_ROOT"/apps/data/*.db "$REPO_ROOT"/apps/data/*.db-wal "$REPO_ROOT"/apps/data/*.db-shm
            echo "🌱 Re-initializing and seeding clean databases..."
            ALLOW_DB_WIPE=true $PORTABLE_BUN run "$REPO_ROOT/scripts/init-all-databases.ts"
            echo "✨ All development databases reset to pristine seeded state."
        else
            echo "Cancelled."
        fi
        ;;

    docker)
        ACTION="${2:-up}"
        case "$ACTION" in
            up|dev)
                echo "🔀 [${BRAND_NAME}] Synchronizing dynamic reverse proxy routes from .env..."
                $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
                PROFILE_ARG="--profile all"
                TARGET_PARAM="${3:-}"
                if [ "$TARGET_PARAM" = "--profile" ] && [ -n "${4:-}" ]; then
                    PROFILE_ARG="--profile $4"
                elif [ "$TARGET_PARAM" = "core" ] || [ "$TARGET_PARAM" = "apps" ] || [ "$TARGET_PARAM" = "monitoring" ] || [ "$TARGET_PARAM" = "all" ]; then
                    PROFILE_ARG="--profile $TARGET_PARAM"
                elif [ -n "$TARGET_PARAM" ]; then
                    echo "🐳 [${BRAND_NAME}] Starting targeted service '$TARGET_PARAM' in Docker Dev..."
                    docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/dev/docker-compose.yml" up -d proxy "$TARGET_PARAM"
                    echo "✨ Service '$TARGET_PARAM' running! Access Gateway at http://localhost/"
                    exit 0
                fi
                echo "🐳 [${BRAND_NAME}] Starting Docker Dev Stack ($PROFILE_ARG, Hot Reload with bun --watch)..."
                docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/dev/docker-compose.yml" $PROFILE_ARG up -d
                echo "✨ Stack running! Access Platform Hub at http://localhost/"
                ;;
            prod)
                echo "🔀 [${BRAND_NAME}] Synchronizing dynamic reverse proxy routes from .env..."
                $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
                PROFILE_ARG="--profile all"
                TARGET_PARAM="${3:-}"
                if [ "$TARGET_PARAM" = "--profile" ] && [ -n "${4:-}" ]; then
                    PROFILE_ARG="--profile $4"
                elif [ "$TARGET_PARAM" = "core" ] || [ "$TARGET_PARAM" = "apps" ] || [ "$TARGET_PARAM" = "monitoring" ] || [ "$TARGET_PARAM" = "all" ]; then
                    PROFILE_ARG="--profile $TARGET_PARAM"
                elif [ -n "$TARGET_PARAM" ]; then
                    echo "🚀 [${BRAND_NAME}] Starting targeted service '$TARGET_PARAM' in Docker Prod..."
                    docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/prod/docker-compose.yml" up -d --build proxy "$TARGET_PARAM"
                    echo "✨ Service '$TARGET_PARAM' active at http://localhost/"
                    exit 0
                fi
                echo "🚀 [${BRAND_NAME}] Starting Production Docker Stack ($PROFILE_ARG)..."
                docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/prod/docker-compose.yml" $PROFILE_ARG up -d --build
                echo "✨ Production stack active at http://localhost/"
                ;;
            build)
                TARGET_APP="$3"
                if [ -n "$TARGET_APP" ]; then
                    if [ -f "$REPO_ROOT/apps/src/$TARGET_APP/docker/Dockerfile" ]; then
                        echo "🔨 Building image for apps/src/$TARGET_APP..."
                        docker build -f "$REPO_ROOT/apps/src/$TARGET_APP/docker/Dockerfile" -t "${CONTAINER_PREFIX}-$TARGET_APP" "$REPO_ROOT"
                    elif [ -f "$REPO_ROOT/forge-apps/$TARGET_APP/docker/Dockerfile" ]; then
                        echo "🔨 Building image for forge-apps/$TARGET_APP..."
                        docker build -f "$REPO_ROOT/forge-apps/$TARGET_APP/docker/Dockerfile" -t "${CONTAINER_PREFIX}-app-$TARGET_APP" "$REPO_ROOT"
                    else
                        echo "❌ Could not find colocated Dockerfile for $TARGET_APP"
                    fi
                else
                    echo "🔨 Building all production images via docker/prod/docker-compose.yml..."
                    docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all build
                fi
                ;;
            down)
                echo "🛑 [${BRAND_NAME}] Gracefully stopping Docker containers..."
                docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
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
                    echo "🔄 [${BRAND_NAME}] Restarting service: $SVC..."
                    docker compose --project-directory "$REPO_ROOT" -f "$TARGET_COMPOSE" --profile all restart "$SVC"
                else
                    echo "🔄 [${BRAND_NAME}] Restarting stack ($TARGET_COMPOSE)..."
                    docker compose --project-directory "$REPO_ROOT" -f "$TARGET_COMPOSE" --profile all restart
                fi
                ;;
            status)
                echo "📊 [${BRAND_NAME}] Live Container Status:"
                FLAG="${3:-}"
                if [ "$FLAG" = "--prod" ]; then
                    docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all ps
                else
                    docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all ps
                    docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all ps 2>/dev/null || true
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
                    docker compose --project-directory "$REPO_ROOT" -f "$TARGET_COMPOSE" --profile all logs --tail=100 "$SVC"
                else
                    docker compose --project-directory "$REPO_ROOT" -f "$TARGET_COMPOSE" --profile all logs --tail=50
                fi
                ;;
            purge)
                echo "⚠️ [${BRAND_NAME}] Purging dangling containers, build caches, and stale volumes..."
                docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker volume prune -f
                docker image prune -f
                echo "✨ Cleaned."
                ;;
            reset-data)
                echo "⚠️ [${BRAND_NAME}] FULL RESET: Stopping all containers, removing all images & persistent DB volumes..."
                docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down -v --remove-orphans 2>/dev/null || true
                docker compose --project-directory "$REPO_ROOT" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all down -v --remove-orphans 2>/dev/null || true
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

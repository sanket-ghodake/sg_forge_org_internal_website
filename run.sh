#!/usr/bin/env bash
# ==============================================================================
# Dynamic Platform Orchestration CLI (2026 LTS)
# 100% Dynamically Configured from .env (Brand, Docker, Proxy & Microservices)
# ==============================================================================
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST_OS="$(uname -s)"
RTK="$REPO_ROOT/portables/bin/rtk"

# Resolve Bun runtime: on Linux use portable ELF binary; on macOS/others use system bun
if [ "$HOST_OS" = "Linux" ] && [ -x "$REPO_ROOT/portables/bun/bin/bun" ]; then
    PORTABLE_BUN="$REPO_ROOT/portables/bun/bin/bun"
    export PATH="$REPO_ROOT/portables/bin:$REPO_ROOT/portables/bun/bin:$PATH"
elif command -v bun >/dev/null 2>&1; then
    PORTABLE_BUN="bun"
    export PATH="$REPO_ROOT/portables/bin:$PATH"
else
    PORTABLE_BUN="$REPO_ROOT/portables/bun/bin/bun"
    export PATH="$REPO_ROOT/portables/bin:$PATH"
fi

# Dynamically resolve branding and container variables from .env
if [ -f "$REPO_ROOT/.env" ]; then
    ENV_APP_ENV="$(grep -E '^APP_ENV=' "$REPO_ROOT/.env" | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)"
    BRAND_NAME="$(grep -E '^NEXT_PUBLIC_BRAND_NAME=' "$REPO_ROOT/.env" | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)"
    CONTAINER_PREFIX="$(grep -E '^CONTAINER_PREFIX=' "$REPO_ROOT/.env" | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)"
    COMPOSE_PROJECT_NAME="$(grep -E '^COMPOSE_PROJECT_NAME=' "$REPO_ROOT/.env" | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)"
    HTTP_PORT="$(grep -E '^HTTP_PORT=' "$REPO_ROOT/.env" | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)"
    PROD_HTTP_PORT="$(grep -E '^PROD_HTTP_PORT=' "$REPO_ROOT/.env" | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)"
    LANDING_PORT="$(grep -E '^LANDING_PORT=' "$REPO_ROOT/.env" | head -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)"
fi
BRAND_NAME="${BRAND_NAME:-AG Dashboard}"
CONTAINER_PREFIX="${CONTAINER_PREFIX:-ag}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-ag_dashboard}"
APP_ENV="${APP_ENV:-${ENV_APP_ENV:-${NODE_ENV:-development}}}"
HTTP_PORT="${HTTP_PORT:-8080}"
PROD_HTTP_PORT="${PROD_HTTP_PORT:-80}"
LANDING_PORT="${LANDING_PORT:-3000}"

function show_help() {
    echo "======================================================================"
    echo "🚀 ${BRAND_NAME} Platform Orchestrator (2026 LTS)"
    echo "======================================================================"
    echo "Usage: ./run.sh <command> [options]"
    echo ""
    echo "Core Development & Testing:"
    echo "  setup                 Bootstrap workspace dependencies & portable runtimes"
    echo "  dev [svc]             Start platform services natively (opt: target single service)"
    echo "  sync-proxy            Auto-generate proxy/Caddyfile dynamically from .env"
    echo "  fallback [port]       Run Host Fallback Server (Approach A offline maintenance)"
    echo "  sync-ignores          Auto-sync all 7 ignore files & .gitattributes"
    echo "  test [unit|all]       Run 5-tier test suites"
    echo "  reset-db              Reset local development databases to pristine state"
    echo "  doctor                Run pre-flight diagnostics & environment check"
    echo "  clean                 Clean build caches and temporary logs"
    echo "  create-app <name>     Scaffold a new Micro-App from template"
    echo ""
    echo "Ergonomic Aliases & Monitoring:"
    echo "  up [opt]              Shortcut for './run.sh docker up'"
    echo "  down                  Shortcut for './run.sh docker down'"
    echo "  ps / status           Shortcut for './run.sh docker status'"
    echo "  top / ctop            Run live kernel & container dashboard (portables/bin/ctop)"
    echo "  monitor               Run live API & Fleet SLO HUD (scripts/terminal-monitor.ts)"
    echo "  logs [svc]            Tail Docker container logs"
    echo "  restart [svc]         Restart Docker container service"
    echo ""
    echo "Quality, Security & Toolchain:"
    echo "  verify                Run automated AI Agent 2-Tier Quality Gate (27 Checks)"
    echo "  lint                  Run Biome fast AST code quality & style checks"
    echo "  deadcode              Run Knip dead code & unexported symbol audit"
    echo "  secrets               Run Gitleaks 160+ secret & token scanner"
    echo "  vuln                  Run Google OSV-Scanner on lockfile dependencies"
    echo "  trivy                 Run Trivy container and filesystem configuration scanner"
    echo "  sbom                  Generate CycloneDX 1.5 Software Bill of Materials (Syft)"
    echo "  contracts             Lint OpenAPI 3.1 specifications (Spectral)"
    echo "  complexity            Audit Cyclomatic Complexity CCN <= 10 & function caps (Lizard)"
    echo "  check-pkg [pkg]       Audit dependencies for package hallucination & slopsquatting"
    echo "  licenses              Audit dependency licenses against permissive OSI allowlist"
    echo "  fuzz                  Run Schemathesis property contract fuzzer against OpenAPI specs"
    echo "  loadtest [script]     Run k6 load & performance stress testing engine"
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
    echo "  docker top / ctop     Run real-time container top metrics HUD (ctop)"
    echo "  docker monitor        Live 24/7 terminal dashboard (CPU, RAM, Net I/O)"
    echo "  docker logs [svc]     Tail container logs in real-time"
    echo "  docker purge          Clean dangling images without losing DB volumes"
    echo "  docker reset-data     Purge all containers, images, and data volumes"
    echo ""
    echo "Production Deployment & Resilience Engine:"
    echo "  deploy-prod           Deploy latest git changes with selective microservice updates"
    echo "  rollback-prod [tag]   Instant rollback to stable baseline (opt: --restore-db)"
    echo "  prod-status           Check production gateway health, containers & audit logs"
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

    fallback)
        shift
        $PORTABLE_BUN run "$REPO_ROOT/scripts/fallback-server.ts" "$@"
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
        shift
        $PORTABLE_BUN run "$REPO_ROOT/scripts/dev-runner.ts" "$@"
        ;;

    up)
        shift
        "$0" docker up "$@"
        ;;

    down)
        shift
        "$0" docker down "$@"
        ;;

    ps|status)
        shift
        "$0" docker status "$@"
        ;;

    top|ctop)
        shift
        "$REPO_ROOT/portables/bin/ctop" "$@"
        ;;

    monitor)
        shift
        $PORTABLE_BUN run "$REPO_ROOT/scripts/terminal-monitor.ts" "$@"
        ;;

    logs)
        shift
        "$0" docker logs "$@"
        ;;

    restart)
        shift
        "$0" docker restart "$@"
        ;;

    verify)
        echo "🛡️ [${BRAND_NAME}] Running Automated AI Agent Quality Gate (27 Deterministic Gates)..."
        $PORTABLE_BUN run "$REPO_ROOT/scripts/generate-proxy.ts"
        shift || true
        $PORTABLE_BUN run "$REPO_ROOT/scripts/verify-gate.ts" "$@"
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

    spectral|contracts)
        if [ $# -ge 2 ]; then
            shift
            "$REPO_ROOT/portables/bin/spectral" "$@"
        else
            "$REPO_ROOT/portables/bin/spectral" lint "$REPO_ROOT/docs/api/openapi.yaml"
        fi
        ;;

    complexity)
        shift
        "$REPO_ROOT/portables/bin/lizard" "$@"
        ;;

    check-pkg)
        shift
        $PORTABLE_BUN run "$REPO_ROOT/scripts/check-package-health.ts" "$@"
        ;;

    licenses)
        $PORTABLE_BUN -e 'import { checkDependencyLicenses } from "./scripts/verify-checks.ts"; const res = checkDependencyLicenses(); console.log(res.details);'
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

    fuzz|schemathesis)
        shift
        "$REPO_ROOT/portables/bin/schemathesis" "$@"
        ;;

    loadtest|k6)
        shift
        "$REPO_ROOT/portables/bin/k6" "$@"
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
        echo "7. Port Binding Inspection (from .env):"
        PORTS_TO_CHECK="$(grep -E '(PORT=|APP_)' "$REPO_ROOT/.env" 2>/dev/null | grep -oE '[0-9]{2,5}' | sort -u || true)"
        for P in ${PORTS_TO_CHECK:-8080 8443 3000 3001 3002 3003 3004}; do
            if command -v lsof >/dev/null 2>&1 && lsof -i :"$P" -sTCP:LISTEN -t >/dev/null 2>&1; then
                echo "   ⚠️ Port $P is currently bound by an active process"
            fi
        done
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
        if [ "$APP_ENV" = "production" ] && [ "${2:-}" != "--force-production-wipe" ] && [ "${3:-}" != "--force-production-wipe" ]; then
            echo "🛑 BLOCKED: APP_ENV is set to 'production'!"
            echo "   Accidental database wipe protection active. Pass '--force-production-wipe' to proceed."
            exit 1
        fi
        FORCE="${2:-}"
        if [ "$FORCE" = "--force" ] || [ "$FORCE" = "-y" ]; then
            CONFIRM="y"
        elif [ ! -t 0 ]; then
            echo "🛑 Non-interactive shell detected. Use '--force' or '-y' to confirm reset."
            exit 1
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
        DEV_PROJECT="${COMPOSE_PROJECT_NAME}-dev"
        PROD_PROJECT="${COMPOSE_PROJECT_NAME}-prod"
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
                    docker compose -p "$DEV_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/dev/docker-compose.yml" up -d proxy "$TARGET_PARAM"
                    echo "✨ Service '$TARGET_PARAM' running! Access Gateway at http://localhost:${HTTP_PORT}/"
                    exit 0
                fi
                echo "🐳 [${BRAND_NAME}] Starting Docker Dev Stack ($PROFILE_ARG, Hot Reload with bun --watch)..."
                docker compose -p "$DEV_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/dev/docker-compose.yml" $PROFILE_ARG up -d
                echo "✨ Stack running! Access Platform Hub at http://localhost:${HTTP_PORT}/ (Portal: /portal, DevCenter: /devcenter)"
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
                    docker compose -p "$PROD_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/prod/docker-compose.yml" up -d --build proxy "$TARGET_PARAM"
                    echo "✨ Service '$TARGET_PARAM' active at http://localhost:${PROD_HTTP_PORT}/"
                    exit 0
                fi
                echo "🚀 [${BRAND_NAME}] Starting Production Docker Stack ($PROFILE_ARG)..."
                docker compose -p "$PROD_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/prod/docker-compose.yml" $PROFILE_ARG up -d --build
                echo "✨ Production stack active at http://localhost:${PROD_HTTP_PORT}/"
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
                    docker compose -p "$PROD_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all build
                fi
                ;;
            down)
                echo "🛑 [${BRAND_NAME}] Gracefully stopping Docker containers..."
                docker compose -p "$DEV_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker compose -p "$PROD_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker compose -p "$COMPOSE_PROJECT_NAME" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                echo "✨ Containers stopped."
                ;;
            restart)
                SVC="$3"
                FLAG="$4"
                TARGET_COMPOSE="$REPO_ROOT/docker/dev/docker-compose.yml"
                TARGET_PROJECT="$DEV_PROJECT"
                if [ "$FLAG" = "--prod" ] || [ "$SVC" = "--prod" ]; then
                    TARGET_COMPOSE="$REPO_ROOT/docker/prod/docker-compose.yml"
                    TARGET_PROJECT="$PROD_PROJECT"
                    [ "$SVC" = "--prod" ] && SVC=""
                fi
                if [ -n "$SVC" ]; then
                    echo "🔄 [${BRAND_NAME}] Restarting service: $SVC..."
                    docker compose -p "$TARGET_PROJECT" --env-file "$REPO_ROOT/.env" -f "$TARGET_COMPOSE" --profile all restart "$SVC"
                else
                    echo "🔄 [${BRAND_NAME}] Restarting stack ($TARGET_COMPOSE)..."
                    docker compose -p "$TARGET_PROJECT" --env-file "$REPO_ROOT/.env" -f "$TARGET_COMPOSE" --profile all restart
                fi
                ;;
            status)
                echo "📊 [${BRAND_NAME}] Live Container Status:"
                FLAG="${3:-}"
                if [ "$FLAG" = "--prod" ]; then
                    docker compose -p "$PROD_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all ps
                else
                    docker compose -p "$DEV_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all ps
                    docker compose -p "$PROD_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all ps 2>/dev/null || true
                fi
                ;;
            top|ctop)
                shift 2
                "$REPO_ROOT/portables/bin/ctop" "$@"
                ;;
            monitor)
                shift 2
                $PORTABLE_BUN run "$REPO_ROOT/scripts/terminal-monitor.ts" "$@"
                ;;
            logs)
                SVC="${3:-}"
                FLAG="${4:-}"
                TARGET_COMPOSE="$REPO_ROOT/docker/dev/docker-compose.yml"
                TARGET_PROJECT="$DEV_PROJECT"
                if [ "$FLAG" = "--prod" ] || [ "$SVC" = "--prod" ]; then
                    TARGET_COMPOSE="$REPO_ROOT/docker/prod/docker-compose.yml"
                    TARGET_PROJECT="$PROD_PROJECT"
                    [ "$SVC" = "--prod" ] && SVC=""
                fi
                if [ -n "$SVC" ]; then
                    docker compose -p "$TARGET_PROJECT" --env-file "$REPO_ROOT/.env" -f "$TARGET_COMPOSE" --profile all logs --tail=100 "$SVC"
                else
                    docker compose -p "$TARGET_PROJECT" --env-file "$REPO_ROOT/.env" -f "$TARGET_COMPOSE" --profile all logs --tail=50
                fi
                ;;
            purge)
                echo "⚠️ [${BRAND_NAME}] Purging dangling containers, build caches, and stale volumes..."
                docker compose -p "$DEV_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker compose -p "$PROD_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker compose -p "$COMPOSE_PROJECT_NAME" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down --remove-orphans 2>/dev/null || true
                docker volume prune -f
                docker image prune -f
                echo "✨ Cleaned."
                ;;
            reset-data)
                echo "⚠️ [${BRAND_NAME}] FULL RESET: Stopping all containers, removing all images & persistent DB volumes..."
                if [ "$APP_ENV" = "production" ] && [ "${3:-}" != "--force-production-wipe" ] && [ "${4:-}" != "--force-production-wipe" ]; then
                    echo "🛑 BLOCKED: APP_ENV is set to 'production'!"
                    echo "   Persistent volume wipe protection active. Pass '--force-production-wipe' to proceed."
                    exit 1
                fi
                docker compose -p "$DEV_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down -v --remove-orphans 2>/dev/null || true
                docker compose -p "$PROD_PROJECT" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/prod/docker-compose.yml" --profile all down -v --remove-orphans 2>/dev/null || true
                docker compose -p "$COMPOSE_PROJECT_NAME" --env-file "$REPO_ROOT/.env" -f "$REPO_ROOT/docker/dev/docker-compose.yml" --profile all down -v --remove-orphans 2>/dev/null || true
                docker volume prune -f
                docker image prune -a -f
                echo "✨ All containers, images, and volumes purged."
                ;;
            *)
                echo "Usage: ./run.sh docker [up|dev|prod|build|down|restart|status|top|monitor|logs|purge|reset-data]"
                ;;
        esac
        ;;

    deploy-prod)
        "$REPO_ROOT/deploy/deploy-prod.sh" "$@"
        ;;

    rollback-prod)
        shift
        "$REPO_ROOT/deploy/rollback-prod.sh" "$@"
        ;;

    prod-status)
        "$REPO_ROOT/deploy/status-prod.sh"
        ;;

    *)
        show_help
        ;;
esac

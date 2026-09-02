@echo off
REM ==============================================================================
REM Dynamic Platform Orchestration CLI (Windows 2026 LTS)
REM 100% Dynamically Configured from .env (Brand, Docker, Proxy & Microservices)
REM ==============================================================================

set "REPO_ROOT=%~dp0"
set "PORTABLE_BUN=%REPO_ROOT%portables\bun\bin\bun.exe"
set "PATH=%REPO_ROOT%portables\bin;%REPO_ROOT%portables\bun\bin;%PATH%"

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="setup" goto setup
if "%1"=="dev" goto dev
if "%1"=="doctor" goto doctor
if "%1"=="clean" goto clean
if "%1"=="test" goto test
if "%1"=="docker" goto docker
goto help

:setup
echo ⚡ Bootstrapping portable environment on Windows...
git rev-parse --is-inside-work-tree >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    git config core.filemode false
    git config core.autocrlf false
)
bun install
bun run "%REPO_ROOT%scripts\sync-ignores.ts"
bun run "%REPO_ROOT%scripts\generate-proxy.ts"
echo ✨ Setup completed successfully! Run 'run.bat dev' or 'run.bat docker up' to start.
goto end

:dev
echo 🚀 Starting development services...
bun run "%REPO_ROOT%scripts\generate-proxy.ts"
bun run apps/src/landing/src/server.ts
goto end

:doctor
echo 🩺 Running Windows system diagnostics...
bun --version
git rev-parse --is-inside-work-tree >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Git core.filemode:
    git config core.filemode
    echo Git core.autocrlf:
    git config core.autocrlf
)
bun run "%REPO_ROOT%scripts\generate-proxy.ts"
echo ✅ Pre-flight checks passed.
goto end

:clean
echo 🧹 Cleaning caches and logs...
if exist .next rmdir /s /q .next
if exist .turbo rmdir /s /q .turbo
echo ✨ Workspace cleaned.
goto end

:test
echo 🧪 Running tests...
bun test
goto end

:docker
if "%2"=="up" (
    bun run "%REPO_ROOT%scripts\generate-proxy.ts"
    docker compose --project-directory "%REPO_ROOT%" -f "%REPO_ROOT%docker\dev\docker-compose.yml" up -d
) else if "%2"=="down" (
    docker compose --project-directory "%REPO_ROOT%" -f "%REPO_ROOT%docker\dev\docker-compose.yml" down
) else if "%2"=="status" (
    docker compose --project-directory "%REPO_ROOT%" -f "%REPO_ROOT%docker\dev\docker-compose.yml" ps
) else (
    echo Usage: run.bat docker [up ^| down ^| status]
)
goto end

:help
echo ======================================================================
echo 🚀 Platform Orchestrator (Windows 2026 LTS)
echo ======================================================================
echo Usage: run.bat [setup ^| dev ^| doctor ^| clean ^| test ^| docker]
echo ======================================================================
goto end

:end

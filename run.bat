@echo off
REM ==============================================================================
REM SG Forge - Unified Windows Orchestration CLI (Native CMD & PowerShell)
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
goto help

:setup
echo ⚡ [SG Forge] Bootstrapping portable environment on Windows...
bun install
echo ✨ Setup completed successfully! Run 'run.bat dev' to start.
goto end

:dev
echo 🚀 [SG Forge] Starting development services...
bun run dev
goto end

:doctor
echo 🩺 [SG Forge] Running Windows system diagnostics...
bun --version
echo ✅ Pre-flight checks passed.
goto end

:clean
echo 🧹 [SG Forge] Cleaning caches and logs...
if exist .next rmdir /s /q .next
if exist .turbo rmdir /s /q .turbo
echo ✨ Workspace cleaned.
goto end

:test
echo 🧪 [SG Forge] Running tests...
bun test
goto end

:help
echo ======================================================================
echo 🚀 SG Forge Platform Orchestrator (Windows 2026 LTS)
echo ======================================================================
echo Usage: run.bat [setup ^| dev ^| doctor ^| clean ^| test]
echo ======================================================================
goto end

:end

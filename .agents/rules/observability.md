# 📊 Microservice Observability & Isolated Logging Rules (2026 LTS)

Every microservice across `apps/src/*` and `forge-apps/*` (and any new app generated via `scripts/create-app.ts`) MUST adhere to these strict observability invariants.

---

## ⚡ Non-Negotiable Directives

1. **Colocated Isolated `logs/` Directory**:
   - Every microservice MUST own its dedicated `logs/` directory (`apps/src/<app>/logs/` or `forge-apps/<app>/logs/`).
   - Every `logs/` folder MUST contain:
     - `README.md` (documenting the folder and its log retention policies).
     - `.gitignore` (ignoring `*.log` and `*.log.*` while preserving `.gitignore` and `README.md`).
   - Cross-app log reading/writing is STRICTLY PROHIBITED.

2. **The 4 Observability Pillars**:
   - **Pillar 1: Health Dual-Probe (`/health`)**:
     - `livez: boolean`: Confirms HTTP server process event loop responsiveness.
     - `readyz: boolean`: Confirms app-dedicated Turso database connectivity and readiness.
     - Metrics: RAM memory (MB), CPU load, process uptime, and latency.
     - Dockerfile: Mandatory `HEALTHCHECK` probe.
   - **Pillar 2: Browser Console Logs (`browser.log`)**:
     - Client-side error bridge forwarding unhandled errors, `console.error/warn`, and network failures to `POST /api/logs/browser`.
   - **Pillar 3: Docker Container Logs (`docker.log`)**:
     - Container lifecycle and stdout/stderr logs.
   - **Pillar 4: Backend Server & DB Logs (`app.log`, `db.log`)**:
     - `app.log`: Incoming HTTP requests via `createSafeHandler` with method, path, status, and duration.
     - `db.log`: Turso SQLite query telemetry, transaction commits, and slow query warnings ($>10\text{ms}$).

3. **Strict Size Limits & Rolling File Rotation**:
   - Max file size: 5 MB per log file.
   - Rolling backups: Maximum 3 files (`*.log`, `*.log.1`, `*.log.2`).
   - In-memory ring buffer: Capped at 1,000 entries per app.
   - Total disk storage per app: $\le 25\text{ MB}$.

4. **Crash Durability & Boot Markers**:
   - All logs persist to disk across reboots.
   - Every service must emit a structured `[SYSTEM_BOOT]` marker upon starting.

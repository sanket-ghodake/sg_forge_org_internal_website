# 📜 Authentication Microservice Logs (`apps/src/auth/logs/`)

Isolated security, session, and token audit logs for Auth Service (Port 3001).

## Files & Retention
- **`app.log`**: Token verification, login/logout events, and RBAC problem reports.
- **`browser.log`**: Client-side login flow and cookie/storage errors.
- **`db.log`**: User session and credential database queries (`platform_core.db`).
- **`docker.log`**: Container lifecycle logs (`forge-auth-dev`).
- **Policy**: 5MB rolling rotation, max 3 backup files.

# 📜 Expenses Micro-App Logs (`forge-apps/expenses/logs/`)

Isolated runtime, browser, and database logs for Expense Approval Engine (Port 8085).

## Files & Retention
- **`app.log`**: Expense submission and approval API route executions.
- **`browser.log`**: Client UI interaction, form validations, and network errors.
- **`db.log`**: Dedicated Turso database (`expenses_turso.db`) query execution and transaction logs.
- **`docker.log`**: Container lifecycle logs (`forge-app-expenses`).
- **Policy**: 5MB rolling rotation, max 3 backup files.

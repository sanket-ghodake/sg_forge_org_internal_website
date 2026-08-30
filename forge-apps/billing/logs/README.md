# 📜 Billing Micro-App Logs (`forge-apps/billing/logs/`)

Isolated financial ledger and invoicing logs for Billing Micro-App (Port 8086).

## Files & Retention
- **`app.log`**: Invoice generation and ledger balance calculations.
- **`browser.log`**: Billing UI dashboard and client error logs.
- **`db.log`**: Dedicated Turso database (`billing_turso.db`) query execution and transaction logs.
- **`docker.log`**: Container lifecycle logs (`forge-app-billing`).
- **Policy**: 5MB rolling rotation, max 3 backup files.

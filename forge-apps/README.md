# 🧩 Forge Micro-Apps (`forge-apps/`)

Independent, polyglot, sandboxed micro-frontends running in Docker containers with dedicated Turso (libSQL/SQLite) databases.

---

## 🗂️ Micro-Apps Catalog

| App Directory | Service Port | Public Path | Database | Tech Stack |
| :--- | :---: | :--- | :--- | :--- |
| **[`expenses/`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/expenses/)** | `:8085` | `/apps/expenses` | Dedicated `expenses.db` | Python / FastAPI |
| **[`billing/`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/billing/)** | `:8086` | `/apps/billing` | Dedicated `billing.db` | Go / Fiber |
| **[`telemetry/`](file:///home/sanket/Desktop/Sanket/org_website_clone/forge-apps/telemetry/)** | `:8087` | `/apps/telemetry` | Dedicated `telemetry.db` | TypeScript / Hono |

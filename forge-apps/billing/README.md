# 🧾 Invoicing & Billing Service (`forge-apps/billing`)

Polyglot micro-app managing corporate client subscriptions, invoice generation, payment ledgers, and revenue aggregation.

---

## 📊 Code & Architecture Metrics

*Generated using portable toolchain (`portables/bin/scc` & `scripts/verify-gate.ts`)*

| Metric | Value | Details / Specification |
| :--- | :--- | :--- |
| **Micro-App Directory**| `forge-apps/billing` | Isolated Polyglot Forge App |
| **Ingress Port / Route**| `:8086` &rarr; `/apps/billing` | Reverse proxy gateway upstream |
| **Total Files** | `13` files | Server, DB client, UI, Docker, 5-tier test suites |
| **Lines of Code (SLOC)**| `363` SLOC | 489 total lines (53 comments, 73 blanks) |
| **Complexity Score** | `29` | Financial ledger & invoice querying |
| **Language Breakdown** | TypeScript (310 SLOC), Markdown (40), Docker (13) | 100% type-safe |
| **Database Instance** | `billing.db` | Dedicated Turso libSQL/SQLite database |
| **Auth & RBAC Scope** | `roles/billing.admin`, `roles/super_admin` | Strict financial clearance guard |
| **5-Tier Test Suite** | `5` passing tests | `test/unit/`, `test/integration/`, `test/security/`, `test/contracts/`, `test/e2e/` |
| **Verification Gate** | **100% Passing** ✅ | 100% Database Isolation & RBAC Branch Coverage |

---

## 🚀 Key Features

* **High-Security Financial Ledger**: Restricted to authorized billing administrators (`roles/billing.admin`).
* **Active Ledger Summary**: Real-time aggregation of active invoice totals and client volume.
* **Dedicated Turso DB**: Isolated `billing_invoices` table seeded automatically on first launch.
* **REST & HTML Endpoints**: Serves interactive Meta Astryx ledger interface and JSON API (`/api/invoices`).

---

## 📁 Internal Architecture

```text
forge-apps/billing/
├── README.md                      # Service documentation & code metrics
├── src/
│   ├── server.ts                  # Bun HTTP server & RBAC guard
│   └── db/
│       ├── index.ts               # Dedicated Turso SQLite client & seed data
│       └── README.md              # Database documentation
├── db/                            # Migration artifacts
├── docker/
│   └── Dockerfile                 # Multi-stage production container
├── logs/                          # Isolated structured JSON log sink
└── test/                          # 5-Tier test suite (unit, integration, security, contracts, e2e)
```

---

## 🏃 Local Execution & Verification

```bash
# Run server standalone
rtk bun forge-apps/billing/src/server.ts

# Run test suite
rtk bun test forge-apps/billing/test/
```

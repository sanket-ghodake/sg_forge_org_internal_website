# 💳 Expense Approval Engine (`forge-apps/expenses`)

Polyglot micro-app for employee expense submissions, linear upward management approval chains, and direct reports queue management.

---

## 📊 Code & Architecture Metrics

*Generated using portable toolchain (`portables/bin/scc` & `scripts/verify-gate.ts`)*

| Metric | Value | Details / Specification |
| :--- | :--- | :--- |
| **Micro-App Directory**| `forge-apps/expenses` | Isolated Polyglot Forge App |
| **Ingress Port / Route**| `:8085` &rarr; `/apps/expenses` | Reverse proxy gateway upstream |
| **Total Files** | `11` files | Server, UI, Docker, and 5-tier test suites |
| **Lines of Code (SLOC)**| `316` SLOC | 425 total lines (47 comments, 62 blanks) |
| **Complexity Score** | `32` | Highly cohesive approval chain router |
| **Language Breakdown** | TypeScript (265 SLOC), Markdown (38), Docker (13) | 100% type-safe |
| **Database Instance** | `expenses.db` | Dedicated Turso libSQL/SQLite database |
| **Auth & RBAC Scope** | `roles/employee`, `roles/super_admin` | Zero-Trust JWT session guard |
| **5-Tier Test Suite** | `5` passing tests | `test/unit/`, `test/integration/`, `test/security/`, `test/contracts/`, `test/e2e/` |
| **Verification Gate** | **100% Passing** ✅ | Strict Scoped Hierarchy & Zero-Trust Compliance |

---

## 🚀 Key Features

* **Linear Upward Management Chain**: Resolves caller's direct manager and skip-level approver via `@forge/sdk` `getScopedHierarchy()`.
* **Direct Reports Approval Queue**: Automatically detects if caller is a manager and displays pending expense approvals for their reporting line.
* **Meta Astryx UI**: Styled with `@forge/ui` card components, hierarchy pills, and responsive layout.
* **4-Pillar Observability**: Structured JSON logs and browser error beacon reporting.

---

## 📁 Internal Architecture

```text
forge-apps/expenses/
├── README.md                      # Service documentation & code metrics
├── src/
│   └── server.ts                  # Bun HTTP server, auth guard & HTML renderer
├── db/                            # Dedicated SQLite database migrations
├── docker/
│   └── Dockerfile                 # Multi-stage production container
├── logs/                          # Isolated structured JSON log sink
└── test/                          # 5-Tier test suite (unit, integration, security, contracts, e2e)
```

---

## 🏃 Local Execution & Verification

```bash
# Run server standalone
rtk bun forge-apps/expenses/src/server.ts

# Run test suite
rtk bun test forge-apps/expenses/test/
```

# 🔒 Central Identity & Auth Service (`@forge/auth`)

Central authentication, generic organizational hierarchy, GCP-style IAM policy engine, session management, and public JWKS token issuer serving on Port `:3004` (proxied at `/auth`).

---

## 🚀 Features
* **Generic Polymorphic Org Structure**: Dynamic node types (`Division`, `Department`, `Faculty`, `Ward`, `Squad`) with materialized path trees and multi-dimensional reporting chains.
* **GCP-Style Granular IAM**: Permissions, predefined & custom roles, and resource-scoped policy bindings (`org/*`, `nodes/tech/*`, `apps/billing`).
* **ASVS 5.0 Zero-Trust Cryptography**: Ed25519 asymmetric token signing with public JWKS (`/.well-known/jwks.json`) for zero-latency offline verification across distributed microservices.
* **Refresh Token Rotation (RTR)**: Single-use refresh token families with automated replay detection and instant family revocation.
* **First-Login Password Lifecycle**: Enforces mandatory permanent password setup on first access with live complexity and entropy validation.
* **Dynamic White-Label Rebranding**: Dynamically adapts brand name, logo, and tagline from `.env`.

---

## 👥 Seeded Test Personas (Default Password: `password123`)

| Persona | Email | Role | Department / Node |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** | `superadmin@forge.internal` | `roles/super_admin` (All `*`) | HQ (Root Org) |
| **Sarah Vance** | `security@forge.internal` | `roles/security.admin` | Security & Cloud Ops |
| **Marcus Sterling** | `billing.admin@forge.internal` | `roles/billing.admin` | Accounting & Billing |
| **Devon Hayes** | `developer@forge.internal` | `roles/dev.operator` | Core Platform Eng |
| **Bob Miller** | `bob.lead@forge.internal` | `roles/employee` (Lead) | Core Platform Eng |
| **Alice Chen** | `alice.eng@forge.internal` | `roles/employee` (Senior Eng) | Backend & Infra Squad |
| **Carol Wright** | `carol.fin@forge.internal` | `roles/employee` (Analyst) | Accounting & Billing |

---

## 📡 API Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/auth/login` | Meta Astryx Login page with Quick Test Personas |
| `GET` | `/auth/set-password` | First-time password setup wizard |
| `POST` | `/api/v1/auth/login` | Authenticate email & password (returns `MUST_CHANGE_PASSWORD` or session) |
| `POST` | `/api/v1/auth/set-password` | Update permanent password & issue session |
| `POST` | `/api/v1/auth/refresh` | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | Revoke active session |
| `GET` | `/api/v1/auth/directory` | Fetch org tree nodes & user directory |
| `GET` | `/.well-known/jwks.json` | Public JWKS keys for offline verification |
| `GET` | `/health` | Service health status |

---

## 🏃 Local Execution & Testing

```bash
# Run standalone server
bun apps/src/auth/src/server.ts

# Run test suite
rtk bun test apps/src/auth/test/
```

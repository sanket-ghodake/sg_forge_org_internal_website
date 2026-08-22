# 🔒 Central Identity & Auth Service (`@forge/auth`)

Central authentication, role-based access control (RBAC), session management, and scoped JWT token issuer serving on Port `:3004` (proxied at `/auth`).

---

## 🚀 Features
* **OWASP ASVS 5.0 Compliant**: Scoped JWT token issuance with rotating secrets.
* **Stateless Session Validation**: Cross-origin iframe postMessage handshake validation.
* **Structured Observability**: Integrated with `@forge/sdk` `createLogger` and `createSafeHandler`.

---

## 🏃 Local Execution
```bash
bun apps/src/auth/src/server.ts
```

# 🐳 Expenses Micro-App Container Specification (`docker/`)

OCI container configuration and Dockerfile recipes for `forge-apps/expenses`.

---

## 🚀 Specifications
- **Base Image**: `oven/bun:1.3-alpine` (<90MB footprint).
- **Listening Port**: `8085` (Mapped via Caddy reverse proxy to `/apps/expenses`).
- **Healthcheck**: Periodic automated `/health` endpoint probe.

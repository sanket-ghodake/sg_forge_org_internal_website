# 🐳 Billing Micro-App Container Specification (`docker/`)

OCI container configuration and Dockerfile recipes for `forge-apps/billing`.

---

## 🚀 Specifications
- **Base Image**: `oven/bun:1.3-alpine` (<90MB footprint).
- **Listening Port**: `8086` (Mapped via Caddy reverse proxy to `/apps/billing`).
- **Healthcheck**: Periodic automated `/health` endpoint probe.

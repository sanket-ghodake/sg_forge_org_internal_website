# 🛡️ Pre-Rendered Static Error Pages (`proxy/errors`)

This directory contains standalone, 100% air-gapped Meta Astryx HTML error screens pre-rendered from `@forge/ui`.

## 📌 Features
- **Zero Runtime Dependencies**: Plain HTML with inlined CSS variables, responsive containers, and dark-mode script. No Node/Bun runtime or DB needed to render.
- **Caddy Ingress Integration**: Mounted into the Caddy reverse proxy at `/etc/caddy/errors` to intercept upstream crashes (HTTP 502/503/504) for all core services and Forge micro-apps.
- **Host Fallback Integration**: Directly served by `scripts/fallback-server.ts` if Docker or Caddy is completely offline.

## 🛠️ Generated Files
- `502.html`: Service Temporarily Offline / Upstream Unavailable (served when any container or process crashes).
- `503.html`: System Under Maintenance (served during planned outages or via the host fallback server).
- `500.html`: Internal Server Error.
- `404.html`: Resource Not Found.

## 🔄 Regeneration
To regenerate these assets after updating branding or design tokens:
```bash
rtk bun scripts/generate-error-pages.ts
```
Or run:
```bash
rtk ./run.sh sync-proxy
```

# 🔀 Unified Reverse Proxy Gateway (`proxy/`)

High-performance reverse proxy routing gateway (Caddy v2.11.4 LTS).

* **Auto-Generated File**: [`Caddyfile`](file:///home/sanket/Desktop/Sanket/org_website_clone/proxy/Caddyfile) is dynamically generated from `.env` via `scripts/generate-proxy.ts`.
* **Static Error Pages**: Mounted from `proxy/errors/` to `/etc/caddy/errors` for zero-dependency Astryx error screens during backend or Forge App outages.
* **Sync Command**: `./run.sh sync-proxy` (automatically compiles error pages and updates Caddyfile)

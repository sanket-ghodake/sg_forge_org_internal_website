# 🔀 Unified Reverse Proxy Gateway (`proxy/`)

High-performance reverse proxy routing gateway (Caddy v2.11.4 LTS).

* **Auto-Generated File**: [`Caddyfile`](file:///home/sanket/Desktop/Sanket/org_website_clone/proxy/Caddyfile) is dynamically generated from `.env` via `scripts/generate-proxy.ts`.
* **Static Error Pages**: Mounted from `proxy/errors/` to `/etc/caddy/errors` for zero-dependency Astryx error screens during backend or Forge App outages.
* **Sync Command**: `./run.sh sync-proxy` (automatically compiles error pages and updates Caddyfile)

---

## 🔒 Production TLS & Ingress Configuration

* **Air-Gapped Local Internal PKI (Default)**:
  Set `ENABLE_HTTPS=true` and `HTTPS_PORT=443` (or `PROD_HTTPS_PORT=443`) in `.env`. Running `./run.sh sync-proxy` adds `tls internal` to generate self-signed enterprise certificates offline without external ACME lookups.
* **Custom Enterprise CA Certificates**:
  Set `TLS_CERT_PATH=/path/to/cert.pem` and `TLS_KEY_PATH=/path/to/key.pem` in `.env`. Caddy will mount and serve your organization's verified certificates.
* **Ports**: In development, HTTP uses `:8080` and HTTPS uses `:8443`. In production Docker stacks, ports `:80` and `:443` are bound.

# 🛠️ Platform Automation Scripts (`scripts/`)

Build, verification, orchestration, and audit logging scripts.

* **[`verify-gate.ts`](file:///home/sanket/Desktop/Sanket/org_website_clone/scripts/verify-gate.ts)**: 2-tier pre-commit quality gate (12 deterministic checks + 4 AI semantic evaluations).
* **[`log-commit.ts`](file:///home/sanket/Desktop/Sanket/org_website_clone/scripts/log-commit.ts)**: Automated ground-truth Git post-commit extractor. Appends structured JSON to `logs/commits.jsonl` and formatted entries to `logs/WORKLOGS.md`.
* **[`seed-cro-org.ts`](file:///home/sanket/Desktop/Sanket/org_website_clone/scripts/seed-cro-org.ts)**: Populates the live Auth database with a complete 54-member organizational hierarchy rooted at the Chief Revenue Officer (CRO).
* **[`generate-proxy.ts`](file:///home/sanket/Desktop/Sanket/org_website_clone/scripts/generate-proxy.ts)**: Reads `.env` and generates `proxy/Caddyfile` with dynamic route ingress and `handle_errors` outage fallback.
* **[`generate-error-pages.ts`](file:///home/sanket/Desktop/Sanket/org_website_clone/scripts/generate-error-pages.ts)**: Pre-compiles standalone Meta Astryx error pages (`502.html`, `503.html`, `500.html`, `404.html`) into `proxy/errors/`.
* **[`fallback-server.ts`](file:///home/sanket/Desktop/Sanket/org_website_clone/scripts/fallback-server.ts)**: Standalone host-level micro-daemon (Approach A) serving Astryx system-down pages when Docker/Caddy is offline.
* **[`dev-runner.ts`](file:///home/sanket/Desktop/Sanket/org_website_clone/scripts/dev-runner.ts)**: Dynamic native development supervisor with port collision detection, SIGINT process group cleanup, and registry-driven service discovery.

# 📊 Developer Monitoring Dashboard (`@forge/dev-dashboard`)

Real-time platform telemetry, database diagnostics, and live log streaming dashboard serving on Port `:3002` (proxied at `/devcenter`). Built to Google SRE & Meta Astryx Enterprise Standards.

---

## 🚀 Key Capabilities

1. **System Topology & Vitals Overview**: Real-time micro-service node diagram with live latencies, RAM usage, and cluster health indicators.
2. **Process Management & Controls**: Live process table with `Start`, `Stop`, and `Restart` lifecycle triggers.
3. **Dynamic Forge Apps Registry**: Database-driven app discovery in `platform_core.db` (`apps_registry` table) with dedicated per-app Turso SQLite databases (`data/app_*.db`).
4. **Turso DB Explorer & SQL Playground**: Multi-database schema inspector, table browser, and monospace SQL editor with `READ_ONLY` safety sandbox.
5. **Live SSE Log Streamer**: Zero-disk-churn in-memory ring buffer streaming logs via Server-Sent Events (`/api/logs/stream`).
6. **Traffic & SRE Golden Signals**: Real-time request telemetry, response durations, and status code distributions.
7. **RFC 7807 Issue Center**: Deduplicated exception logs grouped by fingerprint with sanitized stack traces.
8. **Host & Cloud Infrastructure**: Host hardware vitals (CPU load, memory percent, uptime) and GCP cloud scaling metrics.

---

## 🛠️ Internal Architecture

```text
apps/src/dev-dashboard/
├── README.md                      # Service documentation
├── package.json                   # Dependencies & package manifest
├── src/
│   ├── README.md                  # Source overview & module exports
│   ├── index.ts                   # Main barrel export
│   ├── server.ts                  # Bun HTTP server & dual-probe health endpoints
│   ├── backend/
│   │   ├── README.md              # Backend engine documentation
│   │   ├── api-handlers.ts        # REST & SSE API route dispatchers
│   │   ├── services-controller.ts # Process lifecycle & health prober
│   │   ├── telemetry.ts           # In-memory circular ring buffer & SSE streamer
│   │   └── index.ts               # Backend exports
│   ├── frontend/
│   │   ├── README.md              # Frontend UI architecture documentation
│   │   ├── ui-renderer.ts         # High-density SPA HTML document assembler
│   │   ├── ui-styles.ts           # Meta Astryx CSS layout & token styles
│   │   ├── ui-scripts.ts          # Client-side SPA navigation & SSE listeners
│   │   └── index.ts               # Frontend exports
│   └── db/
│       ├── README.md              # Database layer documentation
│       ├── db.ts                  # Turso/libSQL manager with WAL & query sandbox
│       └── index.ts               # Database exports
├── test/
│   ├── README.md                  # Test suite documentation
│   └── dashboard.test.ts          # Colocated 3A pattern unit tests
└── docker/
    ├── README.md                  # Container documentation
    └── Dockerfile                 # Lightweight Alpine Bun container
```

---

## 🏃 Local Execution & Verification

```bash
# Run server standalone
rtk bun apps/src/dev-dashboard/src/server.ts

# Run test suite
rtk bun test
```

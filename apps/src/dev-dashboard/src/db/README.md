# 🗄️ Dev Dashboard Database Engine (`src/db/`)

Core platform database manager managing `platform_core.db` using Turso / native SQLite.

---

## 🚀 Features
- **WAL Journal Mode**: High-concurrency readers and writers without lock contention.
- **Incremental Auto-Vacuum**: Keeps total disk footprint capped and bounded under 50MB.
- **Dynamic App Registry**: Stores runtime service metadata (`apps_registry` table).
- **SRE Telemetry & Traffic Logs**: Records real-time HTTP metrics and RFC 7807 issue reports.
- **Safe SQL Query Sandbox**: Prevents unintended mutations in `READ_ONLY` mode.

# 📊 Developer Monitoring Dashboard (`@forge/dev-dashboard`)

Real-time platform telemetry and container diagnostics dashboard serving on Port `:3002` (proxied at `/devcenter`).

---

## 🚀 Features
* **Streaming Telemetry**: Live CPU, memory usage, network I/O, and active container states.
* **Health Probes**: Automated status monitoring of all platform micro-services and Forge micro-apps.
* **Meta Astryx UI**: Built with `@forge/ui` card components and live status dots.

---

## 🏃 Local Execution
```bash
bun apps/src/dev-dashboard/src/server.ts
```

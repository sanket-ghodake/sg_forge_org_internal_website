# 📦 Forge Foundation SDK (`@forge/sdk`)

Core SDK library providing Google SRE structured logging, RFC 7807 problem error boundaries, dynamic service registry, and the postMessage client bridge.

---

## 🛠️ Exports
* `createLogger(serviceName)`: Google SRE structured JSON telemetry logger.
* `createSafeHandler(serviceName, fn)`: RFC 7807 problem error boundary wrapper.
* `loadServiceRegistry()`: Dynamic `.env` app registry parser.
* `ForgeClient`: Client-side micro-app iframe postMessage bridge.

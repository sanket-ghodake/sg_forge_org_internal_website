# 🌐 Landing Discovery Hub (`@forge/landing`)

Public ingress portal serving on Port `:3000` (proxied at root `/` on Ports 80 & 443).

---

## 🚀 Features
* **Dynamic Service Registry**: Loads registered services dynamically from `@forge/sdk/registry` (`.env`).
* **Meta Astryx UI**: Consumes `@forge/ui` with high-contrast tokens and SVG theme toggler.
* **Tab Isolation**: Distinct apps open in a new tab (`target="_blank" rel="noopener noreferrer"`).
* **Live Health Checks**: Probes internal micro-services and micro-apps in real-time.

---

## 🏃 Local Execution
```bash
bun apps/src/landing/src/server.ts
```

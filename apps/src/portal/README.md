# 🧭 Main Workspace & 2D Org Canvas (`@forge/portal`)

Primary enterprise employee workspace, visual 2D interactive organizational canvas, and sandboxed micro-app host serving on Port `:3001` (proxied at `/portal`).

---

## 🚀 Features
* **2D Visual Org Canvas**: High-performance pan/zoom canvas rendering teams, reporting chains, and entities.
* **Zero-Trust Iframe Sandbox**: Hosts isolated micro-apps (`forge-apps/*`) securely with postMessage context bridges.
* **Meta Astryx Design System**: Fully styled using `@forge/ui` tokens.

---

## 🏃 Local Execution
```bash
bun apps/src/portal/src/server.ts
```

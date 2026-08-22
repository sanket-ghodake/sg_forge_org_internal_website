# 📦 Platform Services & Shared Libraries (`apps/src/`)

This directory contains all runnable platform micro-services and monorepo shared packages.

---

## 🗂️ Services & Packages Matrix

| Directory | Package Name | Port | Type | Purpose |
| :--- | :--- | :---: | :---: | :--- |
| **[`landing/`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/landing/)** | `@forge/landing` | `:3000` | Service | Public Ingress Discovery Hub & Route Directory |
| **[`auth/`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/auth/)** | `@forge/auth` | `:3004` | Service | Central Identity Provider & Scoped JWT Token Issuer |
| **[`portal/`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/portal/)** | `@forge/portal` | `:3001` | Service | Main Workspace, 2D Org Canvas & App Launcher |
| **[`dev-dashboard/`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/dev-dashboard/)** | `@forge/dev-dashboard`| `:3002` | Service | Live Streaming Container Telemetry & Metrics |
| **[`dev-hub/`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/dev-hub/)** | `@forge/dev-hub` | `:3003` | Service | Developer SDK Playground & Scaffolding Guides |
| **[`sdk/`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/sdk/)** | `@forge/sdk` | N/A | Library | Google SRE Logger, RFC 7807 Handlers & Service Registry |
| **[`ui/`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/ui/)** | `@forge/ui` | N/A | Library | Meta Astryx Design System Tokens & Animated Header |
| **[`types/`](file:///home/sanket/Desktop/Sanket/org_website_clone/apps/src/types/)** | `@forge/types` | N/A | Library | Domain Interfaces, RBAC Models & PostMessage Contracts |

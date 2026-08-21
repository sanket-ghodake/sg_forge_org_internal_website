# 01. Platform Architecture & Service Topology

## 1. Network Topology & Port Mapping

The platform exposes unified ingress through a single reverse proxy (Caddy / Nginx) on standard web ports while keeping direct internal ports accessible for developer testing.

```text
┌────────────────────────────────────────────────────────────────────────┐
│               UNIFIED REVERSE PROXY & GATEWAY (Port 80 / 443)          │
└────────────────────────────────────────────────────────────────────────┘
       │                 │                    │                  │
       ▼                 ▼                    ▼                  ▼
  [ / (Root) ]       [ /portal ]        [ /devcenter ]      [ /gateway ]
  Landing Page      Main Portal          Dev Dashboard       Developer Hub
  (Port 80/443)     (Port 3001)          (Port 3002)         (Port 3003)
                         │
                         ▼
                 [ /apps/:slug/ ]
           Dynamic Forge Apps Sandbox
             (:8085, :8086, :8087...)
```

### Port Allocation Matrix

| Service / App | Internal Port | Ingress Route (Proxy) | Purpose |
| :--- | :--- | :--- | :--- |
| **Reverse Proxy** | `80`, `443` | `http://localhost/` | Single entry point, SSL termination, dynamic app routing. |
| **Landing Page** | `80`, `443` | `http://localhost/` | Public discovery page, company overview, navigation. |
| **Main Portal** | `3001` | `http://localhost/portal` | Employee Org Canvas, App Catalog, Admin Management. |
| **Developer Dashboard** | `3002` | `http://localhost/devcenter` | Container telemetry, live streaming logs, DB health. |
| **Developer Hub** | `3003` | `http://localhost/gateway` | SDK specs, API sandbox, interactive Docker scaffolding guides. |
| **Forge App: Expenses** | `8085` | `http://localhost/apps/expenses/` | Example Python/FastAPI micro-app with dedicated Turso DB. |
| **Forge App: Billing** | `8086` | `http://localhost/apps/billing/` | Example Go/Fiber micro-app with dedicated Turso DB. |
| **Forge App: Telemetry** | `8087` | `http://localhost/apps/telemetry/` | Example TypeScript/Hono micro-app with dedicated Turso DB. |

---

## 2. Core Service Boundaries

```text
forge-monorepo/
├── apps/
│   ├── landing/          # Public marketing & status landing page
│   ├── auth/             # Centralized Auth & JWT token issuer
│   ├── portal/           # Next.js 15+ App Router Main Portal (Astryx UI)
│   ├── dev-dashboard/    # Real-time monitoring & container log tailer
│   └── dev-hub/          # Interactive SDK playground & docs
│
├── packages/
│   ├── sdk/              # Client & Backend Forge SDK (@forge/sdk)
│   ├── ui/               # Astryx UI tokens & component wrappers
│   └── types/            # Shared TypeScript contracts & models
│
└── forge-apps/           # Decoupled micro-applications (Dockerized)
```

### Key Responsibilities of Each Core App

1. **`apps/landing`**:
   - Zero-auth public landing experience.
   - Company branding, system status check, and deep-link routing.

2. **`apps/auth`**:
   - Manages user login, session cookies, and multi-factor authentication.
   - Issues short-lived, scoped JWT tokens for Forge Apps to verify employee identity.

3. **`apps/portal` (Port 3001)**:
   - **Org Canvas**: Visual node graph representing departments, teams, and employees with Macro/Meso/Micro zoom levels.
   - **App Catalog**: Grid view of all registered Forge Apps. Filterable by category, permission tier, and favorite status.
   - **Admin Management**: User creation, CSV bulk ingestion, role assignments, dynamic metadata (Verticals, Divisions, Designations).
   - **Access Request Queue**: Workflow manager where admins/managers approve or reject app access requests.

4. **`apps/dev-dashboard` (Port 3002)**:
   - Live streaming logs from Docker containers and background processes.
   - Real-time CPU, RAM, and disk utilization metrics.
   - Health status matrix for all active Forge App containers.

5. **`apps/dev-hub` (Port 3003)**:
   - Interactive developer documentation.
   - Forge SDK code snippets and quickstart generators.
   - Live API tester for verifying token handshakes.

---

## 3. Reverse Proxy Configuration Strategy

We utilize a lightweight **Caddy** (or Nginx) container that dynamically routes traffic without requiring rebuilds:

```caddy
# Example Caddyfile Routing Rule
:80 {
    # Public Landing Page
    handle / {
        reverse_proxy http://landing:3000
    }

    # Main Portal
    handle_path /portal* {
        reverse_proxy http://portal:3001
    }

    # Developer Dashboard
    handle_path /devcenter* {
        reverse_proxy http://dev-dashboard:3002
    }

    # Developer Hub & SDK Playground
    handle_path /gateway* {
        reverse_proxy http://dev-hub:3003
    }

    # Dynamic Forge App Routing
    handle_path /apps/expenses* {
        reverse_proxy http://app-expenses:8085
    }
    handle_path /apps/billing* {
        reverse_proxy http://app-billing:8086
    }
    handle_path /apps/telemetry* {
        reverse_proxy http://app-telemetry:8087
    }
}
```

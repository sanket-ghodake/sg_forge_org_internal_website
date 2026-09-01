# 📦 Forge Foundation SDK (`@forge/sdk`)

Enterprise Foundation SDK suite for **SG Forge** microservices (`apps/src/*`) and independent Forge micro-apps (`forge-apps/*`).

---

## 🛠️ Core SDK Modules & Exports

### 1. Structured Logging & Telemetry Engine (`logger.ts`)
* `createLogger(serviceName, customLogDir?)`: Creates a `ForgeLogger` instance.
* `redactSensitiveData(data)`: Enterprise recursive PII and credential sanitizer (passwords, tokens, Bearer headers, API keys).
* `explainLog(logEntry)`: Deterministic plain-English heuristic generator for operational logs.
* `ForgeLogger.logDbQuery(sql, durationMs, err?, traceId?)`: Microsecond database query timing with slow-query warnings.
* `ForgeLogger.logBrowserEvent(severity, message, meta?, err?, traceId?)`: Browser telemetry log sink.

### 2. Error Boundaries & RFC 7807 Wrapper (`error-handler.ts`)
* `createSafeHandler(serviceName, handler, customLogDir?)`: Wraps Bun/Node HTTP request handlers in standard RFC 7807 problem details (`application/problem+json`) with immutable `x-trace-id` propagation and execution timing.

### 3. Zero-Trust SSO Auth & RBAC Gate (`auth-guard.ts`)
* `verifySessionToken(token)`: High-performance asymmetric Ed25519 signature validation (<0.1ms without central DB hit).
* `authGuard(req, options)`: Zero-Trust gateway middleware with direct-jump `return_url` preservation, public path bypasses, and role/permission gates with Meta Astryx 403 fallback.

### 4. Directory & Scoped Employee Hierarchy Client (`directory-client.ts`)
* `fetchOrgDirectory(baseUrl?)`: Fetches complete organization directory and department tree.
* `getScopedHierarchy(userIdOrEmail, baseUrl?)`: Fetches targeted linear management chain upward to executive level and direct reports downward for a specific employee.
* `getMyHierarchy(req, baseUrl?)`: Resolves the calling user's personal hierarchy directly from request session.
* `isManagerOf(candidateManagerId, employeeId, baseUrl?)`: Validates whether managerId exists in the employee's upward chain of command.

### 5. Dynamic Ingress & Service Registry (`registry.ts`)
* `loadServiceRegistry(envPath?)`: Parses declarative `.env` app registrations (`APP_<NAME>`) to derive service topology, ports, health endpoints, and container naming.

### 6. Micro-App Client & Browser Bridge (`client-bridge.ts` & `browser-bridge.ts`)
* `ForgeClient.init(options)`: `postMessage` handshake bridge between micro-app iframes and parent Portal for user context, auth tokens, theme synchronization, and authenticated `fetch()`.
* `initBrowserLogBridge(serviceName, ingestEndpoint?)`: Client-side uncaught error & console interception with sanitized beacon forwarding to `/api/logs/browser`.

---

## 🚀 Quick Usage Examples

### Scoped Employee Hierarchy Lookup
```typescript
import { getScopedHierarchy, isManagerOf } from '@forge/sdk';

// 1. Fetch targeted hierarchy
const hierarchy = await getScopedHierarchy('usr-alice-eng');
console.log('Employee:', hierarchy.employee.displayName);
console.log('Direct Manager:', hierarchy.managementChain[0]?.displayName);
console.log('Direct Reports:', hierarchy.directReports.map(r => r.displayName));

// 2. Validate approval authority
const canApprove = await isManagerOf('usr-bob-lead', 'usr-alice-eng');
console.log('Can approve:', canApprove); // true
```

### Micro-App Safe HTTP Server
```typescript
import { authGuard, createLogger, createSafeHandler } from '@forge/sdk';

const logger = createLogger('my-service');

export const server = Bun.serve({
  port: 8088,
  fetch: createSafeHandler('my-service', async (req) => {
    const auth = authGuard(req, {
      appName: 'My Microservice',
      requiredRoles: ['roles/employee']
    });
    if (!auth.authenticated) return auth.response!;

    return Response.json({ status: 'ok', user: auth.user });
  })
});
```

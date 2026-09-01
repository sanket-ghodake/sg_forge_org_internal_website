/**
 * @forge/dev-hub - Developer Hub & Interactive SDK Explorer View (2026 LTS)
 * Meta Astryx Design Standards & Google Cloud Documentation UX.
 */

import { getAstryxHeaderHtml, getAstryxStyles } from '@forge/ui';

export function renderDevHubHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SG Forge - Developer Hub & SDK Documentation</title>
  <style>
    ${getAstryxStyles()}
    .code-block {
      background: var(--forge-bg-root);
      border: 1px solid var(--forge-border);
      border-radius: var(--forge-radius);
      padding: 1rem;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.82rem;
      color: var(--forge-text-main);
      overflow-x: auto;
      margin: 0.75rem 0 1.25rem 0;
      line-height: 1.5;
    }
    .endpoint-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(62, 207, 142, 0.12);
      border: 1px solid var(--forge-primary);
      color: var(--forge-primary);
      padding: 0.2rem 0.6rem;
      border-radius: var(--forge-radius);
      font-family: monospace;
      font-size: 0.78rem;
      font-weight: 700;
    }
    .method-get {
      background: rgba(62, 207, 142, 0.2);
      color: var(--forge-primary);
      padding: 0.15rem 0.45rem;
      border-radius: 3px;
      font-weight: 700;
    }
    .method-post {
      background: rgba(59, 130, 246, 0.2);
      color: var(--forge-accent);
      padding: 0.15rem 0.45rem;
      border-radius: 3px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  ${getAstryxHeaderHtml('HUB', 'DEVELOPER GATEWAY')}

  <main class="astryx-container">
    <div class="astryx-card" style="margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: inline-block; margin-bottom: 0.5rem;">
            <span class="astryx-badge badge-pill">@forge/sdk v2.0.0 LTS</span>
          </div>
          <h1 style="font-size: 1.65rem; color: var(--forge-text-main); margin: 0 0 0.5rem 0;">📚 Developer Hub & SDK Playground</h1>
          <p style="color: var(--forge-text-muted); margin: 0; max-width: 680px; font-size: 0.9rem;">
            Interactive API playground, Docker micro-app scaffolding templates, and Forge SDK contracts.
          </p>
        </div>
        <div style="display: flex; gap: 0.6rem;">
          <a href="/" class="astryx-btn btn-outline">&larr; Return to Platform Hub</a>
          <a href="/portal" class="astryx-btn btn-outline">Portal &rarr;</a>
        </div>
      </div>
    </div>

    <!-- Quick Navigation Grid -->
    <div class="astryx-grid" style="margin-bottom: 2.5rem;">
      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">📦 Forge SDK Contract</h3>
        <p style="font-size: 0.85rem; color: var(--forge-text-muted); margin-bottom: 1rem;">
          PostMessage handshake protocol, Zero-Trust Auth Guard, and scoped token validation specifications.
        </p>
        <span class="endpoint-badge">import { authGuard } from '@forge/sdk'</span>
      </div>

      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">🐳 Docker App Templates</h3>
        <p style="font-size: 0.85rem; color: var(--forge-text-muted); margin-bottom: 1rem;">
          Lightweight boilerplates for Python (FastAPI), Go (Fiber), and TypeScript micro-apps.
        </p>
        <span class="endpoint-badge">APP_&lt;NAME&gt; in .env</span>
      </div>

      <div class="astryx-card">
        <h3 style="color: var(--forge-text-main); margin-bottom: 0.5rem;">⚡ 1-Command Scaffolding</h3>
        <p style="font-size: 0.85rem; color: var(--forge-text-muted); margin-bottom: 1rem;">
          Run <code>./run.sh create-app &lt;name&gt;</code> to spin up a fully isolated service.
        </p>
        <span class="endpoint-badge">GET /auth/api/v1/auth/hierarchy/:id</span>
      </div>
    </div>

    <!-- Section 1: Scoped Employee Hierarchy API & Examples -->
    <section class="astryx-card" style="margin-bottom: 2rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid var(--forge-border); padding-bottom: 0.75rem;">
        <div>
          <h2 style="font-size: 1.25rem; color: var(--forge-text-main); margin: 0 0 0.25rem 0;">🏢 Scoped Employee Hierarchy API</h2>
          <span style="font-size: 0.8rem; color: var(--forge-text-muted);">Retrieves strictly the target employee, upward chain to CEO, and direct reports.</span>
        </div>
        <span class="astryx-badge badge-online">Live Endpoint</span>
      </div>

      <div style="margin-bottom: 1rem;">
        <p style="font-size: 0.85rem; color: var(--forge-text-muted);">
          <span class="method-get">GET</span> <code>/auth/api/v1/auth/hierarchy/:id</code> or <code>/auth/api/v1/auth/hierarchy?email=...</code> or <code>/auth/api/v1/auth/hierarchy/me</code>
        </p>
      </div>

      <h4 style="font-size: 0.9rem; color: var(--forge-text-main); margin: 1rem 0 0.35rem 0;">TypeScript / Node / Bun (@forge/sdk):</h4>
      <pre class="code-block"><code>import { getScopedHierarchy, isManagerOf } from '@forge/sdk';

// 1. Fetch targeted hierarchy for any user ID or email
const hierarchy = await getScopedHierarchy('usr-alice-eng');
console.log('Employee:', hierarchy.employee.displayName);
console.log('Direct Manager:', hierarchy.managementChain[0]?.displayName);
console.log('Direct Reports:', hierarchy.directReports.map(r => r.displayName));

// 2. Validate approval authority
const canApprove = await isManagerOf('usr-bob-lead', 'usr-alice-eng');
console.log('Is Bob manager of Alice?', canApprove); // true</code></pre>

      <h4 style="font-size: 0.9rem; color: var(--forge-text-main); margin: 1rem 0 0.35rem 0;">Python (FastAPI / Requests / Flask):</h4>
      <pre class="code-block"><code>import requests

def get_employee_hierarchy(user_id: str):
    url = f"http://auth:3004/api/v1/auth/hierarchy/{user_id}"
    resp = requests.get(url)
    if resp.ok:
        data = resp.json()
        print(f"Employee: {data['employee']['displayName']}")
        print(f"Top Manager: {data['managementChain'][-1]['displayName']}")
        return data
    return None</code></pre>
    </section>

    <!-- Section 2: Zero-Code External Service Integration Guide -->
    <section class="astryx-card" style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.25rem; color: var(--forge-text-main); margin: 0 0 0.5rem 0;">🌐 Zero-Code External Service Integration Guide</h2>
      <p style="font-size: 0.85rem; color: var(--forge-text-muted); margin-bottom: 1.25rem;">
        Integrate third-party tools, Python APIs, or cloud services with zero backend code changes.
      </p>

      <div style="background: var(--forge-bg-surface); border: 1px solid var(--forge-border); border-radius: var(--forge-radius); padding: 1.25rem; margin-bottom: 1.25rem;">
        <h4 style="color: var(--forge-text-main); font-size: 0.95rem; margin: 0 0 0.5rem 0;">1. Add route definition to <code>.env</code></h4>
        <pre class="code-block"><code># Format: APP_&lt;ID&gt;="&lt;Display Name&gt;|&lt;Port/Upstream&gt;|&lt;Path&gt;|&lt;Category&gt;|&lt;Role&gt;|&lt;Container/Host&gt;"

# Example A: Local tool on port 8000 (Protected - Employees only)
APP_MYTOOL="Custom Analytics|8000|/apps/analytics|Tools|Employee / Admin|host.docker.internal"

# Example B: Public Documentation
APP_DOCS="API Documentation|8090|/docs|Developer|Public / Everyone|host.docker.internal"</code></pre>
        
        <h4 style="color: var(--forge-text-main); font-size: 0.95rem; margin: 1rem 0 0.5rem 0;">2. Synchronize Ingress Proxy</h4>
        <pre class="code-block"><code>rtk bun scripts/generate-proxy.ts</code></pre>
        
        <h4 style="color: var(--forge-text-main); font-size: 0.95rem; margin: 1rem 0 0.5rem 0;">3. Injected User Headers (Zero Auth Code in Upstream)</h4>
        <p style="font-size: 0.85rem; color: var(--forge-text-muted);">
          When users access your protected tool, SG Forge Gateway intercepts unauthenticated users, redirects to login, and passes verified identity headers to your backend:
        </p>
        <pre class="code-block"><code>X-Forwarded-User: alice.eng@forge.internal
X-Forwarded-User-Id: usr-alice-eng
X-Forwarded-Role: roles/employee
X-Forwarded-Org-Path: /root/tech/eng-core</code></pre>
      </div>
    </section>
  </main>

  <footer style="margin-top: 3rem; padding: 2rem; text-align: center; border-top: 1px solid var(--forge-border); font-size: 0.8rem; color: var(--forge-text-subtle);">
    SG Forge Developer Gateway &bull; @forge/sdk v2.0.0 LTS &bull; Meta Astryx Design System
  </footer>
</body>
</html>`;
}

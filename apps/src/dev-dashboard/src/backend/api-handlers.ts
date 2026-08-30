/**
 * @forge/dev-dashboard - REST & SSE API Route Handlers (2026 LTS)
 * High-performance JSON endpoints & SSE event streams for Developer Dashboard.
 * Google SRE & Meta Astryx Enterprise Baseline
 */

import { platformDb } from '../db';
import { servicesController } from './services-controller';
import { telemetryEngine } from './telemetry';

export async function handleApiRequest(req: Request, url: URL): Promise<Response | null> {
  const path = url.pathname.replace(/^\/devcenter/, '');

  // 1. SSE Realtime Log Streamer
  if (path === '/api/logs/stream') {
    const stream = new ReadableStream({
      start(controller) {
        telemetryEngine.registerSSEClient(controller);
      },
      cancel(controller) {
        telemetryEngine.removeSSEClient(controller as any);
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  // 1b. Realtime Log Ingest Pipeline
  if (path === '/api/logs/ingest' && req.method === 'POST') {
    const entry: any = await req.json().catch(() => null);
    if (entry && entry.service && entry.message) {
      telemetryEngine.pushLog(
        entry.service,
        entry.severity || entry.level || 'INFO',
        entry.message,
        entry.source || 'app',
        entry.traceId,
        entry.metadata
      );
      return Response.json({ status: 'ok' });
    }
    return Response.json({ error: 'Invalid log payload' }, { status: 400 });
  }

  // 1c. Fetch Recent Logs Filtered by Service / Source / Level
  if (path === '/api/logs/recent' && req.method === 'GET') {
    const service = url.searchParams.get('service') || undefined;
    const source = url.searchParams.get('source') || undefined;
    const level = url.searchParams.get('level') || undefined;
    const limit = Number(url.searchParams.get('limit') || 100);
    const logs = telemetryEngine.getRecentLogs(limit, service, source, level);
    return Response.json({ status: 'ok', logs });
  }

  // 1d. Clear Log Buffer
  if (path === '/api/logs/clear' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}));
    telemetryEngine.clearLogs(body.service);
    return Response.json({ status: 'ok', message: 'Logs cleared successfully' });
  }

  // 2. System Metrics & Telemetry
  if (path === '/api/system/metrics' && req.method === 'GET') {
    const vitals = telemetryEngine.getSystemVitals();
    const services = servicesController.getAllHealthStatuses();
    return Response.json({
      status: 'ok',
      vitals,
      services,
      databases: platformDb.listDatabases(),
      timestamp: Date.now(),
    });
  }

  // 3. Services List & Health
  if (path === '/api/services' && req.method === 'GET') {
    const services = servicesController.getAllHealthStatuses();
    const summary = servicesController.getServicesVitalsSummary();
    return Response.json({ status: 'ok', services, summary });
  }

  // 4. Service Control: Restart
  if (path === '/api/services/restart' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}));
    if (!body.serviceId) {
      return Response.json({ error: 'Missing serviceId' }, { status: 400 });
    }
    const result = await servicesController.restartService(body.serviceId);
    return Response.json(result);
  }

  // 5. Service Control: Toggle (Start / Stop)
  if (path === '/api/services/toggle' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}));
    if (!body.serviceId || !body.state) {
      return Response.json({ error: 'Missing serviceId or state' }, { status: 400 });
    }
    const result = await servicesController.toggleService(body.serviceId, body.state);
    return Response.json(result);
  }

  // 6. Forge Apps Dynamic Registry
  if (path === '/api/apps' && req.method === 'GET') {
    const apps = platformDb.getAppsRegistry();
    return Response.json({ status: 'ok', apps });
  }

  // 7. Database List
  if (path === '/api/db/list' && req.method === 'GET') {
    const dbs = platformDb.listDatabases();
    return Response.json({ status: 'ok', databases: dbs });
  }

  // 8. Execute SQL Query
  if (path === '/api/db/query' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}));
    if (!body.dbName || !body.sql) {
      return Response.json({ error: 'Missing dbName or sql' }, { status: 400 });
    }
    const readOnly = body.readOnly !== false;
    const result = platformDb.executeQuery(body.dbName, body.sql, readOnly);
    return Response.json(result);
  }

  // 9. Optimize Database (Auto-Vacuum & WAL Checkpoint)
  if (path === '/api/db/optimize' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}));
    if (!body.dbName) {
      return Response.json({ error: 'Missing dbName' }, { status: 400 });
    }
    const result = platformDb.optimizeDatabase(body.dbName);
    return Response.json(result);
  }

  // 10. Snapshot & Backup Database
  if (path === '/api/db/backup' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}));
    if (!body.dbName) {
      return Response.json({ error: 'Missing dbName' }, { status: 400 });
    }
    const result = platformDb.backupDatabase(body.dbName);
    return Response.json(result);
  }

  // 11. 1-Click HTTP Latency Benchmark
  if (path === '/api/benchmark' && req.method === 'POST') {
    const start = performance.now();
    const latencies: number[] = [];
    const samples = 15;
    for (let i = 0; i < samples; i++) {
      const s = performance.now();
      await fetch('http://localhost:3002/health').catch(() => null);
      latencies.push(Number((performance.now() - s).toFixed(2)));
    }
    latencies.sort((a, b) => a - b);
    const p50 = latencies[Math.floor(samples * 0.5)];
    const p99 = latencies[samples - 1];
    const avg = Number((latencies.reduce((a, b) => a + b, 0) / samples).toFixed(2));
    const totalDuration = Number((performance.now() - start).toFixed(2));
    const rps = Math.round((samples / totalDuration) * 1000);

    return Response.json({
      status: 'ok',
      samples,
      p50Ms: p50,
      p99Ms: p99,
      avgMs: avg,
      reqPerSec: rps,
      targetMet: p50 < 2.0,
      timestamp: Date.now(),
    });
  }

  // 12. Traffic Telemetry Events
  if (path === '/api/analytics/traffic' && req.method === 'GET') {
    const events = platformDb.getTrafficSummary(100);
    return Response.json({ status: 'ok', events });
  }

  // 11. RFC 7807 Issues & Incident Reports
  if (path === '/api/issues' && req.method === 'GET') {
    const issues = platformDb.getIssues(50);
    return Response.json({ status: 'ok', issues });
  }

  // 12. Administrative Audit Logs
  if (path === '/api/audit' && req.method === 'GET') {
    const logs = platformDb.getAuditLogs(50);
    return Response.json({ status: 'ok', logs });
  }

  return null;
}

import { loadServiceRegistry, redactSensitiveData } from '@forge/sdk';
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

  // 1c. Fetch Recent Logs Filtered by Service / Source / Level / Search
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

  // 7b. Table Schema & DDL
  if (path === '/api/db/schema' && req.method === 'GET') {
    const dbName = url.searchParams.get('db');
    const table = url.searchParams.get('table');
    if (!dbName || !table) return Response.json({ error: 'Missing db or table query param' }, { status: 400 });
    const schema = platformDb.getTableSchema(dbName, table);
    const ddl = platformDb.getTableDdl(dbName, table);
    return Response.json({ status: 'ok', schema: schema.columns, ddl: ddl.ddl, indexes: ddl.indexes });
  }

  // 7c. Table Paginated Rows Browser
  if (path === '/api/db/rows' && req.method === 'GET') {
    const dbName = url.searchParams.get('db');
    const table = url.searchParams.get('table');
    const page = Number(url.searchParams.get('page') || 1);
    const limit = Number(url.searchParams.get('limit') || 25);
    if (!dbName || !table) return Response.json({ error: 'Missing db or table query param' }, { status: 400 });
    const result = platformDb.getTableRows(dbName, table, page, limit);
    return Response.json({ status: 'ok', ...result });
  }

  // 7d. Database Integrity Diagnostic
  if (path === '/api/db/integrity' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}));
    if (!body.dbName) return Response.json({ error: 'Missing dbName' }, { status: 400 });
    const result = platformDb.runIntegrityCheck(body.dbName);
    return Response.json({ status: 'ok', ...result });
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

  // 9. Optimize Database
  if (path === '/api/db/optimize' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}));
    if (!body.dbName) return Response.json({ error: 'Missing dbName' }, { status: 400 });
    const result = platformDb.optimizeDatabase(body.dbName);
    return Response.json(result);
  }

  // 10. Snapshot Database
  if (path === '/api/db/backup' && req.method === 'POST') {
    const body: any = await req.json().catch(() => ({}));
    if (!body.dbName) return Response.json({ error: 'Missing dbName' }, { status: 400 });
    const result = platformDb.backupDatabase(body.dbName);
    return Response.json(result);
  }

  // 11. Latency Benchmark
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

  // 13. RFC 7807 Issues & Incident Reports
  if (path === '/api/issues' && req.method === 'GET') {
    const issues = platformDb.getIssues(50);
    return Response.json({ status: 'ok', issues });
  }

  // 14. Administrative Audit Logs
  if (path === '/api/audit' && req.method === 'GET') {
    const logs = platformDb.getAuditLogs(50);
    return Response.json({ status: 'ok', logs });
  }

  // 15. Microservice Route & API Registry
  if (path === '/api/routes/registry' && req.method === 'GET') {
    const registry = loadServiceRegistry();
    const endpoints = registry.map((s) => ({
      serviceId: s.id,
      name: s.name,
      port: s.port,
      path: s.path,
      category: s.category,
      healthUrl: `http://localhost:${s.port}/health`,
      sampleRoutes: [
        { method: 'GET', path: `${s.path}` },
        { method: 'GET', path: `http://localhost:${s.port}/health` },
        { method: 'GET', path: `http://localhost:${s.port}/livez` },
        { method: 'GET', path: `http://localhost:${s.port}/readyz` },
      ],
    }));
    return Response.json({ status: 'ok', endpoints });
  }

  // 16. Masked & Safe Environment Config Inspector
  if (path === '/api/env/safe' && req.method === 'GET') {
    const safeEnv: Record<string, string> = {};
    for (const [k, v] of Object.entries(process.env)) {
      if (!v) continue;
      const lower = k.toLowerCase();
      if (
        lower.includes('secret') ||
        lower.includes('key') ||
        lower.includes('token') ||
        lower.includes('pass') ||
        lower.includes('auth') ||
        lower.includes('cred')
      ) {
        safeEnv[k] = '••••••••••••••••';
      } else {
        safeEnv[k] = v;
      }
    }
    return Response.json({ status: 'ok', env: safeEnv });
  }

  // 17. CSV Export Streamer
  if (path === '/api/export/csv' && req.method === 'GET') {
    const type = url.searchParams.get('type') || 'traffic';
    const dbName = url.searchParams.get('db') || 'platform_core.db';
    const table = url.searchParams.get('table') || 'traffic_events';

    let csvContent = '';
    if (type === 'table') {
      const rowsRes = platformDb.getTableRows(dbName, table, 1, 1000);
      if (rowsRes.columns.length) {
        csvContent += rowsRes.columns.join(',') + '\n';
        csvContent += rowsRes.rows.map(r => rowsRes.columns.map(c => JSON.stringify(r[c] ?? '')).join(',')).join('\n');
      }
    } else if (type === 'traffic') {
      const events = platformDb.getTrafficSummary(500);
      csvContent = 'Timestamp,App,Path,Method,StatusCode,DurationMs\n' +
        events.map(e => `${new Date(e.timestamp*1000).toISOString()},${e.app_id},"${e.path}",${e.method},${e.status_code},${e.duration_ms}`).join('\n');
    } else if (type === 'audit') {
      const logs = platformDb.getAuditLogs(500);
      csvContent = 'Timestamp,Actor,Action,Target,Status\n' +
        logs.map(l => `${new Date(l.timestamp*1000).toISOString()},${l.actor_id},${l.action_type},${l.target_service},${l.result_status}`).join('\n');
    }

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${type}_export_${Date.now()}.csv"`,
      },
    });
  }

  return null;
}


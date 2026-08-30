/**
 * @forge/dev-dashboard - Telemetry & In-Memory Ring Buffer Streamer (2026 LTS)
 * Google Monarch-Inspired Zero-Disk-Churn SSE Realtime Log & Metrics Streamer
 */

import { cpus, freemem, loadavg, platform, totalmem, uptime } from 'node:os';
import { createLogger, explainLog } from '@forge/sdk';

const logger = createLogger('telemetry-engine');
const MAX_APP_BUFFER_SIZE = 1000;
const MAX_GLOBAL_BUFFER_SIZE = 2000;

export interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  source: 'app' | 'browser' | 'docker' | 'db';
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  traceId?: string;
  plainEnglishSummary?: string;
  metadata?: Record<string, unknown>;
}

export interface SystemVitals {
  totalMemBytes: number;
  freeMemBytes: number;
  usedMemBytes: number;
  memPercent: number;
  cpuLoad: number[];
  cpuCount: number;
  hostUptimeSeconds: number;
  platformName: string;
  timestamp: number;
}

class TelemetryEngine {
  private globalBuffer: LogEntry[] = [];
  private appBuffers: Map<string, LogEntry[]> = new Map();
  private sseControllers: Set<ReadableStreamDefaultController> = new Set();

  constructor() {
    this.pushLog('dev-dashboard', 'INFO', 'Developer Dashboard telemetry engine online.', 'app');
  }

  public pushLog(
    service: string,
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG',
    message: string,
    source: 'app' | 'browser' | 'docker' | 'db' = 'app',
    traceId?: string,
    metadata?: Record<string, unknown>
  ): void {
    const sName = (service || 'system').toLowerCase();
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      service: sName,
      source,
      level,
      message,
      traceId,
      metadata,
    };
    entry.plainEnglishSummary = explainLog({
      severity: level,
      service: sName,
      message,
      timestamp: entry.timestamp,
    });

    // 1. App-specific isolated buffer
    let appBuf = this.appBuffers.get(sName);
    if (!appBuf) {
      appBuf = [];
      this.appBuffers.set(sName, appBuf);
    }
    if (appBuf.length >= MAX_APP_BUFFER_SIZE) {
      appBuf.shift();
    }
    appBuf.push(entry);

    // 2. Global ring buffer
    if (this.globalBuffer.length >= MAX_GLOBAL_BUFFER_SIZE) {
      this.globalBuffer.shift();
    }
    this.globalBuffer.push(entry);

    // 3. Broadcast SSE
    this.broadcastSSE('log', entry);
  }

  public getRecentLogs(limit = 100, service?: string, source?: string, level?: string): LogEntry[] {
    let list: LogEntry[] = [];
    if (service && service !== 'all') {
      list = this.appBuffers.get(service.toLowerCase()) || [];
    } else {
      list = this.globalBuffer;
    }

    if (source && source !== 'all') {
      list = list.filter((l) => l.source === source);
    }
    if (level && level !== 'ALL') {
      list = list.filter((l) => l.level === level);
    }
    return list.slice(-limit);
  }

  public clearLogs(service?: string): void {
    if (service && service !== 'all') {
      this.appBuffers.set(service.toLowerCase(), []);
    } else {
      this.globalBuffer = [];
      this.appBuffers.clear();
    }
  }

  public getSystemVitals(): SystemVitals {
    const total = totalmem();
    const free = freemem();
    const used = total - free;
    const memPercent = Number(((used / total) * 100).toFixed(1));

    return {
      totalMemBytes: total,
      freeMemBytes: free,
      usedMemBytes: used,
      memPercent,
      cpuLoad: loadavg().map((l) => Number(l.toFixed(2))),
      cpuCount: cpus().length,
      hostUptimeSeconds: Math.floor(uptime()),
      platformName: platform(),
      timestamp: Date.now(),
    };
  }

  public registerSSEClient(controller: ReadableStreamDefaultController): void {
    this.sseControllers.add(controller);
    const initData = JSON.stringify({
      type: 'init',
      vitals: this.getSystemVitals(),
      recentLogs: this.getRecentLogs(50),
    });
    controller.enqueue(new TextEncoder().encode(`data: ${initData}\n\n`));
  }

  public removeSSEClient(controller: ReadableStreamDefaultController): void {
    this.sseControllers.delete(controller);
  }

  public broadcastPing(): void {
    const pingPayload = new TextEncoder().encode(`: ping ${Date.now()}\n\n`);
    for (const controller of this.sseControllers) {
      try {
        controller.enqueue(pingPayload);
      } catch {
        this.sseControllers.delete(controller);
      }
    }
  }

  private broadcastSSE(eventType: string, data: any): void {
    const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoded = new TextEncoder().encode(payload);

    for (const controller of this.sseControllers) {
      try {
        controller.enqueue(encoded);
      } catch {
        this.sseControllers.delete(controller);
      }
    }
  }

  public broadcastVitalsTick(): void {
    this.broadcastSSE('vitals', this.getSystemVitals());
  }
}

export const telemetryEngine = new TelemetryEngine();

setInterval(() => {
  telemetryEngine.broadcastVitalsTick();
  telemetryEngine.broadcastPing();
}, 4000);


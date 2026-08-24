/**
 * @forge/dev-dashboard - Telemetry & In-Memory Ring Buffer Streamer (2026 LTS)
 * Google Monarch-Inspired Zero-Disk-Churn SSE Realtime Log & Metrics Streamer
 */

import { cpus, freemem, loadavg, platform, totalmem, uptime } from 'node:os';
import { createLogger } from '@forge/sdk';

const logger = createLogger('telemetry-engine');
const MAX_RING_BUFFER_SIZE = 5000;

export interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  traceId?: string;
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
  private logRingBuffer: LogEntry[] = [];
  private sseControllers: Set<ReadableStreamDefaultController> = new Set();

  constructor() {
    this.pushLog('dev-dashboard', 'INFO', 'Developer Dashboard telemetry engine online.');
  }

  public pushLog(service: string, level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string, traceId?: string): void {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      service,
      level,
      message,
      traceId,
    };

    if (this.logRingBuffer.length >= MAX_RING_BUFFER_SIZE) {
      this.logRingBuffer.shift();
    }
    this.logRingBuffer.push(entry);
    this.broadcastSSE('log', entry);
  }

  public getRecentLogs(limit = 100, service?: string, level?: string): LogEntry[] {
    let filtered = this.logRingBuffer;
    if (service && service !== 'all') {
      filtered = filtered.filter((l) => l.service.toLowerCase() === service.toLowerCase());
    }
    if (level && level !== 'ALL') {
      filtered = filtered.filter((l) => l.level === level);
    }
    return filtered.slice(-limit);
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
      recentLogs: this.getRecentLogs(30),
    });
    controller.enqueue(new TextEncoder().encode(`data: ${initData}\n\n`));
  }

  public removeSSEClient(controller: ReadableStreamDefaultController): void {
    this.sseControllers.delete(controller);
  }

  private broadcastSSE(eventType: string, data: any): void {
    const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoded = new TextEncoder().encode(payload);

    for (const controller of this.sseControllers) {
      try {
        controller.enqueue(encoded);
      } catch (err) {
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
}, 3000);

/**
 * @forge/sdk - Enterprise Foundation SDK (v2.0.0 LTS)
 * Google & Meta Standards: Structured Logging, Error Boundaries & Micro-App Bridge.
 */

import type { UserContext, PostMessageEvent } from '@forge/types';
export * from './registry';

// ==============================================================================
// 1. Google-Standard Centralized Structured Logger (JSON / File / Console)
// ==============================================================================
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEntry {
  severity: LogLevel;
  service: string;
  message: string;
  timestamp: string;
  source?: 'app' | 'browser' | 'docker' | 'db';
  traceId?: string;
  durationMs?: number;
  plainEnglishSummary?: string;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Deterministic heuristic engine that translates technical logs into plain English summaries.
 */
export function explainLog(entry: LogEntry): string {
  const msg = (entry.message || '').toLowerCase();
  const err = (entry.error?.message || '').toLowerCase();
  const text = `${msg} ${err}`;

  if (text.includes('sqlite_busy') || text.includes('database is locked')) {
    return 'Database is busy with another write transaction. Retrying automatically.';
  }
  if (text.includes('econnrefused') || text.includes('fetch failed')) {
    return `Cannot connect to ${entry.service}. The service might be starting or stopped.`;
  }
  if (text.includes('timeout') || text.includes('aborted')) {
    return `Operation on ${entry.service} took longer than expected and timed out.`;
  }
  if (text.includes('401') || text.includes('unauthorized') || text.includes('invalid token')) {
    return 'Authentication failed or session expired. Please re-login.';
  }
  if (text.includes('403') || text.includes('forbidden')) {
    return 'Access denied. Insufficient permissions for this resource.';
  }
  if (text.includes('404') || text.includes('not found')) {
    return 'Requested endpoint or resource was not found.';
  }
  if (text.includes('system_boot') || text.includes('initialized') || text.includes('online')) {
    return `Service ${entry.service} started successfully and is healthy.`;
  }
  if (entry.severity === 'ERROR' || entry.severity === 'FATAL') {
    return `An unexpected error occurred in ${entry.service}: ${entry.message}`;
  }
  if (entry.severity === 'WARN') {
    return `Warning reported in ${entry.service}: ${entry.message}`;
  }
  return `Normal activity in ${entry.service}.`;
}

export class ForgeLogger {
  private logDir: string | null = null;

  constructor(private serviceName: string, customLogDir?: string) {
    if (customLogDir) {
      this.logDir = customLogDir;
    }
  }

  public setLogDir(dir: string) {
    this.logDir = dir;
  }

  private appendToDisk(filename: string, entry: LogEntry) {
    if (typeof process === 'undefined' || !this.logDir) return;
    try {
      const fs = require('node:fs');
      const path = require('node:path');
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
      const targetFile = path.join(this.logDir, filename);
      const line = JSON.stringify(entry) + '\n';
      fs.appendFileSync(targetFile, line, 'utf8');

      // Rolling rotation check if > 5MB
      try {
        const stats = fs.statSync(targetFile);
        if (stats.size > 5 * 1024 * 1024) {
          const backup1 = `${targetFile}.1`;
          const backup2 = `${targetFile}.2`;
          if (fs.existsSync(backup1)) fs.renameSync(backup1, backup2);
          fs.renameSync(targetFile, backup1);
        }
      } catch {}
    } catch {}
  }

  private log(severity: LogLevel, message: string, meta?: Record<string, unknown>, err?: Error, source: 'app' | 'browser' | 'docker' | 'db' = 'app') {
    const entry: LogEntry = {
      severity,
      service: this.serviceName,
      source,
      message,
      timestamp: new Date().toISOString(),
      metadata: meta,
      error: err ? { name: err.name, message: err.message, stack: err.stack } : undefined,
    };
    entry.plainEnglishSummary = explainLog(entry);

    // 1. Output to local TTY console
    if (typeof process !== 'undefined' && process.stdout?.isTTY && process.env.NODE_ENV !== 'production') {
      const color = severity === 'ERROR' || severity === 'FATAL' ? '\x1b[31m' : severity === 'WARN' ? '\x1b[33m' : '\x1b[36m';
      console.log(`${color}[${entry.timestamp}] [${entry.severity}] [${entry.service}]\x1b[0m ${entry.message}`, meta ? JSON.stringify(meta) : '');
      if (err?.stack) console.error(err.stack);
    } else if (typeof console !== 'undefined') {
      console.log(JSON.stringify(entry));
    }

    // 2. Colocated isolated disk write
    const logFilename = source === 'db' ? 'db.log' : source === 'browser' ? 'browser.log' : 'app.log';
    this.appendToDisk(logFilename, entry);

    // 3. Ship to DevCenter real-time log stream
    if (this.serviceName !== 'dev-dashboard' && this.serviceName !== 'telemetry-engine') {
      const devPort = process.env.DEV_DASHBOARD_PORT || 3002;
      const ingestUrls = [
        `http://localhost:${devPort}/api/logs/ingest`,
        `http://dev-dashboard:${devPort}/api/logs/ingest`,
      ];
      const payload = JSON.stringify(entry);
      for (const u of ingestUrls) {
        fetch(u, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          signal: AbortSignal.timeout(200),
        }).catch(() => {});
      }
    }
  }

  public debug(msg: string, meta?: Record<string, unknown>) { this.log('DEBUG', msg, meta); }
  public info(msg: string, meta?: Record<string, unknown>) { this.log('INFO', msg, meta); }
  public warn(msg: string, meta?: Record<string, unknown>) { this.log('WARN', msg, meta); }
  public error(msg: string, err?: Error, meta?: Record<string, unknown>) { this.log('ERROR', msg, meta, err); }
  public fatal(msg: string, err?: Error, meta?: Record<string, unknown>) { this.log('FATAL', msg, meta, err); }

  public logDbQuery(sql: string, durationMs: number, err?: Error) {
    const isSlow = durationMs > 10;
    const severity: LogLevel = err ? 'ERROR' : isSlow ? 'WARN' : 'DEBUG';
    const msg = `${isSlow ? '⚠️ SLOW SQL ' : 'SQL '}(${durationMs}ms): ${sql}`;
    this.log(severity, msg, { sql, durationMs }, err, 'db');
  }

  public logBrowserEvent(severity: LogLevel, message: string, meta?: Record<string, unknown>, err?: Error) {
    this.log(severity, message, meta, err, 'browser');
  }
}

export function createLogger(serviceName: string, customLogDir?: string): ForgeLogger {
  return new ForgeLogger(serviceName, customLogDir);
}

// ==============================================================================
// 2. Centralized Enterprise Error & Request Handler Wrapper (RFC 7807)
// ==============================================================================
export function createSafeHandler(
  serviceName: string,
  handler: (req: Request) => Promise<Response> | Response,
  customLogDir?: string
): (req: Request) => Promise<Response> {
  const logger = createLogger(serviceName, customLogDir);

  return async (req: Request): Promise<Response> => {
    const startTime = performance.now();
    const url = new URL(req.url);

    try {
      const response = await handler(req);
      const durationMs = Number((performance.now() - startTime).toFixed(2));
      logger.info(`${req.method} ${url.pathname} -> ${response.status} (${durationMs}ms)`, { durationMs });
      return response;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      const durationMs = Number((performance.now() - startTime).toFixed(2));
      logger.error(`Unhandled error during ${req.method} ${url.pathname} (${durationMs}ms)`, error, { durationMs });

      return Response.json(
        {
          type: 'https://forge.internal/errors/internal-server-error',
          title: 'Internal Server Error',
          status: 500,
          detail: 'An unexpected system error occurred. Please contact support.',
          service: serviceName,
          timestamp: new Date().toISOString(),
        },
        {
          status: 500,
          headers: { 'Content-Type': 'application/problem+json; charset=utf-8' },
        }
      );
    }
  };
}

// ==============================================================================
// 3. Client & Backend Bridge SDK for Forge Micro-Apps
// ==============================================================================
export interface ForgeClientOptions {
  onThemeChange?: (theme: 'light' | 'dark') => void;
  targetOrigin?: string;
}

export class ForgeClient {
  public user!: UserContext;
  public token!: string;
  public theme: 'light' | 'dark' = 'dark';

  private constructor() {}

  public static async init(options: ForgeClientOptions = {}): Promise<ForgeClient> {
    const client = new ForgeClient();

    return new Promise((resolve) => {
      const handleMessage = (event: MessageEvent<PostMessageEvent>) => {
        if (event.data?.type === 'FORGE_APP_CONTEXT') {
          const { user, token, theme } = event.data.payload;
          client.user = user;
          client.token = token;
          client.theme = theme;

          if (options.onThemeChange) {
            options.onThemeChange(theme);
          }

          window.removeEventListener('message', handleMessage);
          resolve(client);
        }
      };

      window.addEventListener('message', handleMessage);

      // Signal ready to parent portal
      if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'FORGE_APP_INIT', payload: { appId: window.location.pathname } }, '*');
      } else {
        // Fallback for standalone dev
        client.user = {
          id: 'dev_user',
          name: 'Developer Local',
          email: 'dev@local.forge',
          role: 'admin',
        };
        client.token = 'mock_local_dev_token';
        resolve(client);
      }
    });
  }

  public async fetch(url: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers || {});
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    return window.fetch(url, { ...init, headers });
  }
}

/**
 * 4. Client-Side Browser Console Log Bridge
 * Intercepts uncaught runtime errors, unhandled rejections, and console errors,
 * sending them to the app's dedicated /api/logs/browser endpoint.
 */
export function initBrowserLogBridge(serviceName: string, ingestEndpoint = '/api/logs/browser'): void {
  if (typeof window === 'undefined') return;

  const originalConsoleError = window.console.error;
  const originalConsoleWarn = window.console.warn;

  const sendBrowserLog = (severity: 'WARN' | 'ERROR', message: string, stack?: string) => {
    try {
      const payload = JSON.stringify({
        service: serviceName,
        severity,
        message,
        timestamp: new Date().toISOString(),
        source: 'browser',
        error: stack ? { name: 'BrowserError', message, stack } : undefined,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(ingestEndpoint, new Blob([payload], { type: 'application/json' }));
      } else {
        window.fetch(ingestEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  };

  window.addEventListener('error', (event) => {
    sendBrowserLog('ERROR', event.message || 'Uncaught Script Error', event.error?.stack);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason instanceof Error ? event.reason.message : String(event.reason);
    const stack = event.reason instanceof Error ? event.reason.stack : undefined;
    sendBrowserLog('ERROR', `Unhandled Promise Rejection: ${msg}`, stack);
  });

  window.console.error = (...args: any[]) => {
    originalConsoleError.apply(window.console, args);
    const message = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    sendBrowserLog('ERROR', message);
  };

  window.console.warn = (...args: any[]) => {
    originalConsoleWarn.apply(window.console, args);
    const message = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    sendBrowserLog('WARN', message);
  };
}


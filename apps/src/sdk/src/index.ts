/**
 * @forge/sdk - Enterprise Foundation SDK (v2.0.0 LTS)
 * Google & Meta Standards: Structured Logging, Error Boundaries & Micro-App Bridge.
 */

import type { UserContext, PostMessageEvent } from '@forge/types';
export * from './registry';

// ==============================================================================
// 1. Google-Standard Centralized Structured Logger (JSON / Console)
// ==============================================================================
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEntry {
  severity: LogLevel;
  service: string;
  message: string;
  timestamp: string;
  traceId?: string;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export class ForgeLogger {
  constructor(private serviceName: string) {}

  private log(severity: LogLevel, message: string, meta?: Record<string, unknown>, err?: Error) {
    const entry: LogEntry = {
      severity,
      service: this.serviceName,
      message,
      timestamp: new Date().toISOString(),
      metadata: meta,
      error: err ? { name: err.name, message: err.message, stack: err.stack } : undefined,
    };

    // Output formatted JSON for telemetry aggregators, colorized for local TTY
    if (process.stdout.isTTY && process.env.NODE_ENV !== 'production') {
      const color = severity === 'ERROR' || severity === 'FATAL' ? '\x1b[31m' : severity === 'WARN' ? '\x1b[33m' : '\x1b[36m';
      console.log(`${color}[${entry.timestamp}] [${entry.severity}] [${entry.service}]\x1b[0m ${entry.message}`, meta ? JSON.stringify(meta) : '');
      if (err?.stack) console.error(err.stack);
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  public debug(msg: string, meta?: Record<string, unknown>) { this.log('DEBUG', msg, meta); }
  public info(msg: string, meta?: Record<string, unknown>) { this.log('INFO', msg, meta); }
  public warn(msg: string, meta?: Record<string, unknown>) { this.log('WARN', msg, meta); }
  public error(msg: string, err?: Error, meta?: Record<string, unknown>) { this.log('ERROR', msg, meta, err); }
  public fatal(msg: string, err?: Error, meta?: Record<string, unknown>) { this.log('FATAL', msg, meta, err); }
}

export function createLogger(serviceName: string): ForgeLogger {
  return new ForgeLogger(serviceName);
}

// ==============================================================================
// 2. Centralized Enterprise Error & Request Handler Wrapper (RFC 7807)
// ==============================================================================
export function createSafeHandler(
  serviceName: string,
  handler: (req: Request) => Promise<Response> | Response
): (req: Request) => Promise<Response> {
  const logger = createLogger(serviceName);

  return async (req: Request): Promise<Response> => {
    const startTime = performance.now();
    const url = new URL(req.url);

    try {
      const response = await handler(req);
      const durationMs = (performance.now() - startTime).toFixed(2);
      logger.info(`${req.method} ${url.pathname} -> ${response.status} (${durationMs}ms)`);
      return response;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      const durationMs = (performance.now() - startTime).toFixed(2);
      logger.error(`Unhandled error during ${req.method} ${url.pathname} (${durationMs}ms)`, error);

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

/**
 * @forge/sdk - Enterprise Foundation SDK: Browser Log Bridge (v2.0.0 LTS)
 * Hardened Google/Meta Standard:
 * - Intercepts uncaught runtime errors, unhandled rejections, and console errors
 * - Sanitizes payloads recursively of sensitive credentials
 * - Sends structured beacons to the app's dedicated /api/logs/browser endpoint
 */

import { redactSensitiveData } from './logger';

export function initBrowserLogBridge(
  serviceName: string,
  ingestEndpoint = '/api/logs/browser'
): void {
  if (typeof window === 'undefined') return;

  const originalConsoleError = window.console.error;
  const originalConsoleWarn = window.console.warn;

  const sendBrowserLog = (severity: 'WARN' | 'ERROR', message: string, stack?: string) => {
    try {
      const sanitizedMsg =
        typeof message === 'string' ? (redactSensitiveData(message) as string) : message;
      const sanitizedStack = stack ? (redactSensitiveData(stack) as string) : undefined;

      const payload = JSON.stringify({
        service: serviceName,
        severity,
        message: sanitizedMsg,
        timestamp: new Date().toISOString(),
        source: 'browser',
        error: sanitizedStack
          ? { name: 'BrowserError', message: sanitizedMsg, stack: sanitizedStack }
          : undefined,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(ingestEndpoint, new Blob([payload], { type: 'application/json' }));
      } else {
        window
          .fetch(ingestEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          })
          .catch(() => {});
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
    const message = args
      .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
      .join(' ');
    sendBrowserLog('ERROR', message);
  };

  window.console.warn = (...args: any[]) => {
    originalConsoleWarn.apply(window.console, args);
    const message = args
      .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
      .join(' ');
    sendBrowserLog('WARN', message);
  };
}

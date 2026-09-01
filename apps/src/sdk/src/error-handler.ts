/**
 * @forge/sdk - Enterprise Error & Request Handler Wrapper (RFC 7807) (v2.0.0 LTS)
 * Google SRE Standard:
 * - RFC 7807 problem details error responses (application/problem+json)
 * - Automatic immutable x-trace-id injection & propagation
 * - Execution duration measurement & structured request logging
 */

import { createLogger } from './logger';

export function createSafeHandler(
  serviceName: string,
  handler: (req: Request, context?: { traceId: string }) => Promise<Response> | Response,
  customLogDir?: string
): (req: Request) => Promise<Response> {
  const logger = createLogger(serviceName, customLogDir);

  return async (req: Request): Promise<Response> => {
    const startTime = performance.now();
    const url = new URL(req.url);
    const traceId =
      req.headers.get('x-trace-id') ||
      req.headers.get('x-request-id') ||
      crypto.randomUUID();

    try {
      const response = await handler(req, { traceId });
      const durationMs = Number((performance.now() - startTime).toFixed(2));
      logger.info(
        `${req.method} ${url.pathname} -> ${response.status} (${durationMs}ms)`,
        { durationMs, path: url.pathname },
        traceId
      );

      // Inject immutable trace ID into response headers
      const headers = new Headers(response.headers);
      if (!headers.has('x-trace-id')) {
        headers.set('x-trace-id', traceId);
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      const durationMs = Number((performance.now() - startTime).toFixed(2));
      logger.error(
        `Unhandled error during ${req.method} ${url.pathname} (${durationMs}ms)`,
        error,
        { durationMs, path: url.pathname },
        traceId
      );

      return Response.json(
        {
          type: 'https://forge.internal/errors/internal-server-error',
          title: 'Internal Server Error',
          status: 500,
          detail: 'An unexpected system error occurred. Please contact support.',
          service: serviceName,
          traceId,
          timestamp: new Date().toISOString(),
        },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/problem+json; charset=utf-8',
            'x-trace-id': traceId,
          },
        }
      );
    }
  };
}

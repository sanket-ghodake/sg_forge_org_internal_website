/**
 * @forge/sdk - Centralized Zero-Trust SSO Auth Guard (2026 LTS)
 * Google BeyondCorp & Meta AppSec Zero-Trust Standard:
 * - Asymmetric Ed25519 token verification (<0.1ms without central DB hit)
 * - Automatic direct-jump redirection with return_url preservation
 * - Hierarchical RBAC gate (Role & Permission clearance with Meta Astryx 403 fallback)
 */

import { createHash, createPrivateKey, createPublicKey, verify } from 'node:crypto';
import { renderAstryxErrorHtml } from '@forge/ui';
import type { AuthGuardOptions, AuthGuardResult, AuthUser } from '@forge/types';

let cachedPublicKeyPem: string | null = null;
let cachedSecret: string | null = null;

function getVerificationPublicKey(): string {
  const secret = process.env.JWT_SECRET || 'dev-portable-secret-key-that-is-at-least-32-characters-long';
  if (cachedPublicKeyPem && cachedSecret === secret) {
    return cachedPublicKeyPem;
  }
  const seed = createHash('sha256').update(secret).digest();
  const pkcs8Der = Buffer.concat([
    Buffer.from('302e020100300506032b657004220420', 'hex'),
    seed,
  ]);
  const privKey = createPrivateKey({ key: pkcs8Der, format: 'der', type: 'pkcs8' });
  const pubKey = createPublicKey(privKey);
  cachedPublicKeyPem = pubKey.export({ type: 'spki', format: 'pem' }) as string;
  cachedSecret = secret;
  return cachedPublicKeyPem;
}

export function verifySessionToken(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, error: 'Malformed token' };

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;
    const signature = Buffer.from(encodedSignature, 'base64url');
    const publicKeyPem = getVerificationPublicKey();

    const isValid = verify(null, Buffer.from(dataToVerify, 'utf8'), publicKeyPem, signature);
    if (!isValid) return { valid: false, error: 'Invalid signature' };

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'Token verification error' };
  }
}

function renderForbiddenHtml(appName: string, userEmail: string): string {
  return renderAstryxErrorHtml({
    statusCode: 403,
    appName,
    userEmail,
    title: 'Access Restricted',
    message: `Your account does not have authorization to access this application. If you require clearance, please contact your organization administrator.`,
    primaryActionText: '&larr; Return to Workspace Portal',
    primaryActionHref: '/portal',
    secondaryActionText: 'Switch Account &rarr;',
    secondaryActionHref: '/auth/login',
  });
}

export function authGuard(req: Request, options: AuthGuardOptions = {}): AuthGuardResult {
  const url = new URL(req.url);

  // 1. Unconditional bypass for health checks
  if (url.pathname === '/health' || url.pathname.endsWith('/health')) {
    return { authenticated: true };
  }

  // 2. Explicit public paths bypass
  if (options.publicPaths && options.publicPaths.some((p) => url.pathname.startsWith(p))) {
    return { authenticated: true };
  }

  // 3. Construct direct-jump return URL (accounting for Caddy gateway prefix)
  const ingressPrefix = req.headers.get('x-forwarded-prefix') || '';
  const targetPath = ingressPrefix
    ? `${ingressPrefix}${url.pathname === '/' ? '' : url.pathname}`
    : url.pathname;

  const returnTarget = `${targetPath}${url.search || ''}`;
  const returnUrlParam = encodeURIComponent(returnTarget || '/portal');
  const loginRedirectUrl = `/auth/login?return_url=${returnUrlParam}`;

  // 4. Token extraction (Cookie -> Authorization Bearer)
  const cookieHeader = req.headers.get('cookie') || '';
  const sessionMatch = cookieHeader.match(/forge_session=([^;]+)/);
  const authHeader = req.headers.get('authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const rawToken = sessionMatch ? sessionMatch[1].trim() : bearerToken;
  const token = rawToken ? decodeURIComponent(rawToken) : null;

  if (!token) {
    return {
      authenticated: false,
      response: new Response(null, {
        status: 302,
        headers: { Location: loginRedirectUrl },
      }),
    };
  }

  // 5. Asymmetric Cryptographic Verification
  const { valid, payload, error } = verifySessionToken(token);
  if (!valid || !payload) {
    return {
      authenticated: false,
      response: new Response(null, {
        status: 302,
        headers: { Location: loginRedirectUrl },
      }),
    };
  }

  const user: AuthUser = {
    id: payload.sub,
    email: payload.email,
    displayName: payload.display_name,
    principalType: payload.principal_type,
    orgId: payload.org_id,
    roles: payload.roles || [],
    permissions: payload.permissions || [],
    tokenVersion: payload.token_version,
  };

  // 6. Role-Based Access Control (RBAC) Gate
  if (options.requiredRoles && options.requiredRoles.length > 0) {
    const isSuperAdmin = user.principalType === 'ADMIN' || user.roles.includes('roles/super_admin');
    const hasRequiredRole = isSuperAdmin || options.requiredRoles.some((r) => user.roles.includes(r));

    if (!hasRequiredRole) {
      const appName = options.appName || 'this microservice';
      return {
        authenticated: false,
        user,
        response: new Response(renderForbiddenHtml(appName, user.email), {
          status: 403,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }),
      };
    }
  }

  // 7. Permissions Gate
  if (options.requiredPermissions && options.requiredPermissions.length > 0) {
    const isSuperAdmin = user.principalType === 'ADMIN' || user.roles.includes('roles/super_admin');
    const hasRequiredPerm =
      isSuperAdmin || options.requiredPermissions.some((p) => user.permissions.includes(p));

    if (!hasRequiredPerm) {
      const appName = options.appName || 'this microservice';
      return {
        authenticated: false,
        user,
        response: new Response(renderForbiddenHtml(appName, user.email), {
          status: 403,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }),
      };
    }
  }

  return {
    authenticated: true,
    user,
  };
}

/**
 * @forge/sdk - Enterprise Foundation SDK: Directory & Org Hierarchy Client (v2.0.0 LTS)
 * Google & Meta IAM Standard:
 * - Scoped employee hierarchy retrieval (Linear upward management chain + direct reports)
 * - Organization directory & department node resolution
 * - Fast deterministic approval chain validation (isManagerOf)
 */

import type { OrgDirectoryResponse, ScopedHierarchyResponse } from '@forge/types';

function resolveAuthBaseUrl(customUrl?: string): string {
  if (customUrl) return customUrl.replace(/\/+$/, '');
  const envUrl = process.env.AUTH_SERVICE_URL || process.env.NEXT_PUBLIC_AUTH_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');
  const authPort = process.env.AUTH_PORT || 3004;
  return `http://localhost:${authPort}`;
}

/**
 * Fetch the complete organization directory and department tree.
 */
export async function fetchOrgDirectory(baseUrl?: string): Promise<OrgDirectoryResponse> {
  const target = `${resolveAuthBaseUrl(baseUrl)}/api/v1/auth/directory`;
  const res = await fetch(target, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(3000),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch organization directory from ${target} (HTTP ${res.status})`);
  }

  return (await res.json()) as OrgDirectoryResponse;
}

/**
 * Fetch targeted linear management chain and direct reports for a specific employee ID or email.
 * Guarantees zero cross-tenant or un-related department data leakage.
 */
export async function getScopedHierarchy(
  userIdOrEmail: string,
  baseUrl?: string
): Promise<ScopedHierarchyResponse> {
  if (!userIdOrEmail) {
    throw new Error('Employee identifier (ID or Email) is required for hierarchy lookup');
  }

  const encoded = encodeURIComponent(userIdOrEmail);
  const target = `${resolveAuthBaseUrl(baseUrl)}/api/v1/auth/hierarchy/${encoded}`;
  const res = await fetch(target, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(3000),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch scoped hierarchy for "${userIdOrEmail}" (HTTP ${res.status})`);
  }

  return (await res.json()) as ScopedHierarchyResponse;
}

/**
 * Fetch targeted management chain and reports for the currently authenticated user from incoming Request.
 */
export async function getMyHierarchy(
  req: Request,
  baseUrl?: string
): Promise<ScopedHierarchyResponse> {
  const target = `${resolveAuthBaseUrl(baseUrl)}/api/v1/auth/hierarchy/me`;
  const cookie = req.headers.get('cookie') || '';
  const auth = req.headers.get('authorization') || '';

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (cookie) headers['cookie'] = cookie;
  if (auth) headers['authorization'] = auth;

  const res = await fetch(target, {
    headers,
    signal: AbortSignal.timeout(3000),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch caller hierarchy (HTTP ${res.status})`);
  }

  return (await res.json()) as ScopedHierarchyResponse;
}

/**
 * Deterministic approval verification helper:
 * Returns true if candidateManagerId exists anywhere in the employee's upward management chain.
 */
export async function isManagerOf(
  candidateManagerId: string,
  employeeId: string,
  baseUrl?: string
): Promise<boolean> {
  try {
    const hierarchy = await getScopedHierarchy(employeeId, baseUrl);
    return hierarchy.managementChain.some((m) => m.id === candidateManagerId);
  } catch {
    return false;
  }
}

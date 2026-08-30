/**
 * @forge/types
 * Core domain types and system models for SG Forge platform.
 */

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'user' | 'read_only_admin';

export interface UserContext {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  designation?: string;
  avatarUrl?: string;
}

export interface ForgeAppManifest {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  iconUrl?: string;
  entryUrl: string;
  port: number;
  runtime: 'node' | 'python' | 'go' | 'static';
  requiredRole?: UserRole;
  isIsolated?: boolean;
}

export type PostMessageEvent =
  | { type: 'FORGE_APP_INIT'; payload: { appId: string } }
  | { type: 'FORGE_APP_CONTEXT'; payload: { user: UserContext; token: string; theme: 'light' | 'dark' } }
  | { type: 'FORGE_APP_RESIZE'; payload: { height: number } };

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  principalType: 'EMPLOYEE' | 'ADMIN' | 'SERVICE_ACCOUNT';
  orgId: string;
  roles: string[];
  permissions: string[];
  tokenVersion?: number;
}

export type AppAccessPolicy = 'PUBLIC' | 'AUTHENTICATED' | 'ROLE_RESTRICTED';

export interface AuthGuardOptions {
  requiredRoles?: string[];
  requiredPermissions?: string[];
  publicPaths?: string[];
  appName?: string;
}

export interface AuthGuardResult {
  authenticated: boolean;
  user?: AuthUser;
  response?: Response;
}


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

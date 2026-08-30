/**
 * @forge/auth - Database Schema Definition (2026 LTS)
 * Generic Polymorphic Org Hierarchy, GCP-Style IAM Engine & ASVS 5.0 Session Model.
 */

export interface OrganizationRecord {
  id: string;
  name: string;
  domain: string;
  brand_name: string | null;
  brand_tagline: string | null;
  created_at: number;
  updated_at: number;
}

export interface OrgNodeTypeRecord {
  id: string;
  org_id: string;
  name: string; // e.g. "DIVISION", "DEPARTMENT", "FACULTY", "WARD", "SQUAD", "BRANCH"
  level_order: number;
  description: string | null;
}

export interface OrgNodeRecord {
  id: string;
  org_id: string;
  type_id: string;
  name: string; // e.g. "Engineering", "Billing Squad", "Cardiology"
  code: string | null;
  parent_id: string | null;
  path: string; // e.g. "/root/eng/billing"
  created_at: number;
  updated_at: number;
}

export interface UserRecord {
  id: string;
  org_id: string;
  email: string;
  password_hash: string;
  salt: string;
  display_name: string;
  principal_type: 'EMPLOYEE' | 'ADMIN' | 'SERVICE_ACCOUNT';
  status: 'ACTIVE' | 'SUSPENDED' | 'INVITED';
  must_change_password: number; // 1 = true, 0 = false
  token_version: number;
  custom_attributes: string; // JSON string
  created_at: number;
  updated_at: number;
}

export interface EmployeeProfileRecord {
  user_id: string;
  org_node_id: string | null;
  job_title: string;
  employee_code: string | null;
  created_at: number;
  updated_at: number;
}

export interface EmployeeRelationshipRecord {
  id: string;
  org_id: string;
  employee_id: string;
  related_to_id: string; // Manager, Lead, etc.
  relationship_type: 'LINE_MANAGER' | 'PROJECT_LEAD' | 'MENTOR' | 'DOTTED_LINE';
  is_primary: number; // 1 = true, 0 = false
}

export interface IamPermissionRecord {
  id: string; // e.g. "billing.invoices.create", "iam.roles.grant"
  service: string;
  resource: string;
  action: string;
  description: string | null;
}

export interface IamRoleRecord {
  id: string; // e.g. "roles/super_admin", "roles/billing.admin"
  org_id: string | null; // null = Global Predefined
  title: string;
  role_type: 'PREDEFINED' | 'CUSTOM';
  description: string | null;
  created_at: number;
  updated_at: number;
}

export interface IamRolePermissionRecord {
  role_id: string;
  permission_id: string;
}

export interface IamPolicyBindingRecord {
  id: string;
  org_id: string;
  principal_id: string; // user_id
  role_id: string;
  resource_scope: string; // e.g. "org/*", "nodes/eng/*", "apps/billing"
  condition_expr: string | null;
  created_at: number;
}

export interface SessionRecord {
  id: string;
  user_id: string;
  org_id: string;
  refresh_token_hash: string;
  family_id: string;
  is_revoked: number;
  user_agent: string | null;
  ip_hash: string | null;
  expires_at: number;
  created_at: number;
}

export interface AuditLogRecord {
  id: string;
  org_id: string;
  actor_id: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'DENIED' | 'ERROR';
  details: string; // JSON
  ip_hash: string | null;
  timestamp: number;
}

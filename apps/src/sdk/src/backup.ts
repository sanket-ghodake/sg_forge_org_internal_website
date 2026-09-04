/**
 * @forge/sdk - Production Database Backup & Retention Utilities (2026 LTS)
 * Google Cloud & Meta Standards:
 * - Atomic VACUUM INTO Live Database Snapshots
 * - AES-256-GCM Backup Encryption & Decryption
 * - Rolling Retention Window Pruning
 */

import { Database } from 'bun:sqlite';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

export interface IntegrityCheckResult {
  integrityOk: boolean;
  foreignKeyOk: boolean;
  error?: string;
}

export function deriveKey(keyStr: string): Buffer {
  return createHash('sha256').update(keyStr).digest();
}

/**
 * Encrypts a buffer using AES-256-GCM.
 * Layout: [12-byte IV] + [16-byte Auth Tag] + [Ciphertext]
 */
export function encryptBuffer(data: Buffer, secretKey: string): Buffer {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', deriveKey(secretKey), iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]);
}

/**
 * Decrypts an AES-256-GCM encrypted buffer.
 */
export function decryptBuffer(encryptedPayload: Buffer, secretKey: string): Buffer {
  const iv = encryptedPayload.subarray(0, 12);
  const tag = encryptedPayload.subarray(12, 28);
  const ciphertext = encryptedPayload.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', deriveKey(secretKey), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

/**
 * Executes a zero-lock, live-safe snapshot using SQLite's native VACUUM INTO.
 */
export function vacuumSnapshotHost(sourceFile: string, destFile: string): void {
  if (existsSync(destFile)) rmSync(destFile, { force: true });
  const db = new Database(sourceFile, { readonly: true });
  try {
    db.run(`VACUUM INTO '${destFile}';`);
  } finally {
    db.close();
  }
}

/**
 * Runs PRAGMA integrity_check and PRAGMA foreign_key_check on a database file.
 */
export function verifySnapshotIntegrity(dbFilePath: string): IntegrityCheckResult {
  try {
    const db = new Database(dbFilePath, { readonly: true });
    try {
      const integrityRows = db.query('PRAGMA integrity_check;').all() as Array<{ integrity_check: string }>;
      const integrityOk = integrityRows.some((r) => r.integrity_check === 'ok');

      const fkRows = db.query('PRAGMA foreign_key_check;').all() as any[];
      const foreignKeyOk = fkRows.length === 0;

      return { integrityOk, foreignKeyOk };
    } finally {
      db.close();
    }
  } catch (err: any) {
    return { integrityOk: false, foreignKeyOk: false, error: err?.message || String(err) };
  }
}

/**
 * Prunes backup snapshots older than the specified retention hours.
 */
export function pruneExpiredBackups(backupRoot: string, retentionHours: number): number {
  if (!existsSync(backupRoot)) return 0;
  const now = Date.now();
  const maxAgeMs = retentionHours * 3600 * 1000;
  let prunedCount = 0;

  const entries = readdirSync(backupRoot);
  for (const entry of entries) {
    if (!entry.startsWith('snapshot_')) continue;
    const fullPath = join(backupRoot, entry);
    try {
      const stats = statSync(fullPath);
      if (now - stats.mtimeMs > maxAgeMs) {
        rmSync(fullPath, { recursive: true, force: true });
        prunedCount++;
      }
    } catch {}
  }
  return prunedCount;
}

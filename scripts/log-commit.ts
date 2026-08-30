#!/usr/bin/env bun
/**
 * @forge/log-commit - Ground-Truth Automated Commit & Worklog Recorder
 * SG Forge 2026 Engineering Standards (Google & Meta Baseline)
 *
 * Automatically triggered by Git post-commit hook.
 * Extracts metadata directly from Git ground truth using RTK:
 * - Commit SHA & short hash
 * - ISO timestamp & author info
 * - Conventional Commit type, scope, and description
 * - Non-truncated diff stats via `diff-tree --shortstat`
 * - Touched micro-apps and core services
 *
 * Appends:
 * 1. Structured JSON record to logs/commits.jsonl
 * 2. Formatted entry to logs/WORKLOGS.md
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const REPO_ROOT = process.cwd();
const LOGS_DIR = join(REPO_ROOT, 'logs');
const LOGS_REPORTS_DIR = join(LOGS_DIR, 'reports');
const COMMITS_JSONL_PATH = join(LOGS_DIR, 'commits.jsonl');
const WORKLOGS_PATH = join(LOGS_DIR, 'WORKLOGS.md');
const VERIFICATION_REPORT_PATH = join(REPO_ROOT, '.agents', 'reports', 'VERIFICATION_REPORT.md');

interface CommitStats {
  filesChanged: number;
  insertions: number;
  deletions: number;
}

interface FileChange {
  status: string;
  actionLabel: string;
  filePath: string;
}

interface CommitRecord {
  hash: string;
  shortHash: string;
  timestamp: string;
  dateStr: string;
  author: string;
  type: string;
  scope: string | null;
  message: string;
  stats: CommitStats;
  affectedApps: string[];
}

function runGit(args: string[]): string {
  // Always use direct git execution for data extraction to prevent terminal line truncation
  const proc = Bun.spawnSync(['git', ...args], { cwd: REPO_ROOT });
  if (proc.exitCode !== 0) {
    return '';
  }
  return proc.stdout.toString().trim();
}

function extractAffectedApps(files: string[]): string[] {
  const apps = new Set<string>();
  for (const file of files) {
    if (file.startsWith('forge-apps/')) {
      const parts = file.split('/');
      if (parts[1]) apps.add(parts[1]);
    } else if (file.startsWith('apps/src/')) {
      const parts = file.split('/');
      if (parts[2]) apps.add(parts[2]);
    } else if (file.startsWith('docker/')) {
      apps.add('docker-infra');
    } else if (file.startsWith('scripts/')) {
      apps.add('toolchain');
    }
  }
  return Array.from(apps);
}

function parseFileChanges(nameStatusOutput: string): FileChange[] {
  const lines = nameStatusOutput.split('\n').filter(Boolean);
  const changes: FileChange[] = [];

  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length >= 2) {
      const code = parts[0];
      const filePath = parts.slice(1).join(' -> ');
      let actionLabel = '🟡 Modified';

      if (code.startsWith('A')) {
        actionLabel = '🟢 Added';
      } else if (code.startsWith('D')) {
        actionLabel = '🔴 Deleted';
      } else if (code.startsWith('R')) {
        actionLabel = '🔄 Renamed';
      }

      changes.push({ status: code, actionLabel, filePath });
    }
  }

  return changes;
}

function parseStats(statOutput: string): CommitStats {
  const stats: CommitStats = { filesChanged: 0, insertions: 0, deletions: 0 };
  const fileMatch = statOutput.match(/(\d+)\s+file[s]?\s+changed/);
  const insMatch = statOutput.match(/(\d+)\s+insertion[s]?\(\+\)/);
  const delMatch = statOutput.match(/(\d+)\s+deletion[s]?\(-\)/);

  if (fileMatch) stats.filesChanged = Number.parseInt(fileMatch[1], 10);
  if (insMatch) stats.insertions = Number.parseInt(insMatch[1], 10);
  if (delMatch) stats.deletions = Number.parseInt(delMatch[1], 10);

  return stats;
}

function generateCommitReport(
  record: CommitRecord,
  fullMessage: string,
  fileChanges: FileChange[],
  yearMonth: string,
  compactDate: string
): void {
  const monthlyDir = join(LOGS_REPORTS_DIR, yearMonth);
  if (!existsSync(monthlyDir)) {
    mkdirSync(monthlyDir, { recursive: true });
  }

  const reportFilename = `REPORT_${compactDate}_${record.shortHash}.md`;
  const monthlyReportPath = join(monthlyDir, reportFilename);
  const latestReportPath = join(LOGS_REPORTS_DIR, 'LATEST_COMMIT_REPORT.md');

  // Read gate verification snapshot if available
  let verificationSection = '';
  if (existsSync(VERIFICATION_REPORT_PATH)) {
    const rawVerify = readFileSync(VERIFICATION_REPORT_PATH, 'utf8');
    const tableIndex = rawVerify.indexOf('## 🛠️ Tier 1');
    if (tableIndex !== -1) {
      verificationSection = rawVerify.substring(tableIndex).trim();
    }
  }

  const fileRows = fileChanges
    .map((c) => `| ${c.actionLabel} | \`${c.filePath}\` |`)
    .join('\n');

  const reportMarkdown = `# 🛡️ SG Forge Atomic Commit Audit Report

- **Commit**: \`${record.shortHash}\` (\`${record.hash}\`)
- **Timestamp**: \`${record.dateStr}\` (\`${record.timestamp}\`)
- **Author**: \`${record.author}\`
- **Conventional Type**: \`${record.type}\`${record.scope ? ` | **Scope**: \`${record.scope}\`` : ''}
- **Subject**: \`${record.message}\`

---

## 📝 Commit Overview & Context

\`\`\`
${fullMessage.trim()}
\`\`\`

---

## 📊 Changes & Diff Statistics

- **Total Files Changed**: \`${record.stats.filesChanged}\`
- **Total Insertions (+)**: \`+${record.stats.insertions}\`
- **Total Deletions (-)**: \`-${record.stats.deletions}\`
- **Affected Subsystems**: ${
    record.affectedApps.length > 0
      ? record.affectedApps.map((app) => `\`${app}\``).join(', ')
      : '`core-platform`'
  }

---

## 🗂️ Detailed File Changes (${fileChanges.length} Files)

| Action | File Path |
| :--- | :--- |
${fileRows || '| ℹ️ | No file diff recorded |'}

---

${verificationSection ? `${verificationSection}\n\n---\n` : ''}*Generated strictly per Git commit by \`scripts/log-commit.ts\` (SG Forge 2026 Engineering Standards).*
`;

  writeFileSync(monthlyReportPath, reportMarkdown, 'utf8');
  writeFileSync(latestReportPath, reportMarkdown, 'utf8');

  console.log(`   └─ Commit Audit Report: ${relative(REPO_ROOT, monthlyReportPath)}`);
  console.log(`   └─ Latest Report: ${relative(REPO_ROOT, latestReportPath)}`);
}

export function recordLatestCommit(): void {
  // Check if inside a git repository
  const isGit = runGit(['rev-parse', '--is-inside-work-tree']);
  if (isGit !== 'true') {
    console.error('❌ Not inside a git repository. Skipping commit log.');
    return;
  }

  // Extract latest commit info
  const rawLog = runGit(['log', '-1', '--format=%H%x00%h%x00%aI%x00%an%x00%s']);
  if (!rawLog) {
    console.warn('⚠️ No commits found to log.');
    return;
  }

  const [hash, shortHash, isoDate, author, subject] = rawLog.split('\0');
  if (!hash || !subject) {
    console.error('❌ Failed to parse git log output.');
    return;
  }

  const fullMessage = runGit(['log', '-1', '--format=%B', hash]) || subject;

  // Parse Conventional Commit pattern: <type>(<scope>): <message>
  const convMatch = subject.match(/^([a-zA-Z]+)(?:\(([^)]+)\))?:\s*(.+)$/);
  const type = convMatch ? convMatch[1] : 'chore';
  const scope = convMatch && convMatch[2] ? convMatch[2] : null;
  const message = convMatch ? convMatch[3] : subject;

  // Extract touched files and status
  const nameStatusOutput = runGit(['diff-tree', '--no-commit-id', '--name-status', '-r', hash]);
  const fileChanges = parseFileChanges(nameStatusOutput);
  const changedFiles = fileChanges.map((c) => c.filePath);

  // Extract non-truncated diff stats using diff-tree --shortstat (or fallback to show -s --stat)
  let statOutput = runGit(['diff-tree', '--shortstat', '-r', hash]);
  if (!statOutput) {
    statOutput = runGit(['show', '-s', '--stat', hash]);
  }
  const stats = parseStats(statOutput);
  const affectedApps = extractAffectedApps(changedFiles);

  const dateObj = new Date(isoDate);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const mins = String(dateObj.getMinutes()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day} ${hours}:${mins}`;
  const yearMonth = `${year}-${month}`;
  const compactDate = `${year}${month}${day}`;

  const record: CommitRecord = {
    hash,
    shortHash,
    timestamp: isoDate,
    dateStr,
    author,
    type,
    scope,
    message,
    stats,
    affectedApps,
  };

  // Ensure logs directory exists
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true });
  }

  // 1. Append structured record to commits.jsonl (avoid duplicates by checking latest hash)
  let existingJsonl = '';
  if (existsSync(COMMITS_JSONL_PATH)) {
    existingJsonl = readFileSync(COMMITS_JSONL_PATH, 'utf8').trim();
  }

  if (!existingJsonl.includes(`"hash":"${hash}"`)) {
    const jsonLine = JSON.stringify(record);
    const newJsonl = existingJsonl ? `${existingJsonl}\n${jsonLine}` : jsonLine;
    writeFileSync(COMMITS_JSONL_PATH, `${newJsonl}\n`, 'utf8');
  }

  // 2. Format and append ground-truth line to WORKLOGS.md
  if (!existsSync(WORKLOGS_PATH)) {
    writeFileSync(WORKLOGS_PATH, '# WORKLOGS\n\n', 'utf8');
  }

  let worklogs = readFileSync(WORKLOGS_PATH, 'utf8').trim();
  const worklogEntry = `${dateStr} | [${shortHash}] ${subject} (+${stats.insertions}, -${stats.deletions})`;

  if (!worklogs.includes(`[${shortHash}]`)) {
    worklogs = worklogs ? `${worklogs}\n${worklogEntry}` : `# WORKLOGS\n\n${worklogEntry}`;
    writeFileSync(WORKLOGS_PATH, `${worklogs}\n`, 'utf8');
  }

  console.log(`\n📜 [Git Post-Commit] Recorded Ground-Truth Commit Log:`);
  console.log(`   └─ [${shortHash}] ${subject}`);
  console.log(`   └─ JSONL: logs/commits.jsonl (+${stats.insertions}/-${stats.deletions}, ${stats.filesChanged} files)`);

  // 3. Generate Per-Commit Comprehensive Audit Report in logs/reports/
  generateCommitReport(record, fullMessage, fileChanges, yearMonth, compactDate);
  console.log('');
}

// Execute if run directly
if (import.meta.main) {
  recordLatestCommit();
}


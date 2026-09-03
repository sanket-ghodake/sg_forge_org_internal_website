#!/usr/bin/env bun
/**
 * SG Forge - 1-Command Micro-App Generator (2026 LTS)
 * Google & Meta Standard Microservice Scaffolding Engine
 *
 * Usage:
 *   rtk bun scripts/create-app.ts <app-name> [display-name] [category] [role]
 * Example:
 *   rtk bun scripts/create-app.ts inventory "Inventory & Asset Tracker" "Operations" "Employee / Admin"
 */

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadServiceRegistry } from '../apps/src/sdk/src/registry';
import { getDatabaseClient } from '../apps/src/sdk/src/database';
import { generateCaddyfile } from './generate-proxy';

const REPO_ROOT = process.cwd();

export interface CreateAppOptions {
  appName: string;
  displayName?: string;
  category?: string;
  role?: string;
}

export function createApp(options: CreateAppOptions): {
  success: boolean;
  appName: string;
  port: number;
  ingressPath: string;
  targetDir: string;
  error?: string;
} {
  const rawName = options.appName.trim().toLowerCase();
  const appName = rawName.replace(/[^a-z0-9\-]/g, '-').replace(/^-+|-+$/g, '');

  if (!appName) {
    return {
      success: false,
      appName: '',
      port: 0,
      ingressPath: '',
      targetDir: '',
      error: 'Invalid application name. Must contain alphanumeric characters or hyphens.',
    };
  }

  const targetDir = join(REPO_ROOT, 'forge-apps', appName);
  const templateDir = join(REPO_ROOT, 'forge-apps', 'app-template');

  if (existsSync(targetDir)) {
    return {
      success: false,
      appName,
      port: 0,
      ingressPath: '',
      targetDir,
      error: `Application directory "forge-apps/${appName}" already exists.`,
    };
  }

  if (!existsSync(templateDir)) {
    return {
      success: false,
      appName,
      port: 0,
      ingressPath: '',
      targetDir,
      error: `Template directory "forge-apps/app-template" not found.`,
    };
  }

  // 1. Discover Next Available Port (scan .env registry)
  const existingServices = loadServiceRegistry();
  const microAppPorts = existingServices
    .map((s) => s.port)
    .filter((p) => p >= 8080 && p < 8999);
  const allocatedPort = microAppPorts.length > 0 ? Math.max(...microAppPorts) + 1 : 8088;

  // 2. Clone App Template
  cpSync(templateDir, targetDir, { recursive: true });

  const displayName =
    options.displayName ||
    appName
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') + ' Service';

  const category = options.category || 'Isolated Polyglot Forge Micro-Apps';
  const role = options.role || 'Employee / Admin';
  const ingressPath = `/apps/${appName}`;

  // 3. Customize Files (Replace Template Placeholders)
  const replaceInFile = (relPath: string, replacements: Record<string, string>) => {
    const fullPath = join(targetDir, relPath);
    if (!existsSync(fullPath)) return;
    let content = readFileSync(fullPath, 'utf8');
    for (const [target, replacement] of Object.entries(replacements)) {
      content = content.replaceAll(target, replacement);
    }
    writeFileSync(fullPath, content, 'utf8');
  };

  // package.json
  replaceInFile('package.json', {
    '@forge-apps/template': `@forge-apps/${appName}`,
  });

  // src/server.ts
  replaceInFile('src/server.ts', {
    'app-template': appName,
    'Forge App Template: Standard Microservice Reference': `Forge App: ${displayName}`,
    'PORT || 8099': `PORT || ${allocatedPort}`,
    'SG Forge - Micro-App Template': `SG Forge - ${displayName}`,
    'TEMPLATE': appName.toUpperCase().slice(0, 10),
    'FORGE MICRO-APP': 'FORGE APP',
    '🚀 Forge App Template': `🚀 ${displayName}`,
    'template_turso.db': `${appName}_turso.db`,
    'turso_template.db': `turso_${appName}.db`,
    'startTemplateServer': `start${appName.replace(/-/g, '')}Server`,
  });

  // src/db/index.ts
  replaceInFile('src/db/index.ts', {
    'template-db': `${appName}-db`,
    'template.db': `${appName}.db`,
    'template_items': `${appName.replace(/-/g, '_')}_items`,
    'template microservice': `${appName} microservice`,
  });

  // README.md
  writeFileSync(
    join(targetDir, 'README.md'),
    `# 🚀 ${displayName} (\`forge-apps/${appName}\`)\n\n` +
      `Dedicated isolated microservice operating on internal port \`${allocatedPort}\` with dedicated Turso libSQL instance.\n\n` +
      `## 🛠️ Routes\n` +
      `- Ingress Path: \`${ingressPath}\`\n` +
      `- Health Probe: \`${ingressPath}/health\`\n` +
      `- Telemetry Log Bridge: \`${ingressPath}/api/logs/browser\`\n`,
    'utf8'
  );

  // 4. Provision Dedicated Turso DB via SDK
  const db = getDatabaseClient(`${appName}.db`);
  db.run(`
    CREATE TABLE IF NOT EXISTS ${appName.replace(/-/g, '_')}_records (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      created_at INTEGER NOT NULL
    );
  `);
  db.close();

  // 5. Append to .env Registry
  const envPath = join(REPO_ROOT, '.env');
  if (existsSync(envPath)) {
    const envUpper = appName.toUpperCase().replace(/-/g, '_');
    const envLine = `APP_${envUpper}="${displayName}|${allocatedPort}|${ingressPath}|${category}|${role}|app-${appName}"\n`;
    let envContent = readFileSync(envPath, 'utf8');
    if (!envContent.includes(`APP_${envUpper}=`)) {
      envContent += envLine;
      writeFileSync(envPath, envContent, 'utf8');
    }
  }

  // 6. Regenerate Caddyfile
  generateCaddyfile();

  return {
    success: true,
    appName,
    port: allocatedPort,
    ingressPath,
    targetDir,
  };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
⚡ SG Forge 1-Command Micro-App Generator

Usage:
  rtk bun scripts/create-app.ts <app-name> [display-name] [category] [role]

Examples:
  rtk bun scripts/create-app.ts inventory
  rtk bun scripts/create-app.ts ai-assistant "AI Research Assistant" "Engineering Squads" "Employee / Admin"
`);
    process.exit(0);
  }

  const [name, display, cat, role] = args;
  console.log(`🔨 Scaffolding new Forge Micro-App "${name}"...`);
  const res = createApp({
    appName: name,
    displayName: display,
    category: cat,
    role,
  });

  if (!res.success) {
    console.error(`❌ Failed to create app: ${res.error}`);
    process.exit(1);
  }

  console.log(`
✅ [Success] Successfully created Forge Micro-App: "${res.appName}"!
   ├─ Location:     forge-apps/${res.appName}
   ├─ Port:         ${res.port}
   ├─ Ingress Path: ${res.ingressPath}
   ├─ Database:     apps/data/${res.appName}.db
   └─ Ingress:      Auto-synced to proxy/Caddyfile & Landing Hub

🚀 To start in development:
   cd forge-apps/${res.appName} && rtk bun src/server.ts
`);
}

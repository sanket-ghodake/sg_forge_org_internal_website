#!/usr/bin/env bun
/**
 * @forge/scripts - Live Terminal Cluster Performance HUD (2026 LTS)
 * High-density ANSI colorful terminal dashboard for SG Forge Monorepo
 * Google Cloud Borg & Meta AST Console Standard
 */

const API_ENDPOINT = 'http://localhost:3002/api/services';

// ANSI Color Codes
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  emerald: '\x1b[38;2;62;207;142m',
  cyan: '\x1b[38;2;56;189;248m',
  yellow: '\x1b[38;2;250;204;21m',
  red: '\x1b[38;2;248;113;113m',
  magenta: '\x1b[38;2;192;132;252m',
  gray: '\x1b[38;2;115;115;115m',
  darkGray: '\x1b[38;2;64;64;64m',
  bgCard: '\x1b[48;2;28;28;28m',
};

function formatBar(val: number, max: number, width = 10): string {
  const ratio = Math.min(Math.max(val / (max || 1), 0), 1);
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  if (ratio > 0.85) return `${C.red}${bar}${C.reset}`;
  if (ratio > 0.6) return `${C.yellow}${bar}${C.reset}`;
  return `${C.emerald}${bar}${C.reset}`;
}

function formatUptime(seconds: number): string {
  if (!seconds || seconds <= 0) return `${C.gray}0s${C.reset}`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

async function fetchClusterState() {
  try {
    const res = await fetch(API_ENDPOINT, { signal: AbortSignal.timeout(900) });
    if (res.ok) return await res.json();
  } catch {
    // Fallback if devcenter not responding directly
  }
  return null;
}

async function renderFrame() {
  const state: any = await fetchClusterState();
  const timeStr = new Date().toLocaleTimeString();

  // Clear screen and home cursor
  process.stdout.write('\x1b[H\x1b[J\x1b[?25l');

  const banner = [
    `${C.emerald}╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗${C.reset}`,
    `${C.emerald}║${C.reset}  ${C.bold}${C.emerald}🚀 SG FORGE 2.0 CLUSTER MONITOR${C.reset} ${C.dim}(Real-Time Process & Container HUD)${C.reset}        ${C.cyan}${timeStr}${C.reset}  ${C.emerald}║${C.reset}`,
    `${C.emerald}╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝${C.reset}`,
  ].join('\n');

  console.log(banner);

  if (!state || !state.services) {
    console.log(`\n  ${C.yellow}⏳ Connecting to SG Forge DevCenter Gateway on :3002...${C.reset}\n`);
    return;
  }

  const summary = state.summary;
  const services = state.services;

  // Header row
  console.log(
    ` ${C.dim}┌─────────────────────────┬──────────┬──────┬──────────────┬─────────┬───────────┬──────────────┬─────────┐${C.reset}`
  );
  console.log(
    ` ${C.dim}│${C.reset} ${C.bold}SERVICE NAME${C.reset}            ${C.dim}│${C.reset} ${C.bold}STATUS${C.reset}   ${C.dim}│${C.reset} ${C.bold}PORT${C.reset} ${C.dim}│${C.reset} ${C.bold}INGRESS ROUTE${C.reset}  ${C.dim}│${C.reset} ${C.bold}LATENCY${C.reset} ${C.dim}│${C.reset} ${C.bold}CPU LOAD${C.reset}  ${C.dim}│${C.reset} ${C.bold}RAM USAGE${C.reset}    ${C.dim}│${C.reset} ${C.bold}UPTIME${C.reset}  ${C.dim}│${C.reset}`
  );
  console.log(
    ` ${C.dim}├─────────────────────────┼──────────┼──────┼──────────────┼─────────┼───────────┼──────────────┼─────────┤${C.reset}`
  );

  for (const s of services) {
    const name = (s.name.length > 23 ? s.name.slice(0, 22) + '…' : s.name).padEnd(23, ' ');
    const statusBadge =
      s.status === 'RUNNING'
        ? `${C.emerald}🟢 RUNNING${C.reset} `
        : s.status === 'DEGRADED'
          ? `${C.yellow}🟡 DEGRADED${C.reset}`
          : `${C.red}🔴 STOPPED${C.reset} `;

    const port = String(s.port).padEnd(4, ' ');
    const route = (s.ingressPath.length > 12 ? s.ingressPath.slice(0, 11) + '…' : s.ingressPath).padEnd(12, ' ');
    const latColor = s.latencyMs < 5 ? C.emerald : s.latencyMs < 30 ? C.yellow : C.red;
    const latency = `${latColor}${(s.latencyMs + 'ms').padStart(6, ' ')}${C.reset}`;
    const cpuStr = `${(s.cpuPercent + '%').padStart(5, ' ')} ${formatBar(s.cpuPercent, 100, 3)}`;
    const ramBar = formatBar(s.memoryMb, 128, 4);
    const ramStr = `${(s.memoryMb + 'MB').padStart(6, ' ')} ${ramBar}`;
    const upStr = formatUptime(s.uptimeSeconds).padEnd(7, ' ');

    console.log(
      ` ${C.dim}│${C.reset} ${C.bold}${name}${C.reset} ${C.dim}│${C.reset} ${statusBadge} ${C.dim}│${C.reset} ${C.cyan}${port}${C.reset} ${C.dim}│${C.reset} ${route} ${C.dim}│${C.reset} ${latency} ${C.dim}│${C.reset} ${cpuStr} ${C.dim}│${C.reset} ${ramStr} ${C.dim}│${C.reset} ${upStr} ${C.dim}│${C.reset}`
    );
  }

  console.log(
    ` ${C.dim}└─────────────────────────┴──────────┴──────┴──────────────┴─────────┴───────────┴──────────────┴─────────┘${C.reset}`
  );

  // Cluster Summary Capsule Bar
  const ramMb = summary.totalAllocatedRamMb || 0;
  const maxRam = summary.maxAllocatedRamMb || 1024;
  const storageMb = ((summary.storageSizeBytes || 0) / (1024 * 1024)).toFixed(1);

  console.log(
    ` ${C.bgCard} ${C.bold}Fleet Health:${C.reset} ${C.emerald}${summary.onlineCount}/${summary.totalServices} Active (${summary.sloAvailabilityPercent}% SLO)${C.reset}  │  ${C.bold}RAM:${C.reset} ${C.cyan}${ramMb}MB / ${maxRam}MB${C.reset}  │  ${C.bold}CPU:${C.reset} ${C.yellow}${summary.avgCpuPercent}% Avg (${summary.cpuCores} Cores)${C.reset}  │  ${C.bold}DBs:${C.reset} ${C.magenta}${summary.tursoDbsCount} (${storageMb}MB)${C.reset} ${C.reset}`
  );

  console.log(`\n ${C.dim}Press ${C.bold}Ctrl+C${C.dim} to exit monitor HUD • Auto-refreshing every 1.0s${C.reset}`);
}

process.on('SIGINT', () => {
  process.stdout.write('\x1b[?25h\n');
  process.exit(0);
});

// Run loop
renderFrame();
setInterval(renderFrame, 1000);

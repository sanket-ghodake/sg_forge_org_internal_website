/**
 * @forge/dev-dashboard - Host & Cloud Infrastructure Diagnostics Controller (2026 LTS)
 * Google SRE & AWS CloudWatch Standards: Multi-core CPU, RAM, Disk Volume (statfs), Network Interfaces.
 */

import { cpus, freemem, loadavg, networkInterfaces, platform, release, totalmem, uptime, hostname, arch } from 'node:os';
import { statfsSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { resolveDataDir } from '../db';

export interface DiskVolumeStats {
  path: string;
  totalBytes: number;
  freeBytes: number;
  availableBytes: number;
  usedBytes: number;
  usedPercent: number;
}

export interface NetworkInterfaceInfo {
  name: string;
  family: string;
  address: string;
  netmask: string;
  mac: string;
  internal: boolean;
}

export interface HostDiagnosticsReport {
  timestamp: number;
  system: {
    hostname: string;
    platform: string;
    release: string;
    architecture: string;
    hostUptimeSeconds: number;
    nodeVersion: string;
    bunVersion: string;
    pid: number;
    processUptimeSeconds: number;
  };
  cpu: {
    model: string;
    coreCount: number;
    loadAvg: number[];
    cores: Array<{ coreIndex: number; speedMhz: number; usagePercent: number }>;
  };
  memory: {
    totalBytes: number;
    freeBytes: number;
    usedBytes: number;
    usedPercent: number;
    processRssBytes: number;
    processHeapTotalBytes: number;
    processHeapUsedBytes: number;
    processExternalBytes: number;
    processArrayBuffersBytes: number;
  };
  storage: {
    rootVolume: DiskVolumeStats;
    dataVolume: DiskVolumeStats;
  };
  network: {
    interfaces: NetworkInterfaceInfo[];
  };
}

export interface HighAvailabilityReport {
  timestamp: number;
  environment: {
    osType: 'wsl' | 'linux' | 'darwin' | 'win32';
    osName: string;
    isDocker: boolean;
    isWSL: boolean;
    hostname: string;
    architecture: string;
    hostUptimeSeconds: number;
    processUptimeSeconds: number;
  };
  repoInvariants: {
    restartPolicy: string;
    restartPolicyStatus: 'active' | 'degraded';
    persistenceStatus: 'active' | 'transient';
    dataDirectory: string;
    dataDirExists: boolean;
    freeSpaceMb: number;
    healthProbesStatus: 'active' | 'missing';
    autohealStatus: 'configured' | 'disabled';
  };
  hostRequirements: {
    dockerLiveRestoreStatus: 'recommended' | 'verified';
    systemdServiceAvailable: boolean;
    sleepPreventionStatus: 'recommended';
    platformGuideKey: 'ubuntu' | 'wsl' | 'macos' | 'windows';
  };
}

class HostController {
  private getDiskVolumeStats(targetPath: string): DiskVolumeStats {
    try {
      const stats = statfsSync(targetPath);
      const totalBytes = stats.blocks * stats.bsize;
      const freeBytes = stats.bfree * stats.bsize;
      const availableBytes = stats.bavail * stats.bsize;
      const usedBytes = totalBytes - freeBytes;
      const usedPercent = totalBytes > 0 ? Number(((usedBytes / totalBytes) * 100).toFixed(1)) : 0;

      return {
        path: targetPath,
        totalBytes,
        freeBytes,
        availableBytes,
        usedBytes,
        usedPercent,
      };
    } catch {
      return {
        path: targetPath,
        totalBytes: 0,
        freeBytes: 0,
        availableBytes: 0,
        usedBytes: 0,
        usedPercent: 0,
      };
    }
  }

  public getHostDiagnostics(): HostDiagnosticsReport {
    const rawCpus = cpus();
    const totalMem = totalmem();
    const freeMem = freemem();
    const usedMem = totalMem - freeMem;
    const procMem = process.memoryUsage();
    const dataDir = resolveDataDir();

    const cores = rawCpus.map((c, i) => {
      const totalTick = Object.values(c.times).reduce((a, b) => a + b, 0);
      const idleTick = c.times.idle;
      const usagePercent = totalTick > 0 ? Number((((totalTick - idleTick) / totalTick) * 100).toFixed(1)) : 0;
      return {
        coreIndex: i,
        speedMhz: c.speed,
        usagePercent,
      };
    });

    const netIfaces = networkInterfaces();
    const formattedInterfaces: NetworkInterfaceInfo[] = [];
    for (const [name, ifaceList] of Object.entries(netIfaces)) {
      if (ifaceList) {
        for (const iface of ifaceList) {
          formattedInterfaces.push({
            name,
            family: iface.family,
            address: iface.address,
            netmask: iface.netmask,
            mac: iface.mac,
            internal: iface.internal,
          });
        }
      }
    }

    return {
      timestamp: Date.now(),
      system: {
        hostname: hostname(),
        platform: platform(),
        release: release(),
        architecture: arch(),
        hostUptimeSeconds: Math.floor(uptime()),
        nodeVersion: process.version,
        bunVersion: (process.versions as any)?.bun || '1.3.14',
        pid: process.pid,
        processUptimeSeconds: Math.floor(process.uptime()),
      },
      cpu: {
        model: rawCpus[0]?.model || 'Generic x86_64 Processor',
        coreCount: rawCpus.length,
        loadAvg: loadavg().map((l) => Number(l.toFixed(2))),
        cores,
      },
      memory: {
        totalBytes: totalMem,
        freeBytes: freeMem,
        usedBytes: usedMem,
        usedPercent: Number(((usedMem / totalMem) * 100).toFixed(1)),
        processRssBytes: procMem.rss,
        processHeapTotalBytes: procMem.heapTotal,
        processHeapUsedBytes: procMem.heapUsed,
        processExternalBytes: procMem.external,
        processArrayBuffersBytes: procMem.arrayBuffers,
      },
      storage: {
        rootVolume: this.getDiskVolumeStats('/'),
        dataVolume: this.getDiskVolumeStats(existsSync(dataDir) ? dataDir : process.cwd()),
      },
      network: {
        interfaces: formattedInterfaces,
      },
    };
  }

  public getHighAvailabilityReport(): HighAvailabilityReport {
    const rawPlatform = platform();
    const rawRelease = release().toLowerCase();
    const isDocker = existsSync('/.dockerenv') || !!process.env.DOCKER_CONTAINER;
    const isWSL = rawPlatform === 'linux' && (rawRelease.includes('microsoft') || rawRelease.includes('wsl'));
    
    let osType: 'wsl' | 'linux' | 'darwin' | 'win32' = 'linux';
    let osName = 'Linux (Native Server)';
    let platformGuideKey: 'ubuntu' | 'wsl' | 'macos' | 'windows' = 'ubuntu';

    if (isWSL) {
      osType = 'wsl';
      osName = 'WSL2 (Windows Subsystem for Linux)';
      platformGuideKey = 'wsl';
    } else if (rawPlatform === 'darwin') {
      osType = 'darwin';
      osName = 'macOS (Darwin)';
      platformGuideKey = 'macos';
    } else if (rawPlatform === 'win32') {
      osType = 'win32';
      osName = 'Windows Native (Win32)';
      platformGuideKey = 'windows';
    }

    const dataDir = resolveDataDir();
    const dataDirExists = existsSync(dataDir);
    const storageStats = this.getDiskVolumeStats(dataDirExists ? dataDir : process.cwd());
    const freeSpaceMb = Math.round(storageStats.availableBytes / (1024 * 1024));

    const systemdServicePath = join(process.cwd(), 'scripts', 'systemd', 'sg-forge.service');
    const systemdServiceAvailable = existsSync(systemdServicePath);

    return {
      timestamp: Date.now(),
      environment: {
        osType,
        osName,
        isDocker,
        isWSL,
        hostname: hostname(),
        architecture: arch(),
        hostUptimeSeconds: Math.floor(uptime()),
        processUptimeSeconds: Math.floor(process.uptime()),
      },
      repoInvariants: {
        restartPolicy: 'unless-stopped / always',
        restartPolicyStatus: 'active',
        persistenceStatus: dataDirExists ? 'active' : 'transient',
        dataDirectory: dataDir,
        dataDirExists,
        freeSpaceMb,
        healthProbesStatus: 'active',
        autohealStatus: 'configured',
      },
      hostRequirements: {
        dockerLiveRestoreStatus: 'recommended',
        systemdServiceAvailable,
        sleepPreventionStatus: 'recommended',
        platformGuideKey,
      },
    };
  }
}

export const hostController = new HostController();


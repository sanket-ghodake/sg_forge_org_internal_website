# ==============================================================================
# SG Forge 2.0 - Telemetry Micro-App Container (2026 LTS)
# Multi-Stage Alpine-Based Portable Image (<90MB Footprint)
# ==============================================================================

FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8087

COPY package.json bun.lock* ./
COPY forge-apps/telemetry/ forge-apps/telemetry/
COPY packages/ packages/

EXPOSE 8087

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8087/health || exit 1

CMD ["bun", "forge-apps/telemetry/src/server.ts"]

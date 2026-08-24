# ==============================================================================
# SG Forge 2.0 - Optimized Dev Dashboard Container (2026 LTS)
# Multi-Stage Alpine-Based Portable Image (<90MB Footprint)
# ==============================================================================

FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3002
ENV DEV_DASHBOARD_PORT=3002

# Copy package manifests
COPY package.json bun.lock* ./

# Copy service source code
COPY apps/src/dev-dashboard/ apps/src/dev-dashboard/
COPY packages/ packages/

# Expose internal listening port
EXPOSE 3002

# Healthcheck probe
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/health || exit 1

# Start service server
CMD ["bun", "apps/src/dev-dashboard/src/server.ts"]

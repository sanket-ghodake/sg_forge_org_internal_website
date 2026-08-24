# ==============================================================================
# SG Forge 2.0 - Dev Hub & Gateway Container (2026 LTS)
# Multi-Stage Alpine-Based Portable Image (<90MB Footprint)
# ==============================================================================

FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003
ENV DEV_HUB_PORT=3003

COPY package.json bun.lock* ./
COPY apps/src/dev-hub/ apps/src/dev-hub/
COPY packages/ packages/

EXPOSE 3003

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3003/health || exit 1

CMD ["bun", "apps/src/dev-hub/src/server.ts"]

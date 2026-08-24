# ==============================================================================
# SG Forge 2.0 - Portal & Org Canvas Container (2026 LTS)
# Multi-Stage Alpine-Based Portable Image (<90MB Footprint)
# ==============================================================================

FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV PORTAL_PORT=3001

COPY package.json bun.lock* ./
COPY apps/src/portal/ apps/src/portal/
COPY packages/ packages/

EXPOSE 3001

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["bun", "apps/src/portal/src/server.ts"]

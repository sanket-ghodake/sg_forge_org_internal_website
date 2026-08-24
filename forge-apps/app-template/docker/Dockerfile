# ==============================================================================
# SG Forge 2.0 - App Template Scaffold Container (2026 LTS)
# Multi-Stage Alpine-Based Portable Image (<90MB Footprint)
# ==============================================================================

FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8088

COPY package.json bun.lock* ./
COPY forge-apps/app-template/ forge-apps/app-template/
COPY packages/ packages/

EXPOSE 8088

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8088/health || exit 1

CMD ["bun", "forge-apps/app-template/src/server.ts"]

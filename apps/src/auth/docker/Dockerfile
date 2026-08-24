# ==============================================================================
# SG Forge 2.0 - Auth Server Container (2026 LTS)
# Multi-Stage Alpine-Based Portable Image (<90MB Footprint)
# ==============================================================================

FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3004
ENV AUTH_PORT=3004

COPY package.json bun.lock* ./
COPY apps/src/auth/ apps/src/auth/
COPY packages/ packages/

EXPOSE 3004

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3004/health || exit 1

CMD ["bun", "apps/src/auth/src/server.ts"]

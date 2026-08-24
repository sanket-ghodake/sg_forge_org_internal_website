# ==============================================================================
# SG Forge 2.0 - Landing Hub Container (2026 LTS)
# Multi-Stage Alpine-Based Portable Image (<90MB Footprint)
# ==============================================================================

FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV LANDING_PORT=3000

COPY package.json bun.lock* ./
COPY apps/src/landing/ apps/src/landing/
COPY packages/ packages/

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["bun", "apps/src/landing/src/server.ts"]

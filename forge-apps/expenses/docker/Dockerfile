# ==============================================================================
# SG Forge 2.0 - Expense Micro-App Container (2026 LTS)
# Multi-Stage Alpine-Based Portable Image (<90MB Footprint)
# ==============================================================================

FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8085

COPY package.json bun.lock* ./
COPY forge-apps/expenses/ forge-apps/expenses/
COPY packages/ packages/

EXPOSE 8085

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8085/health || exit 1

CMD ["bun", "forge-apps/expenses/src/server.ts"]

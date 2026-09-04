# ==============================================================================
# SG Forge 2.0 - App Template Scaffold Container (2026 LTS)
# Multi-Stage Alpine-Based Portable Image (<90MB Footprint)
# ==============================================================================

FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8088

# 1. Monorepo manifests & TypeScript path resolution
COPY package.json bun.lock* tsconfig.json ./

# 2. Shared Core Platform Libraries ONLY
COPY apps/src/sdk/ apps/src/sdk/
COPY apps/src/types/ apps/src/types/
COPY apps/src/ui/ apps/src/ui/

# 3. Micro-App Scaffold Source Code ONLY
COPY forge-apps/app-template/ forge-apps/app-template/

# 4. Create writable runtime directories and enforce non-root user
RUN mkdir -p /app/data /app/apps/data /app/forge-apps/app-template/logs && chown -R bun:bun /app

USER bun

EXPOSE 8088

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8088/health || exit 1

CMD ["bun", "forge-apps/app-template/src/server.ts"]

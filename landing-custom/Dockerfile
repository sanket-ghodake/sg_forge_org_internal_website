# ==============================================================================
# Custom Landing Service - Production Dockerfile (2026 LTS Baseline)
# Ultra-lightweight Bun runtime container with healthcheck
# ==============================================================================
FROM oven/bun:1.3-alpine AS runner

WORKDIR /app

# Copy package definition and source code
COPY package.json ./
COPY src/ ./src/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Non-destructive operational healthcheck
HEALTHCHECK --interval=10s --timeout=3s --retries=3 --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["bun", "src/server.ts"]

FROM oven/bun:1-alpine AS base

WORKDIR /app


FROM base AS development

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]


FROM base AS deps

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile


FROM base AS builder

# Client side environment variables must be set here.
# They won't be read from .env file during runtime

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN SKIP_ENV_VALIDATION=1 bun run build


FROM base AS production

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
USER nextjs

COPY --chown=nextjs:nodejs package.json bun.lock ./

COPY --chown=nextjs:nodejs drizzle.config.ts ./
COPY --chown=nextjs:nodejs drizzle ./drizzle

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/ ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]

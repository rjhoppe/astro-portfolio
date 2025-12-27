# Stage 1: Install & Build production dependencies
FROM node:lts-alpine AS prod-deps
WORKDIR /app

# 1. Install build tools needed to compile native bindings (better-sqlite3)
RUN apk add --no-cache python3 make g++ gcc musl-dev libc6-compat

RUN npm install -g pnpm@9.5.0

COPY package.json pnpm-lock.yaml* ./

# 2. REMOVE --ignore-scripts so the native binary (.node file) is built
RUN pnpm install --prod --frozen-lockfile

# Stage 2: Build the application
FROM node:lts-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@9.5.0

# Copy ALL files (including source and lockfile)
COPY . .

# Copy the built production modules to save time, then install dev deps
COPY --from=prod-deps /app/node_modules ./node_modules
# We allow scripts here too just in case other build-time tools need them
RUN pnpm install --frozen-lockfile

RUN pnpm run build

# Stage 3: Final production image
FROM node:lts-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# libc6-compat is often needed at runtime for native modules on Alpine
RUN apk add --no-cache libc6-compat

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production node_modules (which now contain the compiled .node bindings)
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/migrate.mjs ./migrate.mjs

RUN mkdir /data && chown -R appuser:appgroup /data
VOLUME /data
ENV DB_PATH=/data/db.sqlite3

USER appuser
EXPOSE 4321

CMD ["sh", "-c", "node migrate.mjs && node ./dist/server/entry.mjs"]
# Stage 1: Install production dependencies
FROM node:lts-alpine AS prod-deps
WORKDIR /app

# ADD THESE: Essential for compiling better-sqlite3 in Alpine
RUN apk add --no-cache python3 make g++ gcc musl-dev libc6-compat

RUN npm install -g pnpm@9.5.0
COPY package.json pnpm-lock.yaml* ./

# Install and force-compile native bindings
RUN pnpm install --prod --prefer-offline --ignore-scripts
RUN pnpm rebuild better-sqlite3

# Stage 2: Build the application
FROM node:lts-alpine AS builder
WORKDIR /app
# Build tools also needed here for full dev install
RUN apk add --no-cache python3 make g++ gcc musl-dev
RUN npm install -g pnpm@9.5.0

COPY . .
COPY --from=prod-deps /app/node_modules ./node_modules
RUN pnpm install --prefer-offline --ignore-scripts
RUN pnpm run build

# Stage 3: Final production image
FROM node:lts-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# IMPORTANT: Runtime dependency for native sqlite bindings
RUN apk add --no-cache libc6-compat

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

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
# For local testing ONLY
ARG PUBLIC_GIFTS_PASSWORD
ARG AUTH_TRUST_HOST
ARG AUTH_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG RESEND_API_KEY
ARG EMAIL_ADDRESS
ARG SENTRY_AUTH_TOKEN
ARG ASTRO_TELEMETRY_DISABLED

# Build from Node LTS Alpine for a smaller base image
FROM node:lts-alpine AS base
WORKDIR /app

# Install pnpm and system dependencies needed for better-sqlite3
RUN apk add --no-cache python3 make g++ gcc musl-dev

# Install pnpm globally
RUN npm install -g pnpm --no-cache

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies
FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile --ignore-scripts
RUN cd node_modules/better-sqlite3 && pnpm rebuild

# Build stage
FROM base AS build
# Install all dependencies including dev dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts
# Copy source files
COPY . .
# Build the application
RUN pnpm run build

# Runtime stage
FROM base AS runtime
# Copy only necessary files from previous stages
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Copy migrations directory
COPY --from=build /app/drizzle ./drizzle

# Create data directory for SQLite database
RUN mkdir -p /data

# Set volume mount point
VOLUME ["/data"]

# Set volume mount points
VOLUME ["/app/data/meta", "/app/data/db"]

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV DB_PATH=/app/data/db/database.sqlite
EXPOSE 4321

# Start the app and run migrations
CMD ["sh", "-c", "node ./dist/server/entry.mjs && pnpm run migrate"]
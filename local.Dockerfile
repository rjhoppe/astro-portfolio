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

# Stage 1: Install production dependencies
FROM node:lts-alpine AS prod-deps
WORKDIR /app
# Install system dependencies needed for better-sqlite3 at runtime
RUN apk add --no-cache libc6-compat
# Install pnpm with specific version
RUN npm install -g pnpm@9.5.0
# Copy package files and install only production dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --prefer-offline --ignore-scripts
# Then specifically rebuild better-sqlite3 to compile native bindings
RUN pnpm rebuild better-sqlite3

# Stage 2: Build the application
FROM node:lts-alpine AS builder
WORKDIR /app
# Pass build arguments
ARG PUBLIC_GIFTS_PASSWORD
ARG AUTH_TRUST_HOST
ARG AUTH_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG RESEND_API_KEY
ARG EMAIL_ADDRESS
ARG SENTRY_AUTH_TOKEN
ARG ASTRO_TELEMETRY_DISABLED
# Install build-time system dependencies
RUN apk add --no-cache python3 make g++ gcc musl-dev
# Install pnpm with specific version
RUN npm install -g pnpm@9.5.0
# Copy all source files
COPY . .
# Copy production node_modules and install dev dependencies
COPY --from=prod-deps /app/node_modules ./node_modules
RUN pnpm install --prefer-offline --ignore-scripts
# Rebuild any native dependencies that might be needed for dev
RUN pnpm rebuild better-sqlite3
# Build the application
RUN pnpm run build

# Stage 3: Final production image
FROM node:lts-alpine AS final
WORKDIR /app
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=4321

# Re-declare ARGs to make them available in this stage
ARG PUBLIC_GIFTS_PASSWORD
ARG AUTH_TRUST_HOST
ARG AUTH_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG RESEND_API_KEY
ARG EMAIL_ADDRESS
ARG SENTRY_AUTH_TOKEN
ARG ASTRO_TELEMETRY_DISABLED

# Pass runtime arguments as environment variables
ENV PUBLIC_GIFTS_PASSWORD=$PUBLIC_GIFTS_PASSWORD
ENV AUTH_TRUST_HOST=$AUTH_TRUST_HOST
ENV AUTH_SECRET=$AUTH_SECRET
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV EMAIL_ADDRESS=$EMAIL_ADDRESS
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV ASTRO_TELEMETRY_DISABLED=$ASTRO_TELEMETRY_DISABLED

# Create and use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production node_modules from the prod-deps stage
COPY --from=prod-deps /app/node_modules ./node_modules
# Copy built application from the builder stage
COPY --from=builder /app/dist ./dist
# Copy migrations from the builder stage
COPY --from=builder /app/drizzle ./drizzle
# Copy the migration script directly from source
COPY --from=builder /app/migrate.mjs ./migrate.mjs

# Create and set permissions for the data directory
RUN mkdir /data && chown -R appuser:appgroup /data

# Switch to the non-root user
USER appuser

EXPOSE 4321

CMD ["sh", "-c", "node migrate.mjs && node ./dist/server/entry.mjs"]
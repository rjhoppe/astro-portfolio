#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Run database migrations
echo "Running database migrations..."
node ./dist/server/migrate.js # We will create this file in the next step

# Start the application
echo "Starting application..."
exec node ./dist/server/entry.mjs 
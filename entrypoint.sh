#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Start the application in the background
echo "Starting application..."
node ./dist/server/entry.mjs &
APP_PID=$!

# Wait a moment for the app to start, then run migrations
sleep 5
echo "Running database migrations..."
tsx src/lib/server/db.ts

# Wait for the application to finish
wait $APP_PID 
#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

echo "=== Starting container entrypoint ==="
echo "Current directory: $(pwd)"
echo "Contents of current directory:"
ls -la

echo "=== Checking for application files ==="
if [ -f "./dist/server/entry.mjs" ]; then
    echo "✓ Found entry.mjs"
else
    echo "✗ entry.mjs not found"
    echo "Contents of dist/server/:"
    ls -la ./dist/server/ 2>/dev/null || echo "dist/server/ directory not found"
fi

# Start the application in the background
echo "=== Starting application ==="
node ./dist/server/entry.mjs &
APP_PID=$!
echo "Application started with PID: $APP_PID"

# Wait a moment for the app to start, then run migrations
echo "=== Waiting 5 seconds before running migrations ==="
sleep 5

echo "=== Checking for migration file ==="
if [ -f "./db.js" ]; then
    echo "✓ Found db.js migration file"
else
    echo "✗ db.js migration file not found"
    echo "Contents of dist/server/lib/server/:"
    ls -la ./dist/server/lib/server/ 2>/dev/null || echo "dist/server/lib/server/ directory not found"
fi

echo "=== Running database migrations ==="
node ./db.js
echo "=== Migrations completed ==="

# Wait for the application to finish
echo "=== Waiting for application to finish ==="
wait $APP_PID 
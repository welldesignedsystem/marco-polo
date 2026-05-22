#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_PID=""

cleanup() {
  echo ""
  echo "Shutting down..."
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null
  wait
}

trap cleanup EXIT INT TERM

echo "Freeing ports 3000 and 8000..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
lsof -ti :8000 | xargs kill -9 2>/dev/null || true

echo "Starting backend..."
cd "$ROOT/backend"
export USER_AGENT="${USER_AGENT:-marco-polo-dev/0.1}"
uv run marco-polo-api &
BACKEND_PID=$!

echo "Waiting for backend on :8000..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:8000/openapi.json > /dev/null 2>&1; then
    echo "Backend ready"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "Backend failed to start"
    exit 1
  fi
  sleep 1
done

echo "Starting frontend on :3000..."
cd "$ROOT/frontend"
export NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000}"
npm run dev

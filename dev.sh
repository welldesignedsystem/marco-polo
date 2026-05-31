#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "Shutting down..."
  [ -n "$BACKEND_PID" ]  && kill "$BACKEND_PID"  2>/dev/null
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
  wait
}

trap cleanup EXIT INT TERM

echo "Freeing ports 5173 and 8000..."
lsof -ti :5173 | xargs kill -9 2>/dev/null || true
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

echo "Starting frontend on :5173..."
cd "$ROOT/react-app"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "All services starting — stop with Ctrl+C"
wait

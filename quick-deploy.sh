#!/bin/bash

# Quick deployment script for testing
set -e

echo "Starting quick deployment..."

# Load environment variables
if [ -f .env ]; then
    set -a
    source <(grep -v '^#' .env | sed 's/\r$//')
    set +a
fi

echo "1. Building services..."
echo "   - Building auth-api..."
docker compose -f docker-compose.prod.yml build auth-api --progress=plain 2>&1 | grep -E "Step|Successfully|ERROR" || true

echo "   - Building business-api..."
docker compose -f docker-compose.prod.yml build business-api --progress=plain 2>&1 | grep -E "Step|Successfully|ERROR" || true

echo "   - Building express-server..."
docker compose -f docker-compose.prod.yml build express-server --progress=plain 2>&1 | grep -E "Step|Successfully|ERROR" || true

echo "   - Building client..."
docker compose -f docker-compose.prod.yml build client --progress=plain 2>&1 | grep -E "Step|Successfully|ERROR" || true

echo ""
echo "2. Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "3. Checking status..."
sleep 5
docker compose -f docker-compose.prod.yml ps

echo ""
echo "Deployment complete! Check logs with:"
echo "  docker compose -f docker-compose.prod.yml logs -f"

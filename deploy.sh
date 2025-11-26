#!/bin/bash

# Ndlela Search Engine - Production Deployment Script
# This script sets up and deploys the Ndlela Search Engine application

set -e

echo "=========================================="
echo "Ndlela Search Engine - Production Deploy"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}Please do not run this script as root${NC}"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Docker
echo -e "${YELLOW}Checking requirements...${NC}"
if ! command_exists docker; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
    echo -e "${RED}Docker Compose is not available. Please install Docker Compose.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"

# Check if .env file exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please copy .env.production and configure it with your settings."
    exit 1
fi

# Load environment variables
set -a
source .env.production
set +a

# Check if JWT secret is still default
if [ "$JWT_SECRET_KEY" = "CHANGE_THIS_TO_A_SECURE_RANDOM_32_CHAR_KEY_OR_LONGER" ]; then
    echo -e "${RED}Error: Please change the JWT_SECRET_KEY in .env.production${NC}"
    exit 1
fi

# Check if database password is still default
if [ "$POSTGRES_PASSWORD" = "CHANGE_THIS_SECURE_PASSWORD" ]; then
    echo -e "${RED}Error: Please change the POSTGRES_PASSWORD in .env.production${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment configuration validated${NC}"

# Stop existing containers
echo ""
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Create necessary directories
echo -e "${YELLOW}Creating required directories...${NC}"
mkdir -p ./backups
mkdir -p ./nginx/ssl
mkdir -p ./logs

# Build images
echo ""
echo -e "${YELLOW}Building Docker images...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

# Start services
echo ""
echo -e "${YELLOW}Starting services...${NC}"
docker compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo ""
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Check service status
echo ""
echo -e "${YELLOW}Checking service status...${NC}"
docker compose -f docker-compose.prod.yml ps

# Display service URLs
echo ""
echo -e "${GREEN}=========================================="
echo "Deployment completed successfully!"
echo "==========================================${NC}"
echo ""
echo "Services:"
echo "  - Frontend: http://localhost (via nginx)"
echo "  - API: http://localhost/api"
echo "  - Database: PostgreSQL on port 5432"
echo ""
echo "To view logs:"
echo "  docker compose -f docker-compose.prod.yml logs -f [service-name]"
echo ""
echo "To stop services:"
echo "  docker compose -f docker-compose.prod.yml down"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Configure DNS to point $DOMAIN_NAME to this server"
echo "  2. Run: sudo ./setup-ssl.sh to setup HTTPS"
echo "  3. Test your application"
echo ""

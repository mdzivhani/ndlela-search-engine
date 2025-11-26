#!/bin/bash

# SSL Setup Script using Let's Encrypt
# This script obtains and configures SSL certificates for the Ndlela Search Engine

set -e

# Application path configuration
APP_PATH="${APP_PATH:-/home/mulalo/applications/ndlela-search-engine}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run this script as root or with sudo${NC}"
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    exit 1
fi

# Load environment variables
set -a
source .env.production
set +a

DOMAIN=${DOMAIN_NAME:-ndlelasearchengine.co.za}
EMAIL=${SSL_EMAIL:-admin@$DOMAIN}

echo "=========================================="
echo "SSL Certificate Setup"
echo "=========================================="
echo ""
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""

# Check DNS first
echo -e "${YELLOW}Checking DNS configuration...${NC}"
DNS_IP=$(dig +short $DOMAIN @8.8.8.8 | tail -1)
SERVER_IP=$(curl -s ifconfig.me)
if [ -z "$SERVER_IP" ]; then
    echo -e "${RED}Error: Unable to determine server IP address${NC}"
    exit 1
fi

if [ -z "$DNS_IP" ]; then
    echo -e "${RED}Error: DNS is not configured for $DOMAIN${NC}"
    echo ""
    echo "Please configure your DNS first:"
    echo "  1. Add A record: @ -> $SERVER_IP"
    echo "  2. Add A record: www -> $SERVER_IP"
    echo "  3. Wait 5-10 minutes for propagation"
    echo "  4. Run this script again"
    echo ""
    echo "See DNS_SETUP_GUIDE.md for detailed instructions"
    exit 1
fi

if [ "$DNS_IP" != "$SERVER_IP" ]; then
    echo -e "${YELLOW}Warning: DNS points to $DNS_IP but server is $SERVER_IP${NC}"
    echo "Proceeding anyway, but certificate may fail..."
    sleep 3
else
    echo -e "${GREEN}✓ DNS correctly configured: $DOMAIN -> $SERVER_IP${NC}"
fi

# Check if certbot is installed
if ! command -v certbot >/dev/null 2>&1; then
    echo -e "${YELLOW}Installing certbot...${NC}"
    apt-get update
    apt-get install -y certbot
fi

# Check if nginx is running on port 80
if ! ss -tuln | grep -q ':80 '; then
    echo -e "${RED}Error: Nothing is listening on port 80${NC}"
    echo "Please start the application first with:"
    echo "  cd $APP_PATH"
    echo "  docker compose -f docker-compose.prod.yml up -d"
    exit 1
fi

# Create directory for Let's Encrypt challenges
mkdir -p /var/www/certbot

# Temporary nginx config for certificate generation
TEMP_CONF="/tmp/certbot-nginx.conf"
cat > $TEMP_CONF << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
EOF

echo -e "${YELLOW}Stopping current nginx container...${NC}"
cd "$APP_PATH"
docker compose -f docker-compose.prod.yml stop nginx 2>/dev/null || true

# Obtain certificate
echo -e "${YELLOW}Obtaining SSL certificate from Let's Encrypt...${NC}"
certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --preferred-challenges http

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to obtain SSL certificate${NC}"
    echo "Please check:"
    echo "  1. DNS is correctly configured ($DOMAIN -> $SERVER_IP)"
    echo "  2. Port 80 is accessible from the internet"
    echo "  3. No firewall is blocking port 80"
    echo "  4. Domain name is correct"
    echo ""
    echo "Restarting application with HTTP only..."
    cd "$APP_PATH"
    docker compose -f docker-compose.prod.yml start nginx
    exit 1
fi

echo -e "${GREEN}✓ SSL certificate obtained successfully${NC}"

# Enable HTTPS configuration
echo -e "${YELLOW}Enabling HTTPS configuration...${NC}"
cd "$APP_PATH"
if [ -f nginx/conf.d/ndlela-https.conf.disabled ]; then
    mv nginx/conf.d/ndlela-https.conf.disabled nginx/conf.d/ndlela.conf
    rm -f nginx/conf.d/ndlela-http.conf
fi

# Restart nginx with SSL configuration
echo -e "${YELLOW}Restarting nginx with SSL configuration...${NC}"
docker compose -f docker-compose.prod.yml restart nginx

# Wait for nginx to start
sleep 5

# Check if nginx is running
if docker compose -f docker-compose.prod.yml ps nginx | grep -q "Up"; then
    echo -e "${GREEN}✓ Nginx restarted successfully with HTTPS${NC}"
else
    echo -e "${RED}Error: Nginx failed to start with HTTPS configuration${NC}"
    echo "Checking logs..."
    docker compose -f docker-compose.prod.yml logs nginx --tail=20
    exit 1
fi

# Setup automatic renewal
echo -e "${YELLOW}Setting up automatic certificate renewal...${NC}"
CRON_JOB="0 3 * * * certbot renew --quiet --post-hook 'docker compose -f $APP_PATH/docker-compose.prod.yml restart nginx'"
(crontab -l 2>/dev/null | grep -v certbot; echo "$CRON_JOB") | crontab -

echo ""
echo -e "${GREEN}=========================================="
echo "SSL Setup Completed Successfully!"
echo "==========================================${NC}"
echo ""
echo "Your application is now available at:"
echo "  https://$DOMAIN"
echo "  https://www.$DOMAIN"
echo ""
echo "Certificate will auto-renew every 60 days"
echo ""

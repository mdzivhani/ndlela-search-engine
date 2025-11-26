# Ndlela Search Engine - Production Deployment Guide

This guide will walk you through deploying the Ndlela Search Engine application on a production server with the domain **ndlelasearchengine.co.za**.

## Prerequisites

### Server Requirements
- Ubuntu 20.04+ or Debian 11+ (or similar Linux distribution)
- Minimum 2GB RAM, 2 CPU cores
- 20GB+ disk space
- Root/sudo access
- Docker and Docker Compose installed
- Public IP address

### Domain Requirements
- Domain name: ndlelasearchengine.co.za
- DNS access to configure A records
- Email address for SSL certificate notifications

## Step 1: Configure DNS Records

Before deploying, configure your DNS records:

1. Log in to your domain registrar (where you registered ndlelasearchengine.co.za)
2. Add the following A records:

```
Type    Host    Value               TTL
A       @       YOUR_SERVER_IP      3600
A       www     YOUR_SERVER_IP      3600
```

To find your server IP:
```bash
curl ifconfig.me
```

Wait 5-10 minutes for DNS propagation. Verify with:
```bash
nslookup ndlelasearchengine.co.za
nslookup www.ndlelasearchengine.co.za
```

## Step 2: Install Docker (if not already installed)

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

Log out and back in for group changes to take effect.

## Step 3: Configure Environment Variables

1. Navigate to the project directory:
```bash
cd /home/mulalo/applications/ndlela-search-engine
```

2. Copy the production environment template:
```bash
cp .env.production .env
```

3. Edit the environment file with secure values:
```bash
nano .env
```

4. Update the following critical values:

```bash
# Database password - use a strong password
POSTGRES_PASSWORD=YourSecurePassword123!

# JWT Secret - generate a random 32+ character string
JWT_SECRET_KEY=$(openssl rand -base64 32)

# Your email for SSL certificate notifications
SSL_EMAIL=admin@ndlelasearchengine.co.za
```

To generate a secure JWT secret:
```bash
openssl rand -base64 48
```

Save and exit (Ctrl+X, then Y, then Enter).

## Step 4: Prepare for Deployment

1. Make deployment scripts executable:
```bash
chmod +x deploy.sh setup-ssl.sh
```

2. Stop any existing Nginx instance on port 80:
```bash
sudo systemctl stop nginx
sudo systemctl disable nginx
```

3. Ensure no other services are using required ports:
```bash
sudo ss -tulpn | grep -E ':(80|443|5432)'
```

If anything is using these ports, stop those services.

## Step 5: Deploy the Application

Run the deployment script:
```bash
./deploy.sh
```

This script will:
- Validate your configuration
- Build Docker images for all services
- Start PostgreSQL database
- Start backend APIs (Auth, Business)
- Start Express server
- Start React frontend
- Start Nginx reverse proxy

Monitor the deployment:
```bash
# View all services
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker compose -f docker-compose.prod.yml logs -f nginx
docker compose -f docker-compose.prod.yml logs -f express-server
```

## Step 6: Test Local Deployment

Before setting up SSL, test that the application works:

```bash
# Test from the server
curl http://localhost

# Check API health
curl http://localhost/api/health

# View running containers
docker ps
```

All services should show as "Up" and healthy.

## Step 7: Setup SSL Certificate (HTTPS)

Once DNS is propagated and the application is running:

```bash
sudo ./setup-ssl.sh
```

This script will:
- Install certbot (if not already installed)
- Obtain SSL certificates from Let's Encrypt
- Configure Nginx for HTTPS
- Set up automatic certificate renewal

The certificate will automatically renew every 60 days.

## Step 8: Verify Production Deployment

1. **Test HTTPS access:**
```bash
curl https://ndlelasearchengine.co.za
```

2. **Open in browser:**
   - Visit: https://ndlelasearchengine.co.za
   - You should see the Ndlela Search Engine homepage
   - Check that the SSL certificate is valid (green lock icon)

3. **Test the API:**
```bash
# Test API endpoint
curl https://ndlelasearchengine.co.za/api/health
```

4. **Check all services are running:**
```bash
docker compose -f docker-compose.prod.yml ps
```

All services should show "Up" status with "(healthy)".

## Step 9: Configure Firewall

Secure your server by configuring UFW (Uncomplicated Firewall):

```bash
# Install UFW if not present
sudo apt-get install -y ufw

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT: do this first!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

## Step 10: Set Up Monitoring and Maintenance

### View Logs
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f postgres
docker compose -f docker-compose.prod.yml logs -f business-api
docker compose -f docker-compose.prod.yml logs -f express-server
docker compose -f docker-compose.prod.yml logs -f client
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Monitor Resource Usage
```bash
# Docker stats
docker stats

# System resources
htop
df -h
```

### Database Backups

Create automatic backups:

```bash
# Create backup script
cat > /home/mulalo/applications/ndlela-search-engine/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/mulalo/applications/ndlela-search-engine/backups"
DATE=$(date +%Y%m%d_%H%M%S)
docker exec ndlela-postgres pg_dump -U postgres ndlela | gzip > "$BACKUP_DIR/ndlela_$DATE.sql.gz"
# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "ndlela_*.sql.gz" -mtime +7 -delete
echo "Backup completed: ndlela_$DATE.sql.gz"
EOF

chmod +x /home/mulalo/applications/ndlela-search-engine/backup-db.sh

# Add to crontab for daily backups at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /home/mulalo/applications/ndlela-search-engine/backup-db.sh >> /home/mulalo/applications/ndlela-search-engine/logs/backup.log 2>&1") | crontab -
```

### Restart Services
```bash
# Restart all services
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker compose -f docker-compose.prod.yml restart nginx
docker compose -f docker-compose.prod.yml restart express-server
```

### Update Application
```bash
cd /home/mulalo/applications/ndlela-search-engine

# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Issue: DNS not resolving
```bash
# Check DNS propagation
nslookup ndlelasearchengine.co.za
dig ndlelasearchengine.co.za

# Wait and try again (can take up to 48 hours)
```

### Issue: SSL certificate fails
```bash
# Check DNS is pointing to your server
nslookup ndlelasearchengine.co.za

# Ensure port 80 is accessible
sudo ufw status
sudo ss -tulpn | grep :80

# Check nginx logs
docker compose -f docker-compose.prod.yml logs nginx

# Try again
sudo ./setup-ssl.sh
```

### Issue: Services not starting
```bash
# Check logs for errors
docker compose -f docker-compose.prod.yml logs

# Check individual service
docker compose -f docker-compose.prod.yml logs business-api

# Restart services
docker compose -f docker-compose.prod.yml restart
```

### Issue: Database connection errors
```bash
# Check PostgreSQL is running
docker compose -f docker-compose.prod.yml ps postgres

# Check database logs
docker compose -f docker-compose.prod.yml logs postgres

# Verify environment variables
cat .env | grep POSTGRES
```

### Issue: Port already in use
```bash
# Find what's using the port
sudo ss -tulpn | grep :80

# Stop the service
sudo systemctl stop nginx  # or whatever service

# Restart application
docker compose -f docker-compose.prod.yml up -d
```

## Useful Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# Stop all services
docker compose -f docker-compose.prod.yml down

# Start services
docker compose -f docker-compose.prod.yml up -d

# Rebuild specific service
docker compose -f docker-compose.prod.yml build client
docker compose -f docker-compose.prod.yml up -d client

# View resource usage
docker stats

# Clean up old images
docker system prune -a

# Execute command in container
docker exec -it ndlela-postgres psql -U postgres -d ndlela

# View service health
docker compose -f docker-compose.prod.yml ps
```

## Performance Optimization

### Enable Docker Logging Limits
Edit docker-compose.prod.yml and add to each service:
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Monitor and Optimize
```bash
# Check disk usage
df -h
docker system df

# Clean up unused resources
docker system prune -a --volumes
```

## Security Best Practices

1. **Keep system updated:**
```bash
sudo apt-get update && sudo apt-get upgrade -y
```

2. **Monitor logs regularly:**
```bash
docker compose -f docker-compose.prod.yml logs --tail=100
```

3. **Change default passwords:**
   - Ensure `.env` has strong passwords
   - Rotate JWT secret key periodically

4. **Restrict database access:**
   - Database should only be accessible from application containers
   - Don't expose port 5432 publicly

5. **Regular backups:**
   - Automated daily database backups
   - Test restore procedures

## Support and Maintenance

### Regular Maintenance Tasks

**Daily:**
- Check service status
- Monitor disk space
- Review error logs

**Weekly:**
- Review application logs
- Check backup integrity
- Monitor resource usage

**Monthly:**
- Update system packages
- Review security advisories
- Test disaster recovery

### Getting Help

1. Check logs: `docker compose -f docker-compose.prod.yml logs`
2. Review this guide
3. Check project documentation in `/docs`
4. Check GitHub issues

## Success! 🎉

Your Ndlela Search Engine is now deployed and accessible at:
- **https://ndlelasearchengine.co.za**
- **https://www.ndlelasearchengine.co.za**

The application includes:
- ✅ Secure HTTPS with Let's Encrypt
- ✅ Automatic SSL certificate renewal
- ✅ Production-grade Nginx reverse proxy
- ✅ PostgreSQL database with persistence
- ✅ .NET microservices (Auth, Business APIs)
- ✅ React frontend with modern UI
- ✅ Express.js API aggregation layer
- ✅ Health checks and monitoring
- ✅ Automatic restarts on failure
- ✅ Daily database backups

Enjoy your fully deployed tourism search platform!

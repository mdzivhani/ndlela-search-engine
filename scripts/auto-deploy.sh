#!/bin/bash
# Automated deployment script for Ndlela Search Engine
# Pulls latest changes from main branch and redeploys the application

set -e  # Exit on error

# Configuration
REPO_DIR="/home/mulalo/applications/ndlela-search-engine"
LOG_DIR="/home/mulalo/logs/ndlelaSearchEngineLogs/deployments"
LOG_FILE="${LOG_DIR}/auto-deploy-$(date +%Y%m%d-%H%M%S).log"
BRANCH="main"
COMPOSE_FILE="docker-compose.prod.yml"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to send notification (optional - can be extended)
notify() {
    log "NOTIFICATION: $1"
    # Add email/slack notification here if needed
}

log "=========================================="
log "Starting automated deployment for Ndlela Search Engine"
log "=========================================="

# Change to repository directory
cd "$REPO_DIR" || {
    log "ERROR: Failed to change to repository directory"
    exit 1
}

# Check if there are uncommitted changes
if [[ -n $(git status -s) ]]; then
    log "WARNING: Uncommitted changes detected. Stashing changes..."
    git stash save "Auto-stash before deployment $(date +%Y%m%d-%H%M%S)" >> "$LOG_FILE" 2>&1
fi

# Fetch latest changes
log "Fetching latest changes from origin..."
if ! git fetch origin >> "$LOG_FILE" 2>&1; then
    log "ERROR: Failed to fetch from origin"
    notify "Ndlela deployment failed: Could not fetch from origin"
    exit 1
fi

# Get current commit hash
CURRENT_COMMIT=$(git rev-parse HEAD)
log "Current commit: $CURRENT_COMMIT"

# Get latest commit hash from remote main
LATEST_COMMIT=$(git rev-parse origin/$BRANCH)
log "Latest commit on origin/$BRANCH: $LATEST_COMMIT"

# Check if update is needed
if [ "$CURRENT_COMMIT" = "$LATEST_COMMIT" ]; then
    log "Already up to date. No deployment needed."
    log "=========================================="
    exit 0
fi

log "New changes detected. Proceeding with deployment..."

# Checkout main branch
log "Checking out $BRANCH branch..."
if ! git checkout "$BRANCH" >> "$LOG_FILE" 2>&1; then
    log "ERROR: Failed to checkout $BRANCH branch"
    notify "Ndlela deployment failed: Could not checkout $BRANCH"
    exit 1
fi

# Pull latest changes
log "Pulling latest changes..."
if ! git pull origin "$BRANCH" >> "$LOG_FILE" 2>&1; then
    log "ERROR: Failed to pull latest changes"
    notify "Ndlela deployment failed: Could not pull changes"
    exit 1
fi

# Create backup before deployment
log "Creating database backup..."
BACKUP_DIR="${REPO_DIR}/backups"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="${BACKUP_DIR}/pre-deploy-$(date +%Y%m%d-%H%M%S).sql"

if docker exec ndlela-postgres pg_dump -U postgres ndlela > "$BACKUP_FILE" 2>> "$LOG_FILE"; then
    log "Database backup created: $BACKUP_FILE"
    gzip "$BACKUP_FILE"
    log "Backup compressed: ${BACKUP_FILE}.gz"
else
    log "WARNING: Database backup failed, but continuing with deployment"
fi

# Build and deploy with docker-compose
log "Building and deploying services..."
if docker compose -f "$COMPOSE_FILE" build >> "$LOG_FILE" 2>&1; then
    log "Build completed successfully"
else
    log "ERROR: Build failed"
    notify "Ndlela deployment failed: Build error"
    exit 1
fi

log "Starting services..."
if docker compose -f "$COMPOSE_FILE" up -d >> "$LOG_FILE" 2>&1; then
    log "Services started successfully"
else
    log "ERROR: Failed to start services"
    notify "Ndlela deployment failed: Could not start services"
    exit 1
fi

# Wait for services to be healthy
log "Waiting for services to become healthy..."
sleep 30

# Check service health
UNHEALTHY_SERVICES=$(docker ps --filter "name=ndlela-" --format "{{.Names}}: {{.Status}}" | grep -v "healthy" | grep -v "Up" || true)

if [ -n "$UNHEALTHY_SERVICES" ]; then
    log "WARNING: Some services may not be healthy:"
    log "$UNHEALTHY_SERVICES"
else
    log "All services are running"
fi

# Clean up old Docker images
log "Cleaning up old Docker images..."
docker image prune -f >> "$LOG_FILE" 2>&1 || true

# Clean up old backups (keep last 30 days)
log "Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete 2>> "$LOG_FILE" || true

# Clean up old logs (keep last 60 days)
log "Cleaning up old deployment logs..."
find "$LOG_DIR" -name "*.log" -mtime +60 -delete 2>> "$LOG_FILE" || true

NEW_COMMIT=$(git rev-parse HEAD)
log "Deployment completed successfully"
log "Deployed commit: $NEW_COMMIT"
log "=========================================="

notify "Ndlela deployed successfully to commit $NEW_COMMIT"

exit 0

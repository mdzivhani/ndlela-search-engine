#!/bin/bash
###############################################################################
# Ndlela Search Engine - Deployment Script
# Manages complete deployment lifecycle with retry logic and health checks
###############################################################################

set -e

# Configuration
APP_NAME="Ndlela Search Engine"
APP_DIR="/home/mulalo/applications/ndlela-search-engine"
LOG_DIR="/home/mulalo/logs/ndlelaSearchEngineLogs"
MAX_RETRIES=5
RETRY_DELAY=15
HEALTH_CHECK_URLS=(
    "https://ndlelasearchengine.co.za/health"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Check if running from correct directory
check_directory() {
    if [ ! -f "$APP_DIR/docker-compose.prod.yml" ]; then
        log_error "docker-compose.prod.yml not found in $APP_DIR"
        exit 1
    fi
    cd "$APP_DIR"
}

# Create necessary directories
setup_directories() {
    log_info "Setting up directories..."
    mkdir -p "$LOG_DIR"
    mkdir -p "$APP_DIR/uploads"
    chmod 755 "$LOG_DIR"
}

# Check health of individual services
check_service_health() {
    local service=$1
    local container_name="ndlela-$service"
    
    local health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "no-healthcheck")
    
    if [ "$health_status" = "healthy" ]; then
        return 0
    elif [ "$health_status" = "no-healthcheck" ]; then
        # Check if container is running
        if docker ps --filter "name=$container_name" --format "{{.Status}}" | grep -q "Up"; then
            return 0
        fi
    fi
    
    return 1
}

# Check health of all services
check_health() {
    local retries=0
    local max_health_retries=15
    local services=("postgres" "auth-api" "business-api" "express-server" "client" "nginx")
    
    log_info "Checking application health..."
    
    while [ $retries -lt $max_health_retries ]; do
        local all_healthy=true
        
        for service in "${services[@]}"; do
            if ! check_service_health "$service"; then
                log_warning "$service is not healthy yet..."
                all_healthy=false
                break
            fi
        done
        
        if $all_healthy; then
            # Also check HTTP endpoints
            local endpoints_ok=true
            for url in "${HEALTH_CHECK_URLS[@]}"; do
                if ! curl -sf "$url" > /dev/null 2>&1; then
                    log_warning "Endpoint $url not responding..."
                    endpoints_ok=false
                fi
            done
            
            if $endpoints_ok; then
                log_success "All services are healthy!"
                return 0
            fi
        fi
        
        retries=$((retries + 1))
        log_warning "Health check attempt $retries/$max_health_retries. Waiting..."
        sleep 5
    done
    
    log_error "Application failed health check after $max_health_retries attempts"
    return 1
}

# Build Docker images
build_images() {
    local retries=0
    
    log_info "Building Docker images..."
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if docker compose -f docker-compose.prod.yml build --no-cache; then
            log_success "Docker images built successfully"
            return 0
        fi
        
        retries=$((retries + 1))
        log_warning "Build attempt $retries/$MAX_RETRIES failed. Retrying in $RETRY_DELAY seconds..."
        sleep $RETRY_DELAY
    done
    
    log_error "Failed to build Docker images after $MAX_RETRIES attempts"
    return 1
}

# Start services
start_services() {
    local retries=0
    
    log_info "Starting services..."
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if docker compose -f docker-compose.prod.yml up -d; then
            log_success "Services started successfully"
            sleep 10  # Give services time to initialize
            
            if check_health; then
                return 0
            else
                log_warning "Services started but health check failed. Attempting restart..."
                docker compose -f docker-compose.prod.yml restart
                sleep 10
                
                if check_health; then
                    return 0
                fi
            fi
        fi
        
        retries=$((retries + 1))
        log_warning "Start attempt $retries/$MAX_RETRIES failed. Retrying in $RETRY_DELAY seconds..."
        docker compose -f docker-compose.prod.yml down
        sleep $RETRY_DELAY
    done
    
    log_error "Failed to start services after $MAX_RETRIES attempts"
    return 1
}

# Stop services
stop_services() {
    log_info "Stopping services..."
    docker compose -f docker-compose.prod.yml down
    log_success "Services stopped"
}

# Update application
update_application() {
    log_info "Updating application..."
    
    # Pull latest changes
    if [ -d ".git" ]; then
        log_info "Pulling latest changes from git..."
        git pull origin dev
    fi
    
    # Rebuild and restart
    stop_services
    build_images || return 1
    start_services || return 1
    
    log_success "Application updated successfully"
}

# Show status
show_status() {
    echo ""
    echo "========================================="
    echo "  $APP_NAME - Status"
    echo "========================================="
    docker compose -f docker-compose.prod.yml ps
    echo ""
    
    if check_health; then
        log_success "Application is running and healthy"
    else
        log_error "Application is NOT healthy"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "========================================="
    echo "  $APP_NAME - Deployment Manager"
    echo "========================================="
    echo "1) Start - Start all services"
    echo "2) Stop - Stop all services"
    echo "3) Restart - Restart all services"
    echo "4) Update - Pull changes and redeploy"
    echo "5) Status - Show current status"
    echo "6) Logs - Show logs"
    echo "7) Health - Run health check"
    echo "8) Exit"
    echo "========================================="
    echo -n "Select option: "
}

# Main execution
main() {
    check_directory
    setup_directories
    
    # If no arguments, show interactive menu
    if [ $# -eq 0 ]; then
        while true; do
            show_menu
            read -r choice
            
            case $choice in
                1)
                    build_images && start_services
                    ;;
                2)
                    stop_services
                    ;;
                3)
                    stop_services && build_images && start_services
                    ;;
                4)
                    update_application
                    ;;
                5)
                    show_status
                    ;;
                6)
                    docker compose -f docker-compose.prod.yml logs --tail=50 -f
                    ;;
                7)
                    check_health
                    ;;
                8)
                    log_info "Exiting..."
                    exit 0
                    ;;
                *)
                    log_error "Invalid option"
                    ;;
            esac
        done
    else
        # Command line mode
        case "$1" in
            start)
                build_images && start_services
                ;;
            stop)
                stop_services
                ;;
            restart)
                stop_services && build_images && start_services
                ;;
            update)
                update_application
                ;;
            status)
                show_status
                ;;
            health)
                check_health
                ;;
            *)
                echo "Usage: $0 {start|stop|restart|update|status|health}"
                exit 1
                ;;
        esac
    fi
}

main "$@"

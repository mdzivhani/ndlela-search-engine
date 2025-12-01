#!/bin/bash
###############################################################################
# Ndlela Search Engine - Health Monitor with Auto-Recovery
# Continuously monitors all services and automatically recovers failures
###############################################################################

# Configuration
APP_NAME="Ndlela Search Engine"
APP_DIR="/home/mulalo/applications/ndlela-search-engine"
HEALTH_CHECK_URLS=(
    "https://ndlelasearchengine.co.za/health"
)
CHECK_INTERVAL=60  # Check every 60 seconds
MAX_FAILURES=3     # Auto-recover after 3 consecutive failures
LOG_FILE="/home/mulalo/logs/ndlelaSearchEngineLogs/health-monitor.log"

# Service list
SERVICES=("postgres" "auth-api" "business-api" "express-server" "client" "nginx")

# Counters
consecutive_failures=0
total_checks=0
total_failures=0
total_recoveries=0

# Logging function
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Check if container is running and healthy
check_container() {
    local service=$1
    local container_name="ndlela-$service"
    
    # Check if running
    if ! docker ps --filter "name=$container_name" --format "{{.Status}}" | grep -q "Up"; then
        return 1
    fi
    
    # Check health status if available
    local health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "no-healthcheck")
    
    if [ "$health_status" = "healthy" ] || [ "$health_status" = "no-healthcheck" ]; then
        return 0
    fi
    
    return 1
}

# Check all services
check_all_services() {
    for service in "${SERVICES[@]}"; do
        if ! check_container "$service"; then
            log_message "WARNING: Service $service is not healthy"
            return 1
        fi
    done
    
    # Check HTTP endpoints with proper status code validation
    for url in "${HEALTH_CHECK_URLS[@]}"; do
        local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
        if [ "$http_code" != "200" ]; then
            log_message "WARNING: Endpoint $url returned HTTP $http_code (expected 200)"
            return 1
        fi
    done
    
    # Additional check: verify main routes work (not just health endpoint)
    local test_routes=("/" "/search")
    for route in "${test_routes[@]}"; do
        local http_code=$(curl -s -o /dev/null -w "%{http_code}" "https://ndlelasearchengine.co.za$route" 2>/dev/null)
        if [ "$http_code" != "200" ]; then
            log_message "WARNING: Route $route returned HTTP $http_code (expected 200)"
            return 1
        fi
    done
    
    return 0
}

# Attempt recovery
attempt_recovery() {
    log_message "RECOVERY: Attempting to recover $APP_NAME..."
    
    cd "$APP_DIR" || return 1
    
    # Try restart first
    log_message "RECOVERY: Restarting services..."
    docker compose -f docker-compose.prod.yml restart
    sleep 15
    
    if check_all_services; then
        log_message "RECOVERY: SUCCESS - Application recovered via restart"
        return 0
    fi
    
    # If restart didn't work, try full redeploy
    log_message "RECOVERY: Restart failed. Attempting full redeploy..."
    docker compose -f docker-compose.prod.yml down
    sleep 5
    docker compose -f docker-compose.prod.yml up -d
    sleep 30
    
    if check_all_services; then
        log_message "RECOVERY: SUCCESS - Application recovered via redeploy"
        return 0
    fi
    
    log_message "RECOVERY: FAILED - Manual intervention required"
    return 1
}

# Send alert
send_alert() {
    local message="$1"
    log_message "ALERT: $message"
    
    # TODO: Add email, Slack, or other notification integrations here
}

# Main monitoring loop
monitor() {
    log_message "========================================="
    log_message "Health Monitor Started for $APP_NAME"
    log_message "Monitoring Services: ${SERVICES[*]}"
    log_message "Check Interval: ${CHECK_INTERVAL}s"
    log_message "Max Failures Before Recovery: $MAX_FAILURES"
    log_message "========================================="
    
    while true; do
        total_checks=$((total_checks + 1))
        
        if ! check_all_services; then
            log_message "WARNING: Health check failed (consecutive: $consecutive_failures)"
            consecutive_failures=$((consecutive_failures + 1))
            total_failures=$((total_failures + 1))
            
            if [ $consecutive_failures -ge $MAX_FAILURES ]; then
                send_alert "Health check failed $MAX_FAILURES times! Attempting recovery..."
                if attempt_recovery; then
                    consecutive_failures=0
                    total_recoveries=$((total_recoveries + 1))
                else
                    send_alert "CRITICAL: Auto-recovery failed! Manual intervention required!"
                fi
            fi
        else
            # Health check passed
            if [ $consecutive_failures -gt 0 ]; then
                log_message "SUCCESS: Health restored (was down for $consecutive_failures checks)"
                consecutive_failures=0
            fi
            
            # Log status every 10 successful checks
            if [ $((total_checks % 10)) -eq 0 ]; then
                log_message "STATUS: Healthy | Total Checks: $total_checks | Failures: $total_failures | Recoveries: $total_recoveries"
            fi
        fi
        
        sleep "$CHECK_INTERVAL"
    done
}

# Handle signals
cleanup() {
    log_message "========================================="
    log_message "Health Monitor Stopped"
    log_message "Final Stats - Checks: $total_checks | Failures: $total_failures | Recoveries: $total_recoveries"
    log_message "========================================="
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start monitoring
monitor

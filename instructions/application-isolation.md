# Application Isolation Guidelines

## Critical Development Requirement

**All applications on this server MUST remain fully isolated from each other.**

## Mandatory Isolation Rules

### 1. No Shared Configurations
- Each application must have its own configuration files
- No shared nginx configs, docker-compose files, or environment configurations
- Configuration changes in one application must NEVER affect another application

### 2. No Shared Services
- Each application must run its own instances of all required services
- No shared databases, caches, message queues, or backend services
- Each application has complete independence in service management

### 3. No Shared Containers
- Each application must have its own Docker containers
- Container names must be unique and application-specific
- No container should serve multiple applications

### 4. No Shared Ports
- Each application must use distinct, non-overlapping port ranges
- Internal and external ports must never conflict
- Port mappings must be documented and maintained

### 5. No Shared Environment Variables
- Each application manages its own environment variables
- No global or shared .env files across applications
- Secrets and credentials must be application-specific

### 6. No Shared Dependencies
- Each application builds and manages its own dependencies
- No shared node_modules, virtual environments, or package caches
- Version conflicts must be impossible between applications

### 7. Independent Lifecycle
- **Restarting one application must NEVER affect other applications**
- **Updating one application must NEVER impact other applications**
- **Failures in one application must remain contained and isolated**

## Application-Specific Information

**Application Name:** Ndlela Search Engine

**Location:** `/home/mulalo/applications/ndlela-search-engine`

**Docker Network:** `ndlela-network` (isolated)

**Ports:**
- 80 (HTTP)
- 443 (HTTPS)
- 3001 (Express Server - internal only)
- 5432 (PostgreSQL - internal only)

**Containers:**
- `ndlela-postgres` - PostgreSQL database
- `ndlela-auth-api` - Authentication API (.NET)
- `ndlela-business-api` - Business logic API (.NET)
- `ndlela-express-server` - API aggregator (Node.js)
- `ndlela-client` - React frontend
- `ndlela-nginx` - Nginx reverse proxy

**Volumes:**
- `postgres_data` - Database persistence
- `dpkeys` - DataProtection keys
- `./uploads` - User uploads
- `/home/mulalo/logs/ndlelaSearchEngineLogs` - Application logs

**Configuration Files:**
- `docker-compose.prod.yml`
- `backend/services/SA.Tourism.Auth.Api/Dockerfile`
- `backend/services/SA.Tourism.Business.Api/Dockerfile`
- `frontend/server/Dockerfile`
- `frontend/client/Dockerfile`
- `nginx/nginx.conf`
- `nginx/conf.d/ndlela-https.conf`

## Development Best Practices

### When Making Changes

1. **Always verify isolation is maintained**
   - Check no new shared resources are introduced
   - Verify port allocations remain unique
   - Ensure configuration changes are application-specific

2. **Test independence after changes**
   ```bash
   # After any changes, verify other apps unaffected
   cd /home/mulalo/applications/ndlela-search-engine
   ./scripts/deploy.sh restart
   
   # Verify other applications still work
   curl -I https://leetshego.co.za
   curl -I http://localhost:8080/health
   ```

3. **Document any new resources**
   - Update APPLICATION_ISOLATION.md if adding services
   - Document new port allocations
   - Keep architecture documentation current

### When Adding New Services

1. **Use application-specific naming**
   - Prefix all containers with `ndlela-`
   - Use `ndlela-network` for networking
   - Namespace all volumes and configs

2. **Verify no conflicts**
   ```bash
   # Check for port conflicts
   sudo netstat -tlnp | grep <new-port>
   
   # Check for container name conflicts
   docker ps -a | grep <container-name>
   
   # Check for network conflicts
   docker network ls | grep <network-name>
   ```

3. **Update documentation**
   - Add new services to README
   - Update port allocation in APPLICATION_ISOLATION.md
   - Document in this file
   - Update docker-compose.prod.yml comments

### When Troubleshooting

**Never modify another application's resources to fix issues in this application.**

If you encounter conflicts:
1. Change this application's configuration
2. Use different ports/names/resources
3. Maintain isolation at all costs

## Verification Commands

### Check Isolation

```bash
# View this application's containers only
docker ps --filter "name=ndlela"

# View this application's network only
docker network inspect ndlela-search-engine_ndlela-network

# Verify port usage
sudo lsof -i :80
sudo lsof -i :443
```

### Test Independence

```bash
# Restart this application
cd /home/mulalo/applications/ndlela-search-engine
./scripts/deploy.sh restart

# Verify other applications unaffected (should return 200)
curl -I http://localhost:8080/health  # Leetshego
```

## Database Isolation

**Critical:** This application has its own PostgreSQL instance.

- Never connect to another application's database
- Never share database credentials
- Database is only accessible within `ndlela-network`
- Backup and restore processes are application-specific

## API Service Isolation

This application has multiple API services:

1. **Auth API** - Authentication and user management
2. **Business API** - Business logic and data access

**Rules:**
- These APIs serve ONLY this application
- No other application should call these APIs directly
- All APIs are only accessible within `ndlela-network`
- External access is proxied through nginx

## Frontend Isolation

The React frontend and Express server are specific to this application:

- Frontend served only by `ndlela-client` container
- Express server aggregates only `ndlela-*` APIs
- All static assets are application-specific
- No shared frontend components with other applications

## What This Means for Developers

- **Design for isolation:** Every feature must respect application boundaries
- **No quick fixes:** Never use another app's resources as a shortcut
- **Test isolation:** Every change must include isolation verification
- **Document everything:** All resources must be clearly documented
- **Think independently:** This application should be completely self-contained

## Multi-Service Coordination

When working with multiple services in this application:

1. **Use internal networking**
   - Services communicate via container names
   - Example: `http://auth-api:80` not `http://localhost:xxx`

2. **Respect service boundaries**
   - Each service has a clear responsibility
   - Don't bypass service APIs

3. **Maintain health checks**
   - Every service must have a health check
   - Health endpoints must be documented

## References

- **Full Isolation Documentation:** `/home/mulalo/applications/APPLICATION_ISOLATION.md`
- **Quick Reference:** `/home/mulalo/applications/QUICK_REFERENCE.md`
- **Deployment Scripts:** `/home/mulalo/applications/ndlela-search-engine/scripts/`
- **Project Documentation:** `/home/mulalo/applications/ndlela-search-engine/docs/`

## Compliance

**This is not a suggestion - it is a mandatory requirement.**

Violating application isolation can cause:
- Cascading failures across multiple applications
- Unexpected downtime
- Difficult-to-debug issues
- Production outages
- Data corruption or leaks

Always prioritize isolation in every development decision.

---

**Last Updated:** December 1, 2025
**Applies To:** All development work on Ndlela Search Engine

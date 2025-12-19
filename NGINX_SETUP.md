# Nginx Production Configuration

## Host Nginx Setup (Outside Docker)

The production server uses host-level nginx to handle SSL and route traffic to the Docker containers.

### Configuration File Location
`/etc/nginx/sites-enabled/ndlelasearchengine.co.za.conf`

### Critical Configuration Details

**API Proxy Configuration:**
```nginx
location ^~ /api/ {
    proxy_pass http://127.0.0.1:3001/api/;
    # ... other proxy headers
}
```

**Important:** The `proxy_pass` directive MUST include `/api/` at the end to preserve the `/api` prefix when forwarding to the Express server. Without this, requests to `/api/auth/register` would be forwarded as `/auth/register`, resulting in 404 errors.

### Common Issues

1. **404 on API endpoints (login/register)**
   - **Cause:** Missing `/api/` suffix in `proxy_pass` directive
   - **Fix:** Ensure `proxy_pass http://127.0.0.1:3001/api/;` (note the trailing `/api/`)

2. **After configuration changes**
   ```bash
   sudo nginx -t  # Test configuration
   sudo systemctl reload nginx  # Apply changes
   ```

### Reference Configuration

See the complete working configuration in the root of this repository:
- To view the current active Nginx configuration, run:
  ```bash
  sudo cat /etc/nginx/sites-enabled/ndlelasearchengine.co.za.conf
- Nginx logs: `/home/mulalo/logs/ndlelaSearchEngineLogs/`
  - `access.log` - Request logs
  - `error.log` - Error logs

### Container Nginx Configuration

The Docker container client also has its own nginx config at:
`frontend/client/nginx.conf`

This handles routing within the Docker network and is separate from the host nginx.

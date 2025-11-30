# CI/CD Pipeline Guide

## Overview
- All code must pass automated tests before merge.
- Linting, dependency checks, and security scans must run automatically.
- Deployments must follow environment progression from `dev -> test -> staging -> production`.
- Production deployments are automated via GitHub Actions and a server-side deploy script.

## GitHub Actions Workflow
- File: `.github/workflows/deploy-prod.yml`
- Triggers: Push to `main` branch.
- Steps:
	- Check out repository.
	- Set up Node (v20) and install dependencies with `npm ci`.
	- Run unit tests with `vitest`.
	- SSH into production VPS and execute `/srv/deploy/deploy_ndlela.sh`.

## Required GitHub Secrets
- `VPS_HOST`: Public IP or hostname of the production server.
- `VPS_USER`: SSH user (e.g., `mulalo`).
- `VPS_SSH_KEY`: Private SSH key with access to the server (use a deploy key or user key).
- Optional: `VPS_PORT` if SSH is not on `22`.

## Server-side Deploy Script
- Location: `/srv/deploy/deploy_ndlela.sh`
- Responsibilities:
	- Log actions to `/srv/sites/ndlela-search-engine/logs/deploy.log`.
	- `git fetch` and hard-reset repo to `origin/main`.
	- `docker compose -f docker-compose.prod.yml build --pull` and `up -d`.
	- Test and reload Nginx (`nginx -t && nginx -s reload`).
	- Perform HTTPS health check on `/health` and exit non-zero on failure.

## Operational Flow
- Developer merges to `main`.
- GitHub Actions runs tests; if passing, connects to server and runs deploy script.
- Containers rebuild/restart as needed; Nginx is reloaded safely.
- Health check verifies site availability.

## Observability and Logs
- CI logs: GitHub Actions run output.
- Server deploy logs: `/srv/sites/ndlela-search-engine/logs/deploy.log`.
- Application logs: `docker compose -f docker-compose.prod.yml logs -f`.

## Rollback Strategy
- If deployment fails:
	- Inspect deploy logs and container logs.
	- `git reset --hard <last-known-good-commit>` on the server repo.
	- `docker compose -f docker-compose.prod.yml build --pull && docker compose -f docker-compose.prod.yml up -d`.
	- Confirm health endpoint returns HTTP 200.

## Security Notes
- Restrict SSH access and rotate keys periodically.
- Keep `.env` production secrets off the repository; manage directly on the server.
- Ensure database port is not exposed publicly.

## Maintenance
- Periodically prune Docker resources: `docker system prune -a --volumes` (with caution).
- Monitor Nginx warnings; update configs to remove deprecated directives when feasible.


# CI/CD Setup Guide for Ndlela Search Engine

## Overview

This repository has three GitHub Actions workflows that automate testing, building, and deployment:

1. **ci-dev.yml** - Runs on dev branch (tests, builds, security scans)
2. **deploy-production.yml** - Deploys to production when merging to main
3. **release.yml** - Creates releases when changes merge to main

## Workflow Process

```
Feature Branch → PR to dev → Merge to dev → PR to main → Merge to main → Auto Deploy
     ↓              ↓            ↓             ↓             ↓              ↓
   Local         CI Tests    Dev Tests    CI Tests    Production    Live Site
   Development   Run         Pass         Run         Deploy         Updated
```

## Setup Instructions

### Step 1: Generate SSH Key for Deployment

On your local machine or server:

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key

# Display private key (you'll add this to GitHub)
cat ~/.ssh/github_deploy_key

# Display public key (you'll add this to server)
cat ~/.ssh/github_deploy_key.pub
```

### Step 2: Add Public Key to Server

On your production server (102.214.11.174):

```bash
# Login as mulalo
ssh mulalo@102.214.11.174

# Add the public key to authorized_keys
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/mdzivhani/ndlela-search-engine
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:

   **Name:** `SSH_PRIVATE_KEY`
   **Value:** Paste the entire private key from `~/.ssh/github_deploy_key`

### Step 4: Test SSH Connection

Verify the SSH key works:

```bash
# From your local machine
ssh -i ~/.ssh/github_deploy_key mulalo@102.214.11.174 "echo 'Connection successful'"
```

Should output: "Connection successful"

### Step 5: Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under "Actions permissions", select **Allow all actions and reusable workflows**
3. Under "Workflow permissions", select **Read and write permissions**
4. Click **Save**

### Step 6: Create Production Environment (Optional but Recommended)

1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name it: `production`
4. Add protection rules:
   - ✅ Required reviewers (add yourself)
   - ✅ Wait timer: 5 minutes (optional)
5. Click **Save protection rules**

## Usage

### Normal Development Workflow

1. **Create feature branch**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature
   ```

3. **Create PR to dev**
   - Go to GitHub
   - Create Pull Request: `feature/your-feature` → `dev`
   - CI tests will run automatically
   - Wait for ✅ checks to pass
   - Merge PR

4. **Create PR to main**
   - Create Pull Request: `dev` → `main`
   - CI tests will run again
   - Wait for ✅ checks to pass
   - Merge PR

5. **Automatic Deployment**
   - Upon merge to main, deployment workflow triggers
   - Tests run
   - Docker images build
   - Deployment to production server
   - Health checks run
   - Site automatically updated! 🎉

### What Happens During Deployment

1. **Tests**: All tests run (frontend & backend)
2. **Build**: Docker images build for all services
3. **Deploy**: 
   - Images transferred to server
   - Database backup created
   - Latest code pulled
   - Services restarted with new images
   - Health check performed
4. **Rollback**: If deployment fails, services restart with previous images

### Monitoring Deployments

1. Go to **Actions** tab in GitHub
2. Click on the running workflow
3. Watch real-time logs
4. See deployment status

### Manual Deployment (if needed)

You can manually trigger deployment:

1. Go to **Actions** → **Deploy to Production**
2. Click **Run workflow**
3. Select `main` branch
4. Click **Run workflow**

## Workflow Details

### CI/CD - Dev Branch (ci-dev.yml)

**Triggers:** Push or PR to dev branch

**Jobs:**
- Lint and format checking
- Run all tests (frontend & backend)
- Build Docker images
- Security scanning with Trivy
- Comment on PRs with status

### Deploy to Production (deploy-production.yml)

**Triggers:** Push to main branch (or manual)

**Jobs:**
1. **Test**: Run all tests
2. **Build**: Build Docker images with caching
3. **Deploy**: 
   - Transfer images to server
   - Backup database
   - Deploy with docker-compose
   - Health check
4. **Rollback**: Automatic rollback if deployment fails

**Deployment Steps:**
```
1. Checkout code
2. Build Docker images (with BuildKit caching)
3. Upload artifacts
4. SSH to server
5. Load new Docker images
6. Backup database
7. Pull latest code
8. Deploy services
9. Health check
10. Cleanup old images
```

### Create Release (release.yml)

**Triggers:** Merge to main

**Actions:**
- Generates version number (date-based)
- Creates changelog from commits
- Creates GitHub release
- Tags the release

## Troubleshooting

### Deployment Fails with SSH Error

**Problem:** "Permission denied (publickey)"

**Solution:**
1. Verify private key is added to GitHub secrets
2. Verify public key is in server's `~/.ssh/authorized_keys`
3. Check key permissions on server: `chmod 600 ~/.ssh/authorized_keys`

### Deployment Fails with Docker Error

**Problem:** "Cannot connect to Docker daemon"

**Solution:**
1. SSH to server
2. Check Docker is running: `docker ps`
3. Add user to docker group: `sudo usermod -aG docker mulalo`
4. Logout and login again

### Health Check Fails

**Problem:** "Health check returned HTTP 000"

**Solution:**
1. SSH to server
2. Check services: `docker compose -f docker-compose.prod.yml ps`
3. Check logs: `docker compose -f docker-compose.prod.yml logs`
4. Restart if needed: `docker compose -f docker-compose.prod.yml restart`

### Build Cache Issues

**Problem:** "Old code still running after deployment"

**Solution:**
1. Go to GitHub Actions
2. Clear cache: Settings → Actions → Management → Clear cache
3. Rebuild: Re-run workflow with "Build without cache" option

## Best Practices

### Commit Messages

Use conventional commits format:
```
feat: add new search filter
fix: resolve authentication bug
docs: update API documentation
style: format code with prettier
refactor: simplify database queries
test: add unit tests for API
chore: update dependencies
```

### Branch Protection

Already configured:
- ✅ Require pull requests before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date

### Testing Before Merge

Always ensure:
1. All CI tests pass ✅
2. Code review approved ✅
3. No merge conflicts ✅
4. Documentation updated ✅

## Monitoring

### Check Deployment Status

```bash
# SSH to server
ssh mulalo@102.214.11.174

# Check services
cd /home/mulalo/applications/ndlela-search-engine
docker compose -f docker-compose.prod.yml ps

# Check logs
docker compose -f docker-compose.prod.yml logs -f

# Check recent deployments
ls -lt backups/pre-deploy-*.sql.gz | head -5
```

### View GitHub Actions History

1. Go to **Actions** tab
2. See all workflow runs
3. Click on any run to see details
4. Download logs if needed

## Rollback Procedure

### Automatic Rollback

If deployment fails, services automatically restart with previous images.

### Manual Rollback

If you need to rollback to a previous version:

```bash
# SSH to server
ssh mulalo@102.214.11.174
cd /home/mulalo/applications/ndlela-search-engine

# Find previous backup
ls -lt backups/pre-deploy-*.sql.gz

# Restore database (if needed)
gunzip < backups/pre-deploy-YYYYMMDD_HHMMSS.sql.gz | docker exec -i ndlela-postgres psql -U postgres -d ndlela

# Checkout previous version
git log --oneline -10
git checkout <previous-commit-hash>

# Rebuild and restart
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

## Security Notes

1. **SSH Private Key**: Never commit the private key to the repository
2. **Secrets**: Use GitHub Secrets for all sensitive data
3. **Database Backups**: Automatic backups before each deployment
4. **Server Access**: Only GitHub Actions and authorized users have SSH access
5. **HTTPS**: All production traffic uses HTTPS

## Performance Optimizations

The workflows include:
- ✅ Docker BuildKit caching (faster builds)
- ✅ npm/yarn caching (faster installs)
- ✅ Parallel job execution
- ✅ Artifact reuse between jobs
- ✅ Incremental deployments (only changed services restart)

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Check server logs: `docker compose -f docker-compose.prod.yml logs`
3. Review this guide
4. Check documentation in `/docs`

## Next Steps

After setup:
1. ✅ Make a test change
2. ✅ Create PR to dev
3. ✅ Merge to dev
4. ✅ Create PR to main
5. ✅ Watch automatic deployment!

---

**Setup Complete!** Your CI/CD pipeline is ready to automatically deploy changes to production.

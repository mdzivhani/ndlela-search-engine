# Setup Guide

Consolidated from: COMPLETE_SETUP_SUMMARY.md, SETUP_COMPLETE.md, README.md environment sections.

## Prerequisites
- Node.js 20+
- .NET 8 SDK
- Docker & Docker Compose (optional)
- Git

## Directory Overview
```
frontend/client      # React + Vite SPA
frontend/server      # Express proxy / aggregation
backend/services     # .NET microservices
docs/                # Standards & consolidated guides
instructions/        # Development guidelines (reference)
```

## Environment Variables
Frontend `.env`:
```
VITE_API_URL=http://localhost:3001
```
Backend (sample):
```
DATABASE_URL=Server=localhost;Database=tourism_db;...
JWT_SECRET=your-secret-key
SEARCH_INDEX_URL=http://localhost:9200
```
Ensure secrets are never committed; use user secrets / vault in production.

## Initial Setup
```bash
git clone <repo>
cdendlela-search-engine

# Frontend client
cd frontend/client
npm install

# Express proxy
cd ../server
npm install

# Backend
cd ../../backend
dotnet restore && dotnet build && dotnet test
```

## Running (Local)
Terminal 1:
```bash
cd frontend/server
npm run dev   # 3001
```
Terminal 2:
```bash
cd frontend/client
npm run dev   # 5173
```
Optional Docker Compose (services + db):
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

## Common Ports
| Service | Port |
|---------|------|
| Vite Client | 5173 |
| Express Proxy | 3001 |
| Auth API | 5001 |
| Business API | 5002 |
| Search API | 5003 |
| OpenSearch/Elasticsearch | 9200 |

## Database Migrations (Future)
When EF migrations are added:
```bash
dotnet ef migrations add <Name> -p services/SA.Tourism.Business.Api
dotnet ef database update -p services/SA.Tourism.Business.Api
```

## Docker Workflow
Build & run:
```bash
docker compose -f docker-compose.dev.yml build
docker compose -f docker-compose.dev.yml up -d
```
Stop:
```bash
docker compose -f docker-compose.dev.yml down
```

## Health Checks (Add later)
Suggested endpoints:
- `/health/live`
- `/health/ready`

## Troubleshooting Quick Fixes
| Issue | Fix |
|-------|-----|
| Port in use | terminate process; restart service |
| Module not found | reinstall deps (`rm -r node_modules; npm install`) |
| .NET restore errors | `dotnet nuget locals all --clear` |
| Container fails | check logs `docker compose logs <service>` |

## Next Steps
Proceed to Implementation Guide for architecture & cross-cutting details.

---
Last Updated: 2025-11-25
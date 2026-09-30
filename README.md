# Ndlela Search Engine

For the current implemented features, local startup, PayFast/SMTP configuration and release limitations, see [the platform release guide](docs/PLATFORM_RELEASE.md). The active web app runs on React, Express and PostgreSQL; the .NET services remain separate.

A comprehensive South African national tourism platform featuring a modern React frontend, microservices-based .NET backend, and full-text search capabilities.

## 🎯 Project Overview

**Ndlela** (meaning "path" or "way" in Zulu) is a complete tourism search and discovery platform designed to help users find tourism businesses, attractions, and services across South Africa. The platform features user authentication, advanced search capabilities, and responsive design for mobile and desktop users.

## 🏗️ Architecture

```
Ndlela Search Engine
├── Frontend
│   ├── client/          # React 18 + TypeScript + Vite SPA
│   └── server/          # Express.js proxy server with JWT auth
├── Backend
│   └── services/        # .NET 8 microservices (Auth, Business, Search)
└── Infrastructure
    ├── Documentation/   # API contracts, standards, guides
    ├── Instructions/    # Development guidelines and best practices
    └── CI/CD/          # GitHub Actions workflows
```

## ✨ Feature Highlights

Frontend: Auth, protected routes, advanced search & filtering, responsive design, strict TypeScript.
Backend: .NET 8 microservices (Auth, Business, Search), JWT auth, EF Core persistence, search integration ready.
Infrastructure: CI/CD workflows, standards & contracts, Docker-based local environment.

## 🚀 Quick Start

Prerequisites: Node.js 22.12+, .NET 8 SDK, Docker (optional), Git.

Frontend:
```bash
cd frontend/client
npm install
npm run dev   # http://localhost:5173
```

Backend (example search API):
```bash
cd backend
dotnet restore && dotnet build && dotnet test
dotnet run --project services/SA.Tourism.Search.Api/SA.Tourism.Search.Api.csproj
```

Express Proxy:
```bash
cd frontend/server
npm install
npm run dev  # http://localhost:3001
```

## 📁 Project Structure

```
frontend/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── pages/                  # Login, Register, Search pages
│   │   ├── components/             # ProtectedRoute, SearchBar components
│   │   ├── services/               # API service layer
│   │   ├── contexts/               # AuthContext for global state
│   │   ├── types/                  # TypeScript type definitions
│   │   └── styles.css              # Global responsive styles
│   └── vite.config.ts              # Vite configuration with proxy
├── server/                          # Express.js proxy server
│   ├── routes/
│   │   ├── auth.router.js          # JWT authentication endpoints
│   │   └── search.router.js        # Search functionality endpoints
│   └── index.js                    # Express app setup

backend/
├── services/
│   ├── SA.Tourism.Auth.Api/        # Authentication microservice
│   ├── SA.Tourism.Business.Api/    # Business management microservice
│   ├── SA.Tourism.Search.Api/      # Search microservice
│   └── */Infrastructure/           # EF Core DbContext and repositories
└── docker-compose.yml              # Orchestrate all services

instructions/
├── frontend-guidelines.md           # Frontend development standards
├── backend-guidelines.md            # Backend development standards
├── project-structure.md             # Project organization guidelines
├── naming-conventions.md            # Naming rules and patterns
└── [more guidelines...]             # Additional best practices

docs/
├── API-CONTRACTS.md                # API specifications
├── SECURITY-STANDARDS.md           # Security best practices
├── TESTING-GUIDE.md                # Testing strategies
└── [more documentation...]         # Additional resources
```

## 🔌 API Endpoints

### Authentication (via Express Proxy)
```
POST   /api/auth/register            # Create new user account
POST   /api/auth/login               # Authenticate user
GET    /api/auth/me                  # Get current user (protected)
```

### Search (via Express Proxy)
```
GET    /api/search?q={query}         # Full-text search (protected)
GET    /api/search/category?c={cat}  # Search by category (protected)
```

### Backend Microservices
```
Auth Service:     http://localhost:5001
Business API:     http://localhost:5002
Search API:       http://localhost:5003
```

## 🔐 Authentication Flow

1. **Register**: User creates account → Express stores user → Returns JWT token
2. **Login**: User enters credentials → Express validates → Returns JWT token
3. **Protected Routes**: Client stores token in localStorage → Sent in Authorization header
4. **Token Verification**: Express validates token → Grants access to protected endpoints

## 🧪 Testing

### Frontend Tests
```bash
cd frontend/client
npm run test          # Run Vitest unit tests
npm run build         # Build for production
```

### Backend Tests
```bash
cd backend
dotnet test           # Run all xUnit tests
```

## 📊 Mock Data

The Express proxy includes 10 mock tourism businesses for testing:
- Kruger Game Lodge
- Table Mountain Tours
- Cape Town Spa
- Winelands Experience
- Garden Route Adventure
- East London Beach Resort
- Durban Aquarium
- Knysna Oyster Feast
- Mpumalanga Hiking
- Johannesburg Arts Gallery

Search keywords: "safari", "table", "cape", "wine", "adventure", "beach", "tour", "accommodation", "spa", "food"

## 🚢 Deployment

### Docker Deployment
```bash
# Build images
docker-compose -f docker-compose.dev.yml build

# Run all services
docker-compose -f docker-compose.dev.yml up
```

### GitHub Actions CI/CD
- Runs on every push to `main` branch
- Tests backend (.NET projects)
- Tests frontend (React + Vite)
- Builds Docker images
- Ready for registry push (Azure Container Registry, Docker Hub)

## 📚 Documentation

All detailed documentation now lives exclusively under `docs/`.

### Table of Contents
- [Setup guide](docs/SETUP_GUIDE.md)
- [Implementation guide](docs/IMPLEMENTATION_GUIDE.md)
- [Project guide](docs/PROJECT-GUIDE.md)
- [Frontend guide](docs/FRONTEND_GUIDE.md)
- [Backend guide](docs/BACKEND_GUIDE.md)
- [API contracts](docs/API-CONTRACTS.md)
- [Testing guide](docs/TESTING_GUIDE.md)
- [Git & workflow](docs/GIT_AND_WORKFLOW.md)
- [Quick reference](docs/QUICK_REFERENCE.md)
- [Environment standards](docs/ENVIRONMENT-STANDARDS.md)
- [Security standards](docs/SECURITY-STANDARDS.md)
- [Observability standards](docs/OBSERVABILITY-STANDARDS.md)
- [Database standards](docs/DATABASE-STANDARDS.md)
- [Pipeline guide](docs/PIPELINE-GUIDE.md)
- [Frontend standards](docs/FRONTEND-STANDARDS.md)
- [Backend standards](docs/BACKEND-STANDARDS.md)
- [Documentation standards](docs/DOCUMENTATION-STANDARDS.md)

All former root-level duplicate markdown files have been removed to avoid confusion. Use the links above as the single source of truth.

## 🛠️ Workflow & Standards (Summary)
- Branching & protection: see `docs/GIT_AND_WORKFLOW.md`
- Commit messages: Conventional Commits (feat, fix, docs, style, refactor, test, chore)
- Frontend: TS strict, ESLint + Prettier
- Backend: SOLID, async patterns, DI, clean architecture
- Security & performance: see `docs/SECURITY-STANDARDS.md`, `docs/OBSERVABILITY-STANDARDS.md`

## 🔧 Configuration

### Environment Variables
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3001

# Backend (.env)
DATABASE_URL=Server=localhost;Database=tourism_db;...
JWT_SECRET=your-secret-key
SEARCH_INDEX_URL=http://localhost:9200  # OpenSearch/Elasticsearch
```

### Project Settings
- **Node.js Version**: 20+
- **.NET Version**: 8.0
- **TypeScript Target**: ES2020
- **React Mode**: Strict (double mount in dev)
- **Port Mapping**: Vite (5173), Express (3001), Auth API (5001), Business API (5002), Search API (5003)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following guidelines in `instructions/`
3. Run tests: `npm run test` or `dotnet test`
4. Commit with conventional messages
5. Push and create Pull Request
6. Wait for CI/CD to pass and code review

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port (Windows PowerShell)
netstat -ano | findstr :PORT
taskkill /PID {PID} /F
```

### Module Not Found
```bash
# Clear and reinstall dependencies
rm -r node_modules
npm install --legacy-peer-deps
```

### Build Errors
```bash
# Clean build
dotnet clean
dotnet build

# Frontend
npm run build
```

### CI/CD Failures
- Check GitHub Actions logs: https://github.com/mdzivhani/ndlela-search-engine/actions
- Verify environment variables in Secrets
- Check Docker image builds
- Review test output for failures

## 📈 Performance (Targets)
- Bundle (frontend, gzipped): ~150KB
- API median response: <100ms
- Search queries: <50ms
- Mobile FCP: <2s

## 🔒 Security Features

- JWT token-based authentication
- Password hashing and validation
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- Environment variable protection
- SQL injection prevention (EF Core parameterized queries)

## 📝 License

This project is part of the South African national tourism platform initiative.

## 👥 Team

- **Developer**: Mulalo Dzivhani
- **Repository**: https://github.com/mdzivhani/ndlela-search-engine

## 📞 Support

For issues, questions, or contributions:
1. Check existing documentation in `docs/` and `instructions/`
2. Review GitHub Issues: https://github.com/mdzivhani/ndlela-search-engine/issues
3. Check GitHub Discussions
4. Create detailed issue with reproduction steps

## 🎉 Status
✅ Frontend stable | ✅ Backend scaffolded | ✅ CI/CD active | 🔄 Integration in progress | 🚀 Deployment-ready

---

**Last Updated**: November 25, 2025
**Version**: 0.2.0 (Docs Consolidation)
**Status**: Active Development

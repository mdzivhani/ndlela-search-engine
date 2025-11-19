# Ndlela Search - Backend Local Development

This README describes how to run the backend services locally for development and testing.

Prerequisites

- Docker & Docker Compose
- .NET 8 SDK
- Node.js & npm (for the Express server)
- PowerShell (examples below assume `pwsh`)

Quick start (PowerShell)

1. Copy environment sample and set secrets (optional):

```powershell
cd backend
copy .env.sample .env
# edit .env to change JWT_KEY or DB connection string if needed
```

2. Start Postgres + Adminer (docker-compose):

```powershell
cd backend
docker-compose up -d
```

3. Install dotnet local tools (EF Core CLI):

```powershell
cd backend
dotnet tool restore
```

4. Create EF migration (one-time):

Run the following from the repository root (PowerShell):

```powershell
cd backend
dotnet ef migrations add InitialCreate --project ./services/SA.Tourism.Business.Infrastructure/ --startup-project ./services/SA.Tourism.Business.Api/ --context SA.Tourism.Business.Infrastructure.Data.BusinessDbContext
```

5. Apply migrations to the local database:

```powershell
dotnet ef database update --project ./services/SA.Tourism.Business.Infrastructure/ --startup-project ./services/SA.Tourism.Business.Api/ --context SA.Tourism.Business.Infrastructure.Data.BusinessDbContext
```

6. Run services locally (examples):

- Business API (will listen on `http://localhost:5001`):
```powershell
dotnet run --project services/SA.Tourism.Business.Api/SA.Tourism.Business.Api.csproj --urls http://localhost:5001
```

- Auth API (dev stub, listens on `http://localhost:5002`):
```powershell
dotnet run --project services/SA.Tourism.Auth.Api/SA.Tourism.Auth.Api.csproj --urls http://localhost:5002
```

- Express server for frontend proxy (in separate shell):
```powershell
cd frontend/server
npm install
npm run dev
```

7. Run tests:

```powershell
cd backend
dotnet test
```

Notes and recommendations

- The repo includes `backend/.config/dotnet-tools.json` so running `dotnet tool restore` in the `backend` folder will install `dotnet-ef` locally.
- The Auth service is a development stub and should be replaced with secure user storage, hashed passwords, and/or an OIDC provider (IdentityServer or Azure AD) before production.
- For production deployments, do not use automatic `Database.Migrate()` at startup; instead run controlled migrations via CI/CD.
- Keep secrets out of the repository; use Key Vault or another secret store for production.

If you want, I can add a `Makefile` or `mage` tasks for Linux/macOS, or add a GitHub Actions workflow that runs the migrations and tests in CI.

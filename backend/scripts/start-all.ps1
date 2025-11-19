$ErrorActionPreference = 'Stop'

Write-Host "Starting local development environment for Ndlela Search"

# 1) Start docker-compose for Postgres + Adminer
Write-Host "Starting docker-compose (Postgres + Adminer)"
Push-Location ..\
docker-compose up -d
Pop-Location

Write-Host "Restore dotnet tools"
dotnet tool restore

Write-Host "Build backend projects"
dotnet restore
dotnet build

Write-Host "Start Business API (ports configured in project)."
Start-Process -NoNewWindow -FilePath "dotnet" -ArgumentList "run --project services/SA.Tourism.Business.Api/SA.Tourism.Business.Api.csproj --urls http://localhost:5001"

Write-Host "Start Auth API"
Start-Process -NoNewWindow -FilePath "dotnet" -ArgumentList "run --project services/SA.Tourism.Auth.Api/SA.Tourism.Auth.Api.csproj --urls http://localhost:5002"

Write-Host "Start Express server for frontend API proxy"
Push-Location ..\frontend\server
npm install
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev"
Pop-Location

Write-Host "You can run the Vite client separately: cd frontend/client; npm install; npm run dev"

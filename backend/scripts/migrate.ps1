$ErrorActionPreference = 'Stop'
Write-Host "Restoring dotnet tools..."
dotnet tool restore

Write-Host "Ensure docker-compose Postgres is running (backend/docker-compose.yml)..."
Write-Host "If not running, run: docker-compose up -d"

Write-Host "Creating / applying migrations for BusinessDbContext (Infrastructure project)."
Write-Host "You can add a migration with the command below (name 'InitialCreate' is suggested):"
Write-Host "  dotnet ef migrations add InitialCreate --project ./services/SA.Tourism.Business.Infrastructure/ --startup-project ./services/SA.Tourism.Business.Api/ --context SA.Tourism.Business.Infrastructure.Data.BusinessDbContext"

Write-Host "To apply migrations to the database run:"
Write-Host "  dotnet ef database update --project ./services/SA.Tourism.Business.Infrastructure/ --startup-project ./services/SA.Tourism.Business.Api/ --context SA.Tourism.Business.Infrastructure.Data.BusinessDbContext"

Write-Host "If you prefer automation, uncomment the next block to run database update automatically."
# dotnet ef database update --project ./services/SA.Tourism.Business.Infrastructure/ --startup-project ./services/SA.Tourism.Business.Api/ --context SA.Tourism.Business.Infrastructure.Data.BusinessDbContext

Write-Host "Done. Run the commands above to create and apply migrations locally."

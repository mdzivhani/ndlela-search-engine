# Backend Guide

Consolidated from: backend sections of README.md, instructions/backend-guidelines.md, implementation guide extracts.

## Technology
.NET 8, C# 12, ASP.NET Core minimal APIs or controllers (microservices: Auth, Business, Search). EF Core for persistence; future OpenSearch integration for Search.

## Project Structure (Suggested)
```
ServiceName/
  ServiceName.Api/
  ServiceName.Logic/
  ServiceName.Data/
  ServiceName.Common/
  ServiceName.UnitTests/
```

## Core Principles
- Single Responsibility & Clean Architecture boundaries.
- Dependency Injection everywhere (constructor injection; avoid service locator).
- Async all I/O; suffix Async.
- Thin controllers delegating to services.

## Data Access
- EF Core DbContext per service (Scoped lifetime).
- Repositories for aggregate roots; Unit of Work optional for multi-repository transactions.
- Migrations named descriptively: `20251125_AddBusinessLocation`.

## DTO & Mapping
Expose DTOs (no EF entities). Use manual mapping or mapping library (Mapster / AutoMapper) with profiles kept near domain models.

## Validation
Data annotations + FluentValidation (planned). Validate at request boundary; return standardized error envelope.

## Error Handling
Global exception middleware: map domain exceptions to 400/404, unhandled to 500 with correlation id.

## Logging & Observability
Use Serilog (structured). Minimum properties: `CorrelationId`, `UserId`, `Service`, `Action`.
Add health endpoints `/health/live` and `/health/ready`.

## Security
- JWT validation per request.
- Parameterized queries (EF default) & input sanitization.
- No sensitive data in logs.
- Secrets managed via environment / vault.

## Performance
- Avoid N+1 queries; use `Include` or projection.
- Consider compiled queries for hot paths.
- Cache reference data (e.g., categories) where stable.

## API Design
- RESTful resource naming.
- Use problem+json format (future) or current envelope.
- Version path when breaking changes (e.g., `/api/v2/businesses`).

## Testing
| Type | Focus |
|------|-------|
| Unit | Pure logic (services, validators) |
| Integration | EF Core (with test DB or in-memory) |
| Contract | API surface & serialization |
| Performance | Load tests for search queries |

## Example Endpoint Pattern
```csharp
app.MapPost("/api/auth/login", async (LoginRequest req, IAuthService auth) => {
    var token = await auth.LoginAsync(req.Email, req.Password);
    return Results.Ok(new { token });
});
```

## Checklist (Initial)
- [x] Auth scaffold
- [x] Business scaffold
- [x] Search scaffold
- [ ] Business domain richness (services, pricing logic)
- [ ] Search index integration
- [ ] Centralized validation pipeline
- [ ] Health endpoints
- [ ] Observability instrumentation

## Migration Strategy
Add changes through incremental migrations; test locally before pushing. Keep migration history immutable.

## Future Enhancements
- Feature flags & gradual rollout
- Distributed tracing adoption (W3C Trace Context)
- Caching layer for frequent queries
- Background workers for indexing / recommendation tasks

---
Last Updated: 2025-11-25
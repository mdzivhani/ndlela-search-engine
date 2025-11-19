# Backend Standards

## Architecture

- Use clean architecture or hexagonal structure.
- Separate application logic, domain logic, and infrastructure concerns.

Example layout:

src/
   Service.API
   Service.Domain
   Service.Application
   Service.Infrastructure

tests/
   Service.UnitTests
   Service.IntegrationTests

## Coding Rules

- Follow SOLID principles.
- Dependency injection for all services.
- Avoid static state unless justified.

## Testing

- Unit tests required for public logic.
- Integration tests required for database or external calls.
- Mock when appropriate but avoid over-mocking.

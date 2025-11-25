# Implementation Guide

Consolidated from: IMPLEMENTATION_GUIDE.md, IMPLEMENTATION_CHECKLIST.md, README architecture sections.

## Architecture Overview
Three tiers: Frontend (React/Vite), Proxy (Express), Backend Microservices (.NET 8). Supporting search index (OpenSearch/Elasticsearch) and SQL persistence.

```
Client (React) -> Express Proxy (Auth, Search aggregation) -> Microservices (Auth, Business, Search)
```

## Cross-Cutting Concerns
| Concern | Summary | References |
|---------|---------|------------|
| Auth | JWT bearer tokens via proxy; microservices validate | Backend Guide |
| Configuration | `.env` + typed config injection | Setup Guide |
| Logging | Structured logs (Serilog recommended) | Backend Guide / Observability Standards |
| Validation | Frontend form validation + backend DTO validation | Frontend Guide / Backend Guide |
| Error Handling | Unified error response shape `{ status, code, message }` | API Contracts |
| Security | Helmet (proxy), input sanitization, EF parameterization | Security Standards |
| Performance | Debounced searches, EF async operations | Frontend Guide / Backend Guide |

## Domain Modules (Planned)
| Module | Responsibility |
|--------|---------------|
| Auth | User accounts, tokens, roles |
| Business | Tourism business CRUD, services, pricing |
| Search | Aggregated query, filters, geo/spatial future |

## Data Flow Example (Search)
1. User enters query & filters.
2. Frontend builds query params object.
3. Express proxy validates auth, forwards to Search API.
4. Search API queries index + relational data.
5. Results returned (with pagination meta) to client.

## Implementation Checklist (Core Extract)
| Area | Status |
|------|--------|
| Frontend auth flow | ✅ |
| Basic search UI | ✅ |
| Map integration | ✅ |
| Microservice scaffolds | ✅ |
| Docker dev compose | ✅ |
| Documentation consolidation | 🔄 |
| Business domain expansion | ⏳ |
| Search index integration | ⏳ |

## Request/Response Patterns
All APIs return JSON. Pagination pattern:
```json
{
  "results": [/* items */],
  "total": 125,
  "limit": 20,
  "offset": 0
}
```

Errors:
```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Minimum price cannot exceed maximum price"
}
```

## Deployment Considerations
| Layer | Containerization |
|-------|------------------|
| Client | Static assets served via CDN / reverse proxy |
| Express | Node container (health endpoints) |
| Microservices | Individual images (Auth, Business, Search) |
| Search Index | Managed service (OpenSearch) or dedicated container |

## Observability (Planned)
Metrics: request latency, error rate, search query counts.
Tracing: Correlation IDs from proxy through services.
Logging: Structured log levels (Information, Warning, Error) + contextual properties.

## Internationalization (Future)
Implement i18n for multi-language support (Zulu, Afrikaans). Seed translation keys early in components.

## Performance Strategies
- Frontend: Memoization, code-splitting, minimal render loops.
- Backend: Async EF calls, indexing hotspots, caching frequently read reference data.
- Search: Precompute facets, store derived filters.

## Security Overview
- Validate all external inputs.
- Use HTTPS in production.
- Secure JWT secrets (vault).
- Limit data exposure through DTO mapping.

## Extensibility Guidelines
Prefer composition over inheritance in both TypeScript & C#.
Use interfaces (contracts) for service boundaries.
Add feature flags for incremental rollout.

## Next Steps
- Flesh out Business domain models.
- Implement real search index integration.
- Add backend testing coverage for new endpoints.

---
Last Updated: 2025-11-25
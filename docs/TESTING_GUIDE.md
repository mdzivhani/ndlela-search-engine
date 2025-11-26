# Testing Guide

Consolidated from: FRONTEND_TESTING_GUIDE.md, docs/TESTING-GUIDE.md, testing references in implementation docs.

## Scope
- Frontend unit & integration (Vitest + jsdom)
- Backend unit & integration (xUnit)
- Future: contract, performance, e2e.

## Coverage Targets
| Layer | Target |
|-------|--------|
| Hooks | 90% |
| Components | 80% |
| Services (frontend) | 85% |
| Backend services | 80% |

Minimum enforced overall: 80% lines. Exceptions documented.

## Frontend
Run tests:
```bash
cd frontend/client
npm run test
```
Patterns:
- Use data-testid sparingly (prefer semantic queries).
- Mock external libs (Leaflet) where jsdom lacks support.
- Keep test names descriptive: `ComponentName_RendersExpectedElements`.
- Prefer explicit assertions over broad snapshots.

## Backend
Run tests:
```bash
cd backend
dotnet test
```
Guidelines:
- Arrange, Act, Assert pattern.
- One test class per production class.
- Use test doubles (Moq/FakeItEasy) for external dependencies.

## Error Handling Tests
Assert both success and failure (validation errors, auth failures). Ensure consistent error envelope shape.

## Integration Tests (Planned)
- Ephemeral test DB (localdb / SQLite in-memory).
- Seed minimal data fixture.
- Clean up after run.

## Performance & Load (Future)
Tooling: k6 or Locust. Focus on search endpoint latency & throughput.

## CI Integration
- Run frontend & backend tests on each pull request.
- Fail build if coverage < threshold.

## Deterministic Test Guidelines (Merged)
- Tests must be deterministic and repeatable.
- Avoid time-dependent logic without a fixed clock.
- Avoid testing framework internals.
- Avoid network reliance; mock fetch/axios.

## Troubleshooting
| Symptom | Action |
|---------|--------|
| Flaky test | Add explicit waits, remove timing assumptions |
| Coverage drop | Identify uncovered branches via report |
| Memory leak warning | Ensure cleanup of timers / subscriptions |

---
Last Updated: 2025-11-25
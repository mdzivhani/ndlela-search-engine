# Repository overview and local startup

Reviewed on 2026-09-30 against the checked-out source. This describes implemented behavior; older setup documents describe several planned or superseded features.

This is the **pre-implementation baseline**. The subsequent feature release and current setup are documented in [PLATFORM_RELEASE.md](PLATFORM_RELEASE.md).

## Architecture

The working web application is React 18 and TypeScript on Vite, calling an Express API that uses PostgreSQL for accounts. Separate .NET 8 services exist, but Express does not currently forward authentication or search to them.

```text
Browser -> Vite :5173 -> /api proxy -> Express :3001 -> PostgreSQL :5433
   |                                     |
   +-- local destination/business data   +-- ten mock search businesses
   +-- localStorage cart/favourites      +-- JWT authentication and profiles
   +-- Leaflet / OpenStreetMap            +-- avatar files

Separate .NET services: Auth stub, Business persistence, in-memory Search
```

| Area | Entry points | Current behavior |
| --- | --- | --- |
| Routing and state | `frontend/client/src/main.tsx`, `contexts/` | Auth, search parameters, favourites, cart; root redirects to `/search` |
| Search | `pages/Search.tsx`, `services/search.service.ts`, `components/SearchHero.tsx`, `FilterPanel.tsx`, `ActivityMap.tsx` | Public search UI, filter parameters, map and result cards |
| Discovery | `pages/Browse.tsx`, `pages/BusinessDetail.tsx`, `data/` | Local province, attraction and business/service datasets |
| Accounts | `contexts/AuthContext.tsx`, `utils/apiClient.ts`, `frontend/server/routes/auth.router.js` | Register/login, profile editing, password changes/reset, avatar upload/removal |
| Cart and favourites | `contexts/CartContext.tsx`, `FavouritesContext.tsx` | Browser-local persistence; no cross-device synchronization API |
| Checkout | `pages/Checkout.tsx` | Protected demo page; no payment or booking persistence |
| Express | `frontend/server/index.js`, `db.js`, `migrate.js` | Requires JWT secret and reachable PostgreSQL; creates/updates users table before listening |
| Business service | `backend/services/SA.Tourism.Business.*` | Controller -> service -> repository -> EF Core/Npgsql; public lookup and authenticated creation |
| Auth service | `backend/services/SA.Tourism.Auth.Api/Program.cs` | Separate development login stub issuing JWTs |
| Search service | `backend/services/SA.Tourism.Search.*` | In-memory dictionary; search, seed and index endpoints; no external search engine |
| Deployment | Compose files, Dockerfiles, `nginx/`, `scripts/`, `.github/workflows/` | Container packaging, reverse proxies, Linux deployment/backup scripts, CI and deployment workflows |

## Data and API behavior

Express account data lives in `users`; passwords are bcrypt hashes and access tokens are JWTs. The frontend saves its access token in localStorage and checks `/api/auth/me` on initialization. Profile and checkout routes require a frontend authenticated user; Express account endpoints verify bearer tokens.

`GET /api/search` filters ten hard-coded businesses by name, description or category text, then paginates. `GET /api/search/category` supports a category parameter. The general search endpoint currently ignores the location, map bounds, price, rating, dates, guests, facilities and sorting parameters sent by the frontend. A blank query returns all results; a literal `*` is treated as text.

Business details use a separate frontend mock dataset rather than the .NET Business API. The .NET business model uses GUID identifiers and does not match the full frontend business/service model. There is no implemented pipeline from persisted businesses to the separate search index.

## Startup used on this machine

Existing Node dependencies and `frontend/server/.env` were present. Node 22.22.2, npm 10.8.3, and .NET 8/9 SDKs were available. The existing database container was verified as belonging to this checkout and restarted with its volume intact.

From the repository root:

```powershell
docker start ndlelasearchengine-postgres-1
```

In a terminal for the API:

```powershell
cd frontend/server
$env:LOG_DIR = Join-Path (Get-Location) 'logs'
node index.js
```

In a terminal for the client:

```powershell
cd frontend/client
npm run dev -- --host 127.0.0.1 --strictPort
```

Open http://127.0.0.1:5173/. API health is http://localhost:3001/health. PostgreSQL is mapped to localhost:5433. The server environment contains the database connection and JWT secret; no secrets are reproduced here.

For a fresh setup, install dependencies separately in the client and server folders. Provision a project-specific PostgreSQL instance and configure `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `JWT_SECRET` for Express. Set `LOG_DIR` to a writable local directory on Windows.

Only the web application's required services were started. The separate .NET APIs and Adminer were not started. Another application's services occupy ports 5432 and 8080 on this machine, so running the full development Compose stack unchanged would cause a port conflict. Stop the two Node processes with Ctrl+C in their terminals; `docker stop ndlelasearchengine-postgres-1` stops this database while preserving its data.

## Verification results

| Check | Result |
| --- | --- |
| `npm run build` in client | Passed |
| Frontend HTML, Express health, proxied search | HTTP 200; safari search returned Kruger Game Lodge; blank search returned ten results |
| Headless Edge browser smoke check | Search, browse, business/1 and login rendered expected headings with no uncaught page errors |
| `npm test -- --run --reporter=dot` | 4 test files passed, 11 failed; 29 tests passed, 34 failed |
| `npx --no-install tsc --noEmit` | Failed with existing application and test type errors |
| Direct .NET Search.Tests run | 1 test passed |
| Direct .NET Business.Tests run | Failed compilation: outdated service construction, namespace/type ambiguity, missing EF InMemory support |

The Vite build does not run TypeScript checking. Browser smoke checks cover page rendering, not every interaction. Existing accounts were not modified and registration/reset/payment workflows were not exercised against stored user data. Review logs are in ignored `client-tests.log` and `typecheck.log` at the repository root.

## Findings for future work

- Authentication reset currently returns the reset token to an unauthenticated requester instead of sending email. Access-token middleware also does not reject reset-purpose JWTs. These are concrete authentication flaws in `auth.router.js`; this review did not change them.
- The active `vitest.config.ts` omits globals and setup files configured in `vite.config.ts`, contributing to missing test globals, DOM matchers and cleanup. Other failures involve stale mocks/assertions.
- `Ndlela Search Engine.sln` includes only Business.Models. Solution-wide build/test commands do not cover the API or test projects. Run the test project files directly until the solution is corrected.
- Type errors include the missing `requestLocation` hook member, invalid component props, router options, image typings and API header typing. Fixing tests alone will not resolve these application errors.
- Vite proxies `/api` but not `/uploads`. Express serves `frontend/uploads` locally, while checked-in default avatars are elsewhere; the production upload mount also needs reconciliation with the server path. Avatar deletion computes a different filesystem root from upload creation.
- `ProtectedRoute` does not wait for auth initialization, so a direct protected-page load can redirect before token verification completes.
- BusinessDetail calls a state hook after its missing-business early return, which can violate hook ordering if route data changes within the same mounted component.
- Development Compose does not supply Express's required JWT/database environment. The existing server `.env` makes the native startup work, but the documented container startup needs configuration work.
- CI includes a frontend test command with `|| true`; some checks are explicitly allowed to fail. A green workflow is not sufficient evidence that all tests pass. There are overlapping production deployment workflows and stale paths in scripts/docs.
- `scripts/isolation-verify.sh` contains commands to restart a different application, contrary to the repository's isolation policy. It was not executed.
- Database backup archives are present under `backups/`; their contents were not opened or restored.

No application source was changed during this review. This document records the current implementation and observed baseline, not a claim that all features are complete or production-ready.

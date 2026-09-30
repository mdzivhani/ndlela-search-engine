# Discovery and trip-planning release

Implemented locally on 2026-09-30. The active stack is React/Vite, Express and PostgreSQL. The .NET projects remain separate services and now participate in solution builds/tests.

## Traveller experience

| Route | Capabilities |
| --- | --- |
| `/` | New visual identity, destination search, curated collections, photo cards, planner and operator entry points |
| `/search` | Destination/category/price/rating/facility filters, sorting, distance search, explicit map-area search, shareable URL state |
| `/business/:id` | Database-backed listing, photos, services, opening hours, accessibility, transport, languages, cancellation terms, moderated reviews, trip saving and enquiries |
| `/favourites` | Guest-device saving, account synchronization, photo cards and comparison of up to three places |
| `/planner` | Deterministic, budget-aware itinerary suggestions with group estimates and geographic travel estimates |
| `/trips` | Named collections, day assignments, notes, stop reordering/removal, sharing revocation and offline text downloads |
| `/shared/:token` | Read-only trip and notes, signed-in votes, downloadable itinerary |
| `/enquiries` | Availability requests, operator quotes, verified payment statuses, cancellation requests, refund review and post-visit review submission |
| `/operator` | Listing creation/editing, photos, services/prices, practical information, views/saves/enquiry counts, availability replies and ownership claims |
| `/admin` | Ownership evidence review, review moderation and refund request queue |

The UI includes mobile navigation, keyboard focus treatment, visible form labels, reduced-motion support, low-data mode and lazy map loading. Low-data mode avoids listing photos and the hero background; the traveller chooses whether to open the map.

Existing records are explicitly labelled sample listings, including their illustrative prices and stock photos. Sample ratings/review counts are not represented as real reviews. Operators can create real persistent listings. An approved claim assigns ownership but sample entries remain unavailable for enquiries until the operator edits and publishes their actual details.

The planner uses the actual local catalogue; it is not an LLM and does not invent availability. It estimates selected experiences for the group. Transport, meals and lodging are excluded unless explicitly part of a selected service. Geographic time estimates are not live driving directions. There is no live accommodation inventory integration or automatic operator settlement system.

## Local startup

Use Node.js 22.12 or newer (the Docker images use Node 22). The frontend uses Vite 7, React Router 7 and Vitest 4.

On this existing checkout, start the project database while preserving its volume:

```powershell
docker start ndlelasearchengine-postgres-1
```

In separate terminals:

```powershell
cd frontend/server
npm ci
$env:LOG_DIR = Join-Path (Get-Location) 'logs'
npm start
```

```powershell
cd frontend/client
npm ci
npm run dev -- --host 127.0.0.1 --strictPort
```

Open http://127.0.0.1:5173/. The API uses port 3001 and this project's PostgreSQL uses port 5433. Existing `frontend/server/.env` is preserved. For a fresh checkout, copy `frontend/server/.env.example` to `.env`, configure PostgreSQL and generate a strong JWT secret.

Alternatively, after stopping the native Node processes, build and start the web stack with:

```powershell
docker compose -f docker-compose.dev.yml up --build postgres express-server client
```

Development Compose binds the web and database ports to loopback. Adminer is optional on 8083 using the `admin` profile. This avoids the unrelated application's 8080 and 5432 ports. Docker build contexts exclude `.env`, local dependencies and logs. Lockfiles are tracked and images use `npm ci`.

## PayFast and SMTP activation

Integration code is implemented, but **no live email or payment was sent during development**. Set credentials privately in the server environment; never commit them or paste them into issue reports.

| Configuration | Purpose |
| --- | --- |
| `APP_URL` | Public frontend origin; used for reset links and payment return/cancel URLs |
| `PUBLIC_API_URL` | Public HTTPS API origin, reachable by PayFast |
| `PAYFAST_MODE` | `sandbox` by default; set `live` only after provider testing |
| `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE` | Credentials and matching merchant passphrase from the selected PayFast environment |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | SMTP server; port 587 uses STARTTLS, port 465 normally uses `SMTP_SECURE=true` |
| `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | SMTP authentication and verified sender identity |
| `ADMIN_EMAILS` | Comma-separated account emails allowed to moderate; no account is an administrator by default |
| `TRUSTED_PROXY` | Actual reverse-proxy IP/CIDR list, only when behind a trusted proxy; do not use a blanket trust setting |

Checkout requires an operator-confirmed enquiry and a positive server-stored group quote. The server signs the PayFast form; browser-provided prices are not accepted. Only an ITN passing signature, merchant, source-IP, amount and server-to-server checks can record payment. Returning to the app never marks a payment successful. Transaction handling records provider receipts, handles repeated ITNs idempotently, and queues duplicate or late-after-cancellation payments for refund review.

PayFast receives payments into the configured merchant account. Operator payouts, split settlements and automatic refunds are not implemented. Refund requests go to administrators, who must review the terms and process any actual refund through the merchant dashboard. This is not a live inventory reservation system; operators are responsible for the availability they quote.

Before enabling live payments, test sandbox completion, cancellation, delayed/repeated ITNs, amount mismatch, proxy IP handling and a refund through the actual merchant account. PayFast must reach `/api/payments/notify` on an allowed public port. See the [official custom integration and ITN documentation](https://developers.payfast.co.za/docs/itn-instant-transaction-notification/).

Password-reset tokens are delivered through SMTP only and never returned in the public API response. Reset-purpose tokens cannot authorize normal API requests. Password changes and resets invalidate earlier access tokens. SMTP must be configured before requesting a reset; otherwise the UI explains that delivery is unavailable. Verify sender authorization and test email delivery before launch.

## Persistence and authorization

Additive, idempotent startup migrations preserve the existing users table and add listings, favourites, trips, votes, enquiries, reviews, claims, payments, receipts and refund requests. Runtime sample image updates only affect unowned sample records. Tests use a uniquely named temporary database and remove only that database afterwards.

Owners can modify only their own listings and respond only to their own enquiries. Travellers see only their own trips, favourites and enquiries. Shared URLs disclose the trip and its notes to anyone holding the link; the owner can revoke sharing. Voting requires an account and is unique per voter and stop. Reviews require a completed enquiry and administrator approval before affecting public ratings. Claims require administrator approval and cannot replace a different owner.

The current auth rate limit is per server process. A multi-replica deployment should replace that in-memory limiter with a shared store. Saved tokens still use the existing localStorage auth model. A separate production security review remains appropriate before handling real customer payments.

## Validation commands

```powershell
cd frontend/client
npm run build
npm run test:run
npm run e2e
```

The Playwright suite targets http://127.0.0.1:5173 and expects the web app to be running. Install the Playwright Chromium browser first on a fresh machine. The richer isolated database/browser check below uses an installed Microsoft Edge browser when `BROWSER_TESTS=true`:

```powershell
cd frontend/server
npm test
$env:BROWSER_TESTS = 'true'
npm run test:integration
```

The integration script requires a local PostgreSQL user allowed to create test databases. It checks authentication, reset-token rejection, avatar validation/upload/removal, ownership, account isolation, filtered search, planner budgets, collection sharing/votes, quotes, moderation, payment idempotency and cancellation races. Browser checks cover collection creation, planner saving, enquiries, logout isolation, mobile layout and operator listing/service editing.

From the root:

```powershell
dotnet build "Ndlela Search Engine.sln"
dotnet test "Ndlela Search Engine.sln"
```

Frontend builds now include TypeScript checking. CI no longer suppresses frontend test failures. A separate PostgreSQL-backed API CI job runs unit and integration checks.

Final local verification on 2026-09-30: 78 frontend tests passed (2 existing tests skipped), 9 server unit tests passed, 4 Playwright tests passed, 3 .NET tests passed, and the isolated PostgreSQL/browser integration suite passed. Production frontend and both Docker image builds passed. The updated client and server npm dependency audits reported no vulnerabilities. These checks do not substitute for real SMTP delivery or PayFast sandbox testing with configured credentials.

## Image sources

Local illustrative images were downloaded from the existing catalogue's Unsplash URLs, with a South African hero photograph. They are stock destination images, not verified photographs of the sample operators. Original image identifiers: `photo-1516026672322-bc52d61a55d5`, `photo-1580060839134-75a5edca2e99`, `photo-1605640840605-14ac1855827b`, `photo-1536152470836-b943b246224c`, `photo-1516426122078-c23e76319801`, `photo-1609137144813-7d9921338f24`, `photo-1594818379496-da1e345b0ded`. Operators should publish their own authorized photos when onboarding.

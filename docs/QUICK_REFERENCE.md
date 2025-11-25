# Quick Reference

Consolidated from: QUICK_REFERENCE.md (original), README snippets.

## Start Services
```powershell
cd frontend/server; npm run dev   # 3001
cd frontend/client; npm run dev   # 5173
```

## Core Paths
| Item | Path |
|------|------|
| Auth Context | frontend/client/src/contexts/AuthContext.tsx |
| Search Page | frontend/client/src/pages/Search.tsx |
| Business Detail | frontend/client/src/pages/BusinessDetail.tsx |
| API Service | frontend/client/src/services/search.service.ts |
| Global Styles | frontend/client/src/styles.css |

## Auth Token
Stored: `localStorage` key `auth_token`.
Header: `Authorization: Bearer <token>`.

## Common API
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/search?q=term
```

## Search Keywords
`safari`, `table`, `cape`, `wine`, `adventure`, `beach`, `tour`, `accommodation`, `spa`, `food`.

## Git Commands
```bash
git checkout -b feat/<feature>
git commit -m "feat(scope): message"
git push origin feat/<feature>
```

## Troubleshooting
| Issue | Fix |
|-------|-----|
| Port in use | netstat + taskkill (Windows) |
| Module not found | Reinstall deps |
| Token rejected | Clear storage & re-login |
| Build error (.NET) | `dotnet clean && dotnet build` |

## Links
| Doc | Location |
|-----|----------|
| Setup | docs/SETUP_GUIDE.md |
| Implementation | docs/IMPLEMENTATION_GUIDE.md |
| Frontend | docs/FRONTEND_GUIDE.md |
| Backend | docs/BACKEND_GUIDE.md |
| Testing | docs/TESTING_GUIDE.md |
| Git & Workflow | docs/GIT_AND_WORKFLOW.md |

---
Last Updated: 2025-11-25
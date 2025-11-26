# Git & Workflow Guide

Consolidated from: GIT_WORKFLOW.md, GIT_COMMAND_REFERENCE.md, BRANCH_PROTECTION_SETUP.md, WORKFLOW_IMPLEMENTATION_SUMMARY.md, WORKFLOW_SETUP_COMPLETE.md.

## Branching Model
- `main`: stable, deployable.
- Feature branches: `feat/<scope>`.
- Fix branches: `fix/<issue-id>`.
- Docs: `docs/<topic>`.

## Protection Rules (Recommended)
| Rule | Setting |
|------|---------|
| Require PR | Enabled |
| Required reviews | ≥1 (≥2 for critical) |
| Status checks | CI build + tests must pass |
| Linear history | Squash or rebase merges |
| Dismiss stale reviews | Enabled |

## Commit Convention (Conventional Commits)
`type(scope): description`
Types: feat, fix, docs, style, refactor, test, chore.

## Pull Request Checklist
- Linked issue (if applicable)
- Tests added/updated
- Docs updated (if architectural change)
- No unrelated changes
- Lint/format passes locally

## Common Commands
```bash
git checkout -b feat/search-filters
git add .
git commit -m "feat(search): add price range filter"
git push origin feat/search-filters
```

Cleanup merged branches:
```bash
git fetch --prune
git branch -d feat/search-filters
```

## Rebasing Workflow
```bash
git checkout feat/search-filters
git fetch origin
git rebase origin/main
git push --force-with-lease
```

## Versioning & Tags (Future)
Semantic Versioning once releases start, e.g. `v1.0.0`.

## Release Process (Planned)
1. Merge feature branches.
2. Ensure green CI.
3. Tag release.
4. Build/push Docker images.
5. Deploy to staging then production.

## Workflow Automation
GitHub Actions: build, test, (future) security scans. Consider adding lint, SAST, container scanning.

## Handling Hotfixes
```bash
git checkout -b fix/critical-timeout main
# implement fix
git commit -m "fix(timeout): prevent search deadlock"
git push origin fix/critical-timeout
```
Merge via PR with expedited review.

## Code Review Guidelines (Summary)
- Focus on correctness, clarity, security, performance.
- Suggest improvements; avoid nitpicking style already enforced by tooling.
- Approve only when tests & documentation align with changes.

## Monorepo Considerations
Keep cross-cutting tooling (lint, formatting) centralized. Document service ownership in future `OWNERS.md`.

---
Last Updated: 2025-11-25
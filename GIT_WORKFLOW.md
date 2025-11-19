# Git Workflow Guide - Ndlela Search Engine

This document outlines the branching strategy, commit conventions, and pull request process for the Ndlela Search Engine project. Following this workflow ensures code quality, easy collaboration, and a stable main branch.

## 🌳 Branch Strategy

### Branch Structure

```
main (Production)
  ↑
  └─ Pull Request (with required CI/CD + code review)
     └─ dev (Development)
        ↑
        └─ Feature/Bugfix Branches
           ├─ feature/user-profile
           ├─ feature/advanced-search
           ├─ bugfix/auth-token-expiry
           └─ chore/update-dependencies
```

### Branch Purposes

| Branch | Purpose | Who Merges | When |
|--------|---------|-----------|------|
| `main` | Production-ready code | Admin/Lead | After PR approval + CI/CD passes |
| `dev` | Integration branch for features | Developers | After feature completion |
| `feature/*` | Individual features | Self | When feature complete |
| `bugfix/*` | Bug fixes | Self | When bug fixed |
| `chore/*` | Non-feature work | Self | When done |

## 🔧 Setup Instructions

### Initial Setup

```bash
# Clone repository
git clone https://github.com/mdzivhani/ndlela-search-engine.git
cd ndlela-search-engine

# Configure user locally (if not already done)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Fetch all branches
git fetch origin

# Create and track dev branch
git checkout -b dev origin/dev

# Verify you're on dev
git branch -a
# Should show:
#   * dev
#     main
#     remotes/origin/dev
#     remotes/origin/main
```

## 📋 Workflow Steps

### Step 1: Start New Work

```bash
# Ensure you're on dev and it's up to date
git checkout dev
git pull origin dev

# Create feature branch from dev
git checkout -b feature/your-feature-name

# Example feature branches:
git checkout -b feature/search-filters
git checkout -b feature/user-preferences
git checkout -b bugfix/login-validation
git checkout -b chore/update-packages
```

### Step 2: Development

```bash
# Make changes to files
# Edit, refactor, add features...

# Check status
git status

# Stage changes
git add .
# Or selective staging
git add src/pages/Search.tsx src/styles.css

# Commit with conventional message (see section below)
git commit -m "feat: Add advanced search filters"

# Push feature branch to GitHub
git push -u origin feature/your-feature-name
```

### Step 3: Pull Request to Dev

1. **Go to GitHub** → Your feature branch
2. **Click "Compare & pull request"**
3. **Set up PR**:
   - Base: `dev`
   - Compare: `feature/your-feature-name`
   - Title: Use conventional message format
   - Description: Explain what, why, and how

4. **PR Description Template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Documentation update
   - [ ] Performance improvement
   - [ ] Breaking change

   ## Testing
   - [ ] Tested locally
   - [ ] All tests pass
   - [ ] No console errors
   - [ ] Responsive design verified

   ## Related Issues
   Fixes #123

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Comments added for complex logic
   - [ ] No unused variables/imports
   - [ ] TypeScript strict mode passes
   ```

5. **Submit PR**
6. **Wait for CI/CD** to run (frontend build, backend build, tests)
7. **Address review comments** if any
8. **Merge to dev** when approved and CI passes

### Step 4: Merge Dev to Main (Release)

**Process**:
1. **Ensure dev branch is stable** with all features tested
2. **Create PR from dev → main**
3. **CI/CD runs additional checks** (full test suite, build verification)
4. **Code review from team lead/admin**
5. **Merge to main** when approved
6. **Main branch is always production-ready**

```bash
# Local release process (alternative)
git checkout main
git pull origin main

git checkout dev
git pull origin dev

# Verify dev is clean
git status

# Switch to main and merge
git checkout main
git merge --no-ff dev -m "Merge: Release version 0.1.0"

# Push to GitHub
git push origin main
git push origin dev
```

## 📝 Commit Message Convention

Use **Conventional Commits** format for clear commit history.

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Use Case | Example |
|------|----------|---------|
| `feat` | New feature | `feat: Add search filters` |
| `fix` | Bug fix | `fix: Handle null auth token` |
| `docs` | Documentation | `docs: Update API endpoints` |
| `style` | Formatting, no code change | `style: Format TypeScript files` |
| `refactor` | Refactor code | `refactor: Extract search logic` |
| `perf` | Performance improvement | `perf: Optimize search query` |
| `test` | Add/update tests | `test: Add LoginPage unit tests` |
| `chore` | Dependencies, build setup | `chore: Update npm packages` |
| `ci` | CI/CD changes | `ci: Update GitHub Actions workflow` |

### Examples

**Simple commit**:
```bash
git commit -m "feat: Add user profile page"
```

**With scope and description**:
```bash
git commit -m "feat(search): Add category filter to search results"
```

**With body and footer**:
```bash
git commit -m "fix(auth): Prevent infinite redirect loop on logout

The logout function was not properly clearing the auth context,
causing the ProtectedRoute to immediately redirect to login,
which then redirected back to logout.

- Clear auth token from localStorage
- Reset user state in AuthContext
- Test redirect flow after logout

Fixes #45"
```

### Commit Best Practices

- ✅ **Write in present tense**: "Add feature" not "Added feature"
- ✅ **Be specific**: "Add search filters" not "Update code"
- ✅ **One logical change per commit**: Easier to review and revert
- ✅ **Reference issues**: "Fixes #123" links to GitHub issue
- ✅ **Keep commits small**: 5-10 files per commit is ideal
- ✅ **Test before committing**: Ensure code works

## 🔒 Branch Protection Rules

### Main Branch Protection

The `main` branch has the following protection rules:

1. **Require pull request reviews**
   - At least 1 approval required before merge
   - Reviews must be recent (within 7 days)
   
2. **Require status checks to pass**
   - ✅ build-and-test-backend (CI)
   - ✅ build-and-test-frontend (CI)
   - ✅ build-images (Docker)
   
3. **Require branches to be up to date**
   - Must merge main into PR branch before merging
   
4. **Require code reviews from code owners**
   - Requires approval from team leads
   
5. **Restrict who can push to main**
   - Only admins can push directly (emergency hotfixes)
   - All others must use Pull Requests

### Dev Branch Guidelines

The `dev` branch is less restrictive but still enforces:
- Status checks must pass (CI/CD)
- Anyone can merge after status checks pass
- PRs should include meaningful description

## 🚀 CI/CD Workflow

### Automated Checks

**On every push** (dev or main):
```yaml
- Run linters (ESLint, TypeScript)
- Build projects (npm build, dotnet build)
- Run test suites (Vitest, xUnit)
- Build Docker images
```

**On PR to main** (additional):
```yaml
- Code coverage report
- Performance analysis
- Security vulnerability scan
- Documentation build check
```

**On merge to main**:
```yaml
- Build production images
- Push to container registry
- Create GitHub release
- Trigger deployment (optional)
```

## 📊 Typical Developer Workflow

### Day 1: Start Feature
```bash
git checkout dev
git pull origin dev
git checkout -b feature/search-optimization
# ... make changes ...
git commit -m "feat(search): Optimize query performance"
git push -u origin feature/search-optimization
```

### Day 2: Code Review Feedback
```bash
git checkout feature/search-optimization
# ... make requested changes ...
git commit -m "fix: Address performance review comments"
git push origin feature/search-optimization
# GitHub shows new commits automatically
```

### Day 3: Merge to Dev
```bash
# Go to GitHub PR → Merge when approved
# Or merge locally:
git checkout dev
git pull origin dev
git merge --no-ff feature/search-optimization
git push origin dev
git branch -d feature/search-optimization  # Delete local branch
```

### Release: Merge Dev to Main
```bash
git checkout dev
git pull origin dev
# Verify everything works locally

# Create PR from dev to main on GitHub
# Request code review
# After approval, merge (GitHub UI)
```

## 🔍 Viewing Commit History

```bash
# See recent commits
git log --oneline -10

# See commits with branches
git log --graph --oneline --all

# See commits by author
git log --author="Your Name" --oneline

# See commits for specific file
git log --oneline src/pages/Search.tsx

# See what changed in each commit
git log -p --oneline -5
```

## 🆚 Comparing Branches

```bash
# See differences between branches
git diff dev main

# See commits unique to dev
git log main..dev --oneline

# See commits unique to main
git log dev..main --oneline

# See all differences (summary)
git diff --stat dev main
```

## 🔄 Handling Conflicts

### When Merging Dev to Main

```bash
# Update local main with latest
git checkout main
git pull origin main

# Try to merge dev
git merge dev

# If conflicts occur:
# 1. Git will mark conflicted files
# 2. Open files and resolve conflicts
# 3. Look for <<<<<<, ======, >>>>>>
# 4. Edit to keep desired changes
# 5. Stage resolved files
git add .

# 6. Complete the merge
git commit -m "Merge dev to main: resolve conflicts"
git push origin main
```

## 🗑️ Cleanup

```bash
# Delete local feature branch after merging
git branch -d feature/your-feature-name

# Delete remote feature branch
git push origin --delete feature/your-feature-name

# See all branches (including deleted)
git branch -a

# Prune deleted remote branches locally
git fetch --prune
```

## 🆘 Undo Changes

```bash
# Undo uncommitted changes to file
git restore src/pages/Search.tsx
# or
git checkout -- src/pages/Search.tsx

# Undo all uncommitted changes
git restore .

# Unstage file
git restore --staged src/pages/Search.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo last push (force)
git push origin feature/branch-name --force-with-lease

# Create commit that undoes a previous commit
git revert abc123def
```

## 📋 Pre-Commit Checklist

Before pushing code, verify:

- [ ] Code builds successfully
  ```bash
  npm run build          # Frontend
  dotnet build           # Backend
  ```

- [ ] All tests pass
  ```bash
  npm run test           # Frontend
  dotnet test            # Backend
  ```

- [ ] No TypeScript errors
  ```bash
  npx tsc --noEmit
  ```

- [ ] No console errors/warnings
  ```
  Check browser F12 console
  ```

- [ ] Code follows style guidelines
  ```bash
  npm run lint           # If configured
  ```

- [ ] Comments added for complex logic

- [ ] No console.log() left in code

- [ ] No unused imports/variables

- [ ] Related tests updated

- [ ] PR description is clear and complete

## 🚨 Emergency Hotfix (Main Branch)

If critical production bug found:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-name

# Make fix
git commit -m "fix: Resolve critical production bug"

# Push and create PR to main
git push -u origin hotfix/critical-bug-name

# After merge to main, also merge to dev
git checkout dev
git pull origin dev
git merge main
git push origin dev
```

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Help](https://help.github.com)

## ✅ Summary

**Key Points**:
1. ✅ Always create feature branches from `dev`
2. ✅ Push to feature branch, create PR to `dev`
3. ✅ Merge to `dev` after review and CI passes
4. ✅ When ready for release, create PR from `dev` to `main`
5. ✅ `main` is always production-ready
6. ✅ Use conventional commit messages
7. ✅ Run tests before pushing
8. ✅ Keep commits small and focused
9. ✅ Update `dev` from `main` regularly
10. ✅ Delete feature branches after merging

---

**Last Updated**: November 19, 2025
**Status**: Active

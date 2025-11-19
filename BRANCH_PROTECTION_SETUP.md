# Branch Protection Rules Setup - Ndlela Search Engine

This guide explains how to configure branch protection rules on GitHub to enforce the git workflow and maintain code quality.

## 🎯 Why Branch Protection?

Branch protection rules ensure:
- ✅ **Code Quality**: All code is reviewed before merging
- ✅ **CI/CD Validation**: Automated tests must pass
- ✅ **Stability**: Main branch is always production-ready
- ✅ **Security**: Prevents accidental direct pushes to main
- ✅ **Compliance**: Enforces team standards and practices

## 🔐 Setting Up Main Branch Protection

### Access Branch Protection Settings

1. Go to GitHub repository: https://github.com/mdzivhani/ndlela-search-engine
2. Click **Settings** (top navigation)
3. Click **Branches** (left sidebar)
4. Click **Add rule** under "Branch protection rules"

### Rule Configuration for `main`

#### Step 1: Branch Name Pattern

- **Branch name pattern**: `main`
- Click **Create**

#### Step 2: Require Pull Requests

Enable these options:

1. ✅ **Require a pull request before merging**
   - Require approvals: **1**
   - Dismiss stale pull request approvals when new commits are pushed: ✅
   - Require review from code owners: ✅ (if using CODEOWNERS file)

2. ✅ **Require status checks to pass before merging**
   - Require branches to be up to date before merging: ✅
   - Status checks that must pass:
     - `build-and-test-backend (8.0.x)`
     - `build-and-test-frontend`
     - `build-images`

#### Step 3: Additional Settings

3. ✅ **Require branches to be up to date before merging**
   - Ensures PR branch has latest main code

4. ✅ **Restrict who can push to matching branches**
   - Allow force pushes: **No one**
   - Allow deletions: **No**
   - Dismiss stale reviews: ✅

5. ✅ **Require conversation resolution before merging**
   - Ensures all comments/suggestions are addressed

#### Step 4: Save Rule

- Click **Create** to save the rule

### Full Rule Checklist for Main

- [ ] Require pull request reviews before merging
- [ ] Require 1 approval
- [ ] Dismiss stale pull request approvals
- [ ] Require review from code owners
- [ ] Require status checks to pass before merging
- [ ] Require branches to be up to date before merging
- [ ] Require passing status checks:
  - [ ] build-and-test-backend
  - [ ] build-and-test-frontend
  - [ ] build-images
- [ ] Require conversation resolution before merging
- [ ] Allow force pushes: No
- [ ] Allow deletions: No
- [ ] Require linear history: (optional) Yes

## 🌱 Setting Up Dev Branch Protection (Optional but Recommended)

### Rule Configuration for `dev`

#### More Relaxed than Main

- **Branch name pattern**: `dev`

**Enable**:
1. ✅ **Require status checks to pass before merging**
   - Same as main (build, test, Docker)
   - Status checks must pass before merge

2. ✅ **Require branches to be up to date before merging**
   - Keeps dev in sync with main

3. ⚪ **Require pull request reviews**
   - NOT required for dev
   - Developers can merge own PRs to dev after CI passes

4. ⚪ **Restrict force pushes**
   - NOT restricted (development flexibility)

5. ⚪ **Restrict deletions**
   - NOT restricted (old dev branches can be deleted)

**Rationale**: Dev is working branch; main needs stricter protection.

## 📋 Protected Branch Rules Summary

| Rule | Main | Dev |
|------|------|-----|
| Require PR | ✅ Yes | ⚪ Optional |
| Require Reviews | ✅ 1 approval | ⚪ No |
| Require Status Checks | ✅ Yes | ✅ Yes |
| Require Up-to-Date | ✅ Yes | ✅ Yes |
| Allow Force Push | ❌ No | ⚪ Yes |
| Allow Deletions | ❌ No | ⚪ Yes |
| Require Linear History | ✅ Yes | ⚪ No |

## 🚀 GitHub Actions CI/CD Requirements

For branch protection to work, these CI/CD jobs must be configured in `.github/workflows/ci.yml`:

```yaml
jobs:
  build-and-test-backend:
    runs-on: ubuntu-latest
    # ... steps ...

  build-and-test-frontend:
    runs-on: ubuntu-latest
    # ... steps ...

  build-images:
    runs-on: ubuntu-latest
    # ... steps ...
```

**Status Check Names** must match exactly:
- `build-and-test-backend (8.0.x)`
- `build-and-test-frontend`
- `build-images`

## 👥 Code Owners (Optional)

Create `.github/CODEOWNERS` file for automatic reviewers:

```
# Backend .NET code
backend/ @mdzivhani

# Frontend React code
frontend/client/ @mdzivhani

# Infrastructure
.github/ @mdzivhani
docker-compose* @mdzivhani

# Documentation
docs/ @mdzivhani
instructions/ @mdzivhani
*.md @mdzivhani
```

**Effect**: GitHub automatically requests reviews from code owners when PR touches those files.

## 🔄 Merge Methods Configuration

Go to **Settings** → **Options** and configure merge behavior:

- ✅ **Allow merge commits**
  - Default: unchecked
  - Use: `git merge --no-ff` (preserves branch history)

- ✅ **Allow squash merging**
  - Default: checked
  - Use: Cleans up many small commits

- ✅ **Allow rebase and merge**
  - Default: checked
  - Use: Linear history

**Recommendation for this project**:
- ✅ Allow merge commits (for dev merges)
- ✅ Allow squash merging (for feature PRs to keep history clean)
- ✅ Allow rebase and merge (for hotfixes)

## 🚨 Overriding Protection Rules

### Emergency Bypass (Admins Only)

In rare cases, admin can bypass protection rules:

**Note**: This should be exceptional and logged. Try to avoid.

1. Go to PR
2. Click **Settings** on PR
3. An admin can bypass if they have permissions
4. Better approach: Create emergency hotfix PR, get quick review

### Dismissing Stale Reviews

If code changes significantly after approval:

1. New commits automatically dismiss old approvals
2. New review required
3. This is enabled in main branch protection

## ✅ Verification Checklist

After setting up branch protection:

- [ ] Try to push directly to main → Should fail
- [ ] Try to merge PR without approval → Should fail
- [ ] Try to merge PR when CI fails → Should fail
- [ ] Successful PR merges work normally
- [ ] Force push to main is blocked
- [ ] Deleting main branch is blocked

**Test Workflow**:
```bash
# This should fail
git push origin main --force

# Output should be:
# remote: error: protected branch hook declined

# Create PR instead
git checkout -b feature/test
git commit --allow-empty -m "test: verify branch protection"
git push -u origin feature/test
# Go to GitHub, create PR, should require approval
```

## 📧 Notifications

Configure how you're notified:

1. Go to GitHub Settings → Notifications
2. Watch the repository
3. Get notified for:
   - PR reviews
   - PR approvals
   - Status checks
   - Comments
   - Pull requests assigned to you

## 🔍 Monitoring

### View Protected Branches

**Settings** → **Branches** → Shows:
- Active protection rules
- Recent merges
- Branch activity

### View Branch Activity

```bash
# See all branches and their status
git branch -v

# See remote branches
git branch -r

# See merge commits
git log --oneline --graph --decorate --all
```

## 🛠️ Troubleshooting

### "This branch has 1 failing status check"

**Solution**:
- Check GitHub Actions logs
- Fix the failing job (usually npm install or build issue)
- Push fix commit
- CI will re-run automatically

### "This branch is out of date with the base branch"

**Solution**:
```bash
git checkout your-feature-branch
git pull origin main
# Resolve conflicts if any
git push origin your-feature-branch
```

### "Required status checks are failing"

**Solution**:
1. Click "Show all checks" to see which check failed
2. Click job name to see detailed log
3. Fix issue locally
4. Push fix
5. CI re-runs automatically

### Cannot merge despite all checks passing

**Possible causes**:
- Review required but not approved yet
- Conversation has unresolved comments
- Branch is not up to date
- Code owners have not reviewed

**Solution**: Check the PR page for red X icons and specific reasons.

## 🎯 Best Practices for Branch Protection

1. ✅ **Always use PR workflow** - Don't bypass protection
2. ✅ **Keep PRs focused** - One feature per PR
3. ✅ **Write clear descriptions** - Help reviewers understand
4. ✅ **Respond to feedback quickly** - Don't let PRs stale
5. ✅ **Run tests locally first** - Avoid CI failures
6. ✅ **Keep up with main** - Merge/rebase main regularly
7. ✅ **Use meaningful commit messages** - Helps reviewers
8. ✅ **Delete feature branches after merge** - Keep repo clean
9. ✅ **Don't ignore CI failures** - They indicate real issues
10. ✅ **Request review when ready** - Don't wait for notification

## 📚 Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Code Owners Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Status Checks Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories/about-status-checks)

## 🎉 Next Steps

1. ✅ Apply `main` branch protection rules
2. ✅ Apply `dev` branch protection rules
3. ✅ Create `.github/CODEOWNERS` file
4. ✅ Test the protection by attempting direct push to main
5. ✅ Verify PR workflow works correctly
6. ✅ Document team review standards
7. ✅ Train team on git workflow

---

**Last Updated**: November 19, 2025
**Status**: Ready for Implementation

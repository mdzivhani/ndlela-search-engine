# Git Workflow Command Reference

Quick copy-paste commands for common git operations.

## 🚀 Initial Setup

```bash
# Clone repository
git clone https://github.com/mdzivhani/ndlela-search-engine.git
cd ndlela-search-engine

# Configure local git (first time)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Verify configuration
git config --list

# Get dev branch
git fetch origin dev
git checkout dev

# Verify you're on dev
git branch
# Should show * dev
```

## 📝 Daily Work - Create Feature Branch

```bash
# Start from clean dev
git checkout dev
git pull origin dev

# Create feature branch from dev
git checkout -b feature/your-feature-name

# Verify branch created
git branch
git log --oneline -3
```

## 💾 Save Your Work

```bash
# Check status
git status

# Stage all changes
git add .

# Stage specific files
git add src/pages/Search.tsx src/styles.css

# See what will be committed
git diff --cached

# Commit with conventional message
git commit -m "feat(search): Add filter button"

# Or with longer message
git commit -m "feat(search): Add filter button

This adds a new filter button to the search page
allowing users to filter results by category.

- Add FilterButton component
- Add filter state management
- Add filter API call"

# View commits
git log --oneline -5
```

## 🌍 Share Your Work

```bash
# Push feature branch
git push -u origin feature/your-feature-name

# Push again after more commits
git push origin feature/your-feature-name

# Verify it's on GitHub
git branch -r | grep feature/your-feature-name
```

## 🔄 Get Latest Changes

```bash
# Update dev with latest from GitHub
git checkout dev
git pull origin dev

# Update your feature branch with latest dev
git checkout feature/your-feature-name
git pull origin dev
# Or merge
git merge dev
# Fix conflicts if any
git add .
git commit -m "Merge dev into feature branch"
git push origin feature/your-feature-name
```

## 📋 Create Pull Request

```bash
# After pushing your feature branch:
# 1. Go to GitHub
# 2. Click "Compare & pull request"
# 3. Base: dev
# 4. Compare: feature/your-feature-name
# 5. Add title and description
# 6. Click "Create Pull Request"

# Command to view PR link (if using gh CLI)
gh pr create --base dev --title "feat: your title"
```

## ✅ Merge PR (After Approval)

```bash
# Option 1: Merge via GitHub UI (easiest)
# On GitHub PR page → Click "Merge pull request"

# Option 2: Merge locally
git checkout dev
git pull origin dev
git merge --no-ff feature/your-feature-name
git push origin dev
```

## 🧹 Cleanup After Merge

```bash
# Delete local feature branch
git branch -d feature/your-feature-name

# Delete remote feature branch
git push origin --delete feature/your-feature-name

# Or combine both
git push origin --delete feature/your-feature-name && git branch -d feature/your-feature-name

# Verify cleanup
git branch -a
```

## 📊 View History

```bash
# Recent commits
git log --oneline -10

# Commits with graph
git log --graph --oneline --all

# Commits by author
git log --author="Your Name" --oneline

# Commits on feature branch only
git log dev..feature/your-feature-name --oneline

# Commits since yesterday
git log --since="yesterday" --oneline

# Commits that modified a file
git log --oneline -- src/pages/Search.tsx
```

## 🔍 Compare Branches

```bash
# See diff between branches
git diff dev feature/your-feature-name

# See stat diff (files changed)
git diff --stat dev feature/your-feature-name

# See commits in dev not in feature
git log feature/your-feature-name..dev --oneline

# See commits in feature not in dev
git log dev..feature/your-feature-name --oneline
```

## 🆚 Compare Commits

```bash
# See changes in a commit
git show abc123def

# See changes in last commit
git show HEAD

# See changes between two commits
git diff abc123def xyz789

# See stat of changes between commits
git diff --stat abc123def xyz789
```

## ↩️ Undo Changes

```bash
# Undo changes to a file (not yet staged)
git restore src/pages/Search.tsx
# or
git checkout -- src/pages/Search.tsx

# Undo all changes (not yet staged)
git restore .

# Unstage a file
git restore --staged src/pages/Search.tsx
# or
git reset HEAD src/pages/Search.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Create new commit that undoes a previous commit
git revert abc123def
```

## 🚨 Fix Mistakes

```bash
# Accidentally committed on main? Create new branch
git checkout -b feature/oops
git checkout main
git reset --hard HEAD~1

# Accidentally pushed? (only if not merged)
git push origin feature/your-feature --force-with-lease

# Need to get a file from another branch
git checkout feature/other-branch -- src/utils.ts

# Stash changes temporarily
git stash
git stash pop

# Stash with description
git stash save "WIP: search filters"
git stash list
git stash pop stash@{0}
```

## 🔀 Resolve Conflicts

```bash
# When pulling/merging causes conflict:
git status  # See conflicted files

# Open conflicted file, look for:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> branch-name

# Edit file, keep what you want

# Mark as resolved
git add conflicted-file.ts

# Complete the merge
git commit -m "Merge: resolve conflicts"
git push origin feature/your-feature-name
```

## 🎯 Release to Main

```bash
# Ensure dev is stable
git checkout dev
git pull origin dev

# Create release PR on GitHub
# 1. Go to GitHub
# 2. Click "New pull request"
# 3. Base: main
# 4. Compare: dev
# 5. Title: "Release: v0.2.0"
# 6. Add changelog in description
# 7. Submit PR

# After approval and merge:
git checkout main
git pull origin main
git checkout dev
git pull origin dev

# Tag the release (optional)
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
```

## 🔥 Emergency Hotfix

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Make fix
git commit -m "fix: resolve critical bug"

# Push and create PR to main
git push -u origin hotfix/critical-issue

# After merge to main
# Also merge to dev:
git checkout dev
git pull origin dev
git merge main
git push origin dev

# Cleanup
git branch -d hotfix/critical-issue
git push origin --delete hotfix/critical-issue
```

## 📦 Working with Remotes

```bash
# See remote URLs
git remote -v

# Add new remote
git remote add upstream https://github.com/other-user/repo.git

# Fetch from specific remote
git fetch upstream

# Push to specific remote
git push upstream dev

# Pull from upstream
git pull upstream dev

# Update tracking
git branch -u origin/feature-branch feature-branch
```

## 🔧 Configuration

```bash
# Set default branch for push
git config --global push.default current

# Set merge strategy
git config --global pull.rebase false

# Enable color output
git config --global color.ui true

# Set editor for commit messages
git config --global core.editor "code --wait"

# View all settings
git config --list
```

## 🌳 Advanced Branch Operations

```bash
# List branches with last commit
git branch -v

# List branches that contain commit
git branch --contains abc123def

# Delete merged branches
git branch -d feature/old-feature

# Force delete unmerged branch
git branch -D feature/unwanted

# Rename branch
git branch -m old-name new-name

# Rename and push
git push origin -u new-name
git push origin --delete old-name
```

## 📈 Analytics

```bash
# Commits per author
git shortlog -sn

# Commits over time
git log --oneline --graph --decorate --all

# Files changed in last 10 commits
git log --name-only --oneline -10

# Most changed files
git log --name-only --pretty=format: | sort | uniq -c | sort -rn
```

## ✨ Useful Aliases

Add to `.gitconfig`:
```
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = restore --staged
    last = log -1 HEAD
    visual = log --graph --oneline --all
    undo = reset --soft HEAD~1
```

Then use:
```bash
git st              # git status
git co dev          # git checkout dev
git br -a           # git branch -a
git ci -m "msg"     # git commit
git unstage file    # unstage file
git last            # show last commit
git visual          # show graph
git undo            # undo last commit
```

## 🎓 Learning Resources

```bash
# Built-in help
git help                    # General help
git help workflow           # Workflow help
git help push              # Push help

# Specific command help
git commit --help
git merge --help
git rebase --help
```

## 📋 Pre-Push Checklist

Before pushing, verify:

```bash
# 1. Changes are ready
git status

# 2. All tests pass
npm run test           # Frontend
dotnet test           # Backend

# 3. Build works
npm run build         # Frontend
dotnet build          # Backend

# 4. No TypeScript errors
npx tsc --noEmit

# 5. Good commit messages
git log --oneline -5

# 6. Branch is up to date
git pull origin dev

# 7. Ready to push
git push origin feature/your-feature-name
```

---

**Tip**: Save this file locally as a quick reference:
```bash
git clone https://github.com/mdzivhani/ndlela-search-engine.git
# Open this file: GIT_COMMAND_REFERENCE.md
```

**Last Updated**: November 19, 2025

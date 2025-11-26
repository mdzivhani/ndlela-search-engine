#!/bin/bash

# Git Branch Status Display Script
# Shows current branch, status, and helpful information

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}=========================================="
echo "Git Branch Status"
echo -e "==========================================${NC}"
echo ""

# Get current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)

if [ -z "$CURRENT_BRANCH" ]; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Get repository info
REPO_NAME=$(basename $(git rev-parse --show-toplevel) 2>/dev/null)
REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null)

echo -e "${CYAN}Repository:${NC} $REPO_NAME"
echo -e "${CYAN}Remote:${NC} $REMOTE_URL"
echo ""

# Display current branch with emphasis
echo -e "${GREEN}📍 Current Branch:${NC}"
echo -e "   ${YELLOW}► $CURRENT_BRANCH${NC}"
echo ""

# Get default branch
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')
if [ -n "$DEFAULT_BRANCH" ]; then
    echo -e "${CYAN}Default Branch:${NC} $DEFAULT_BRANCH"
fi

# Show branch tracking info
UPSTREAM=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null)
if [ -n "$UPSTREAM" ]; then
    echo -e "${CYAN}Tracking:${NC} $UPSTREAM"
    
    # Check if ahead/behind
    LOCAL=$(git rev-parse @ 2>/dev/null)
    REMOTE=$(git rev-parse @{u} 2>/dev/null)
    BASE=$(git merge-base @ @{u} 2>/dev/null)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        echo -e "${GREEN}✓ Up to date with remote${NC}"
    elif [ "$LOCAL" = "$BASE" ]; then
        BEHIND=$(git rev-list --count HEAD..@{u} 2>/dev/null)
        echo -e "${YELLOW}⚠ Behind by $BEHIND commit(s)${NC}"
    elif [ "$REMOTE" = "$BASE" ]; then
        AHEAD=$(git rev-list --count @{u}..HEAD 2>/dev/null)
        echo -e "${YELLOW}⚠ Ahead by $AHEAD commit(s)${NC}"
    else
        AHEAD=$(git rev-list --count @{u}..HEAD 2>/dev/null)
        BEHIND=$(git rev-list --count HEAD..@{u} 2>/dev/null)
        echo -e "${YELLOW}⚠ Diverged: $AHEAD ahead, $BEHIND behind${NC}"
    fi
fi

echo ""

# Show all branches
echo -e "${CYAN}All Branches:${NC}"
git branch -a | while read branch; do
    if [[ "$branch" == *"$CURRENT_BRANCH"* ]]; then
        echo -e "   ${GREEN}$branch${NC}"
    else
        echo "   $branch"
    fi
done

echo ""

# Show git status summary
echo -e "${CYAN}Working Directory Status:${NC}"

# Check for changes
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "   ${GREEN}✓ Clean (no changes)${NC}"
else
    # Show modified files
    MODIFIED=$(git diff --name-only 2>/dev/null | wc -l)
    STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l)
    UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l)
    
    [ $MODIFIED -gt 0 ] && echo -e "   ${YELLOW}⚠ Modified: $MODIFIED file(s)${NC}"
    [ $STAGED -gt 0 ] && echo -e "   ${GREEN}✓ Staged: $STAGED file(s)${NC}"
    [ $UNTRACKED -gt 0 ] && echo -e "   ${MAGENTA}? Untracked: $UNTRACKED file(s)${NC}"
fi

echo ""

# Show recent commits
echo -e "${CYAN}Recent Commits:${NC}"
git log --oneline --decorate --color -5 2>/dev/null | sed 's/^/   /'

echo ""

# Show helpful commands
echo -e "${BLUE}=========================================="
echo "Quick Commands"
echo -e "==========================================${NC}"
echo -e "Switch branch:  ${YELLOW}git checkout <branch-name>${NC}"
echo -e "Pull updates:   ${YELLOW}git pull origin $CURRENT_BRANCH${NC}"
echo -e "Push changes:   ${YELLOW}git push origin $CURRENT_BRANCH${NC}"
echo -e "View status:    ${YELLOW}git status${NC}"
echo ""

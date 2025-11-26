#!/bin/bash

# Git Prompt Setup Script
# This script adds git branch information to your bash prompt

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================="
echo "Git Branch Prompt Setup"
echo -e "==========================================${NC}"
echo ""

# Backup existing .bashrc
if [ -f ~/.bashrc ]; then
    cp ~/.bashrc ~/.bashrc.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✓ Backed up existing .bashrc${NC}"
fi

# Check if git prompt is already configured
if grep -q "parse_git_branch" ~/.bashrc 2>/dev/null; then
    echo -e "${YELLOW}Git prompt already configured in .bashrc${NC}"
    read -p "Do you want to reconfigure it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping configuration..."
        exit 0
    fi
    # Remove old configuration
    sed -i '/# Git branch in prompt/,/^$/d' ~/.bashrc
fi

# Add git branch function and prompt configuration
cat >> ~/.bashrc << 'EOF'

# Git branch in prompt - added by setup-git-prompt.sh
parse_git_branch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}

# Color codes
COLOR_RESET='\[\033[0m\]'
COLOR_USER='\[\033[01;32m\]'
COLOR_PATH='\[\033[01;34m\]'
COLOR_GIT='\[\033[01;33m\]'
COLOR_PROMPT='\[\033[00m\]'

# Set the prompt with git branch
PS1="${COLOR_USER}\u@\h${COLOR_RESET}:${COLOR_PATH}\w${COLOR_RESET} ${COLOR_GIT}\$(parse_git_branch)${COLOR_RESET}${COLOR_PROMPT}\$ "

EOF

echo -e "${GREEN}✓ Git prompt configuration added to .bashrc${NC}"
echo ""

echo -e "${YELLOW}The prompt will now show:${NC}"
echo -e "  ${GREEN}user@host${NC}:${BLUE}/path/to/directory${NC} ${YELLOW}(branch-name)${NC}\$"
echo ""

echo -e "${BLUE}To activate the changes:${NC}"
echo -e "  Run: ${YELLOW}source ~/.bashrc${NC}"
echo -e "  Or: Open a new terminal session"
echo ""

# Offer to activate now
read -p "Do you want to activate it now? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    source ~/.bashrc
    echo -e "${GREEN}✓ Changes activated!${NC}"
    echo ""
    echo -e "${BLUE}Your prompt should now show the git branch.${NC}"
else
    echo -e "${YELLOW}Remember to run 'source ~/.bashrc' to activate the changes.${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "Setup Complete!"
echo -e "==========================================${NC}"
echo ""

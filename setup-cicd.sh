#!/bin/bash

# CI/CD Setup Helper Script
# This script helps you set up GitHub Actions for automatic deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================="
echo "CI/CD Setup for Ndlela Search Engine"
echo -e "==========================================${NC}"
echo ""

# Check if we're on the server
CURRENT_USER=$(whoami)
CURRENT_HOST=$(hostname)

echo "Current user: $CURRENT_USER"
echo "Current host: $CURRENT_HOST"
echo ""

# Step 1: Generate SSH key
echo -e "${YELLOW}Step 1: Generating SSH Key for GitHub Actions${NC}"
echo ""

SSH_KEY_PATH="$HOME/.ssh/github_deploy_key"

if [ -f "$SSH_KEY_PATH" ]; then
    echo -e "${YELLOW}SSH key already exists at $SSH_KEY_PATH${NC}"
    read -p "Do you want to regenerate it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Using existing key..."
    else
        rm -f "$SSH_KEY_PATH" "$SSH_KEY_PATH.pub"
        ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$SSH_KEY_PATH" -N ""
        echo -e "${GREEN}✓ New SSH key generated${NC}"
    fi
else
    ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$SSH_KEY_PATH" -N ""
    echo -e "${GREEN}✓ SSH key generated${NC}"
fi

echo ""

# Step 2: Add public key to authorized_keys
echo -e "${YELLOW}Step 2: Adding Public Key to Authorized Keys${NC}"
echo ""

mkdir -p "$HOME/.ssh"
touch "$HOME/.ssh/authorized_keys"
chmod 700 "$HOME/.ssh"
chmod 600 "$HOME/.ssh/authorized_keys"

PUBLIC_KEY=$(cat "$SSH_KEY_PATH.pub")

if grep -q "$PUBLIC_KEY" "$HOME/.ssh/authorized_keys"; then
    echo -e "${GREEN}✓ Public key already in authorized_keys${NC}"
else
    cat "$SSH_KEY_PATH.pub" >> "$HOME/.ssh/authorized_keys"
    echo -e "${GREEN}✓ Public key added to authorized_keys${NC}"
fi

echo ""

# Step 3: Test SSH connection
echo -e "${YELLOW}Step 3: Testing SSH Connection${NC}"
echo ""

if ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no $CURRENT_USER@localhost "echo 'Connection successful'" 2>/dev/null; then
    echo -e "${GREEN}✓ SSH connection test successful${NC}"
else
    echo -e "${RED}✗ SSH connection test failed${NC}"
    echo "This might be normal if sshd is not configured to allow key authentication"
fi

echo ""

# Step 4: Display instructions
echo -e "${BLUE}=========================================="
echo "Setup Complete!"
echo -e "==========================================${NC}"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo ""

echo -e "${BLUE}1. Add SSH Private Key to GitHub Secrets:${NC}"
echo ""
echo "   a. Go to: https://github.com/YOUR_USERNAME/ndlela-search-engine/settings/secrets/actions"
echo "      (Replace YOUR_USERNAME with your GitHub username)"
echo "   b. Click 'New repository secret'"
echo "   c. Name: SSH_PRIVATE_KEY"
echo "   d. Value: Copy and paste the ENTIRE private key below"
echo ""
echo -e "${YELLOW}================== PRIVATE KEY (COPY THIS) ==================${NC}"
cat "$SSH_KEY_PATH"
echo -e "${YELLOW}=============================================================${NC}"
echo ""

echo -e "${BLUE}2. Verify GitHub Settings:${NC}"
echo ""
echo "   a. Go to: https://github.com/YOUR_USERNAME/ndlela-search-engine/settings/actions"
echo "      (Replace YOUR_USERNAME with your GitHub username)"
echo "   b. Under 'Actions permissions':"
echo "      - Select: 'Allow all actions and reusable workflows'"
echo "   c. Under 'Workflow permissions':"
echo "      - Select: 'Read and write permissions'"
echo "   d. Click 'Save'"
echo ""

echo -e "${BLUE}3. Create Production Environment (Recommended):${NC}"
echo ""
echo "   a. Go to: https://github.com/YOUR_USERNAME/ndlela-search-engine/settings/environments"
echo "      (Replace YOUR_USERNAME with your GitHub username)"
echo "   b. Click 'New environment'"
echo "   c. Name: production"
echo "   d. Add protection rules (optional)"
echo "   e. Click 'Save'"
echo ""

echo -e "${BLUE}4. Test the Workflow:${NC}"
echo ""
echo "   a. Make a small change in a feature branch"
echo "   b. Create PR to dev branch"
echo "   c. Merge to dev"
echo "   d. Create PR from dev to main"
echo "   e. Merge to main"
echo "   f. Watch the automatic deployment!"
echo ""

echo -e "${GREEN}=========================================="
echo "Public Key (for reference):"
echo -e "==========================================${NC}"
cat "$SSH_KEY_PATH.pub"
echo ""

echo -e "${YELLOW}=========================================="
echo "Important Files Created:"
echo -e "==========================================${NC}"
echo "Private key: $SSH_KEY_PATH"
echo "Public key: $SSH_KEY_PATH.pub"
echo ""

echo -e "${RED}⚠️  SECURITY WARNING:${NC}"
echo "   - Never commit the private key to Git"
echo "   - Keep the private key secure"
echo "   - Only add it to GitHub Secrets"
echo ""

echo -e "${GREEN}Setup script completed!${NC}"
echo ""
echo "For detailed instructions, see: CI_CD_SETUP.md"
echo ""

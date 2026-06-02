---
name: deploy
description: Guide for deploying to production - PR merge and verification. Use when ready to ship changes.
---

# Deploy to Production

This skill guides you through deploying changes to production safely.

## When to Use This Skill

Use this skill when the user:

- Says "deploy", "ship it", "push to production"
- Has a PR ready to merge
- Needs to verify a production deployment

## Pre-Deployment Checklist

Before deploying, verify:

1. **PR is approved** (if code review is required)
2. **All checks pass** (linting, build)
3. **Feature tested locally**
4. **No uncommitted changes** on the branch

## Deployment Architecture

- **Frontend:** Deploys to **Netlify** (auto-deploys on merge to main)
- **Backend API:** Hosted on **Railway** (managed separately)

## Step 1: Verify Quality

```bash
# Run final checks
npm run lint
npm run build
```

## Step 2: Merge PR

### Via GitHub CLI

```bash
# Check PR status
gh pr status

# Merge (if approved and checks pass)
gh pr merge <pr-number> --squash --delete-branch
```

## Step 3: Verify on Production

Netlify auto-deploys when changes are merged to `main`.

1. **Wait for Netlify deploy** to complete (check Netlify dashboard or GitHub status checks)
2. **Open production site** (e.g., `https://stellar-sable-e92fce.netlify.app/`)
3. **Test the new feature** — go through the happy path
4. **Check browser console** — look for errors
5. **Test related features** — quick smoke test

### If something is wrong

**Code issue:**

```bash
# Revert the merge commit
git checkout main
git revert HEAD
git push origin main
```

This will trigger a new Netlify deploy with the reverted changes.

**Backend API issue:**

- Backend is on Railway — coordinate with the backend team
- Check Railway logs for errors

## Step 4: Clean Up

```bash
# Update local main
git checkout main
git pull origin main

# Delete local feature branch
git branch -d <branch-name>
```

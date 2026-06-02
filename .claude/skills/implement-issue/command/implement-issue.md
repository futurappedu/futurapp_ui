---
description: Implement a GitHub issue end-to-end with automatic PR creation.
---

# Implement Issue Command

## Workflow

### Step 1: Parse Issue Reference

Accept formats: `123`, `#123`, or full GitHub URL.

Extract the issue number.

### Step 2: Fetch Issue Details

```bash
gh issue view <number> --json title,body,labels,number,state
```

### Step 3: Analyze Requirements

From the issue, identify:

- Issue type (bug fix, feature, refactor, docs)
- Affected area (pages, components, admin, tests, services, hooks)
- Scope (small, medium, large)
- Key requirements and acceptance criteria
- Any linked issues or dependencies

### Step 4: Create Feature Branch (BEFORE any code changes)

**CRITICAL: Always create and switch to a dedicated branch BEFORE making any code changes.**

```bash
# 1. Stash any uncommitted changes on the current branch
git stash --include-untracked

# 2. Start from latest main
git checkout main
git pull origin main

# 3. Create the dedicated issue branch
git checkout -b <type>/<short-description>
```

Branch naming by issue type:

- `feat/` for features and enhancements
- `fix/` for bugs
- `refactor/` for refactoring
- `docs/` for documentation

**Example:** For issue #12 (test timer bug): `fix/test-timer-autosubmit`

After creating the branch, verify you're on it:

```bash
git branch --show-current
```

### Step 5: Explore Codebase

Use Task tool with Explore agent to understand:

- Existing patterns for similar features
- Files that will need modification
- Related components and utilities

### Step 6: Create Implementation Plan

Present to user:

- Files to create/modify
- Architectural decisions
- Any questions or clarifications needed

### Step 7: Get User Approval

Use AskUserQuestion to confirm the plan before implementing.

### Step 8: Verify Branch Before Implementing

**Before writing ANY code, confirm you are on the correct branch:**

```bash
git branch --show-current
```

### Step 9: Implement Solution

Follow all coding standards:

- Use existing patterns from codebase
- Handle loading and error states
- Use proper TypeScript types
- Use `@/*` import alias

### Step 10: Run Pre-PR Checks

```bash
npm run lint
npm run build
```

Fix any issues before proceeding.

### Step 11: Stage and Commit

Stage specific files (never use `git add -A`):

```bash
git add src/pages/TestHome.tsx src/components/TestTimer.tsx
```

Commit with proper message:

```bash
git commit -m "$(cat <<'EOF'
feat(pages): redesign test home dashboard

Implements the new test hub layout with progress tracking
and improved navigation between aptitude tests.

Fixes #<number>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Step 12: Push and Create PR

```bash
git push -u origin <branch-name>

gh pr create --title "feat(scope): description" --body "$(cat <<'EOF'
## Summary
- Change 1
- Change 2

Fixes #<issue-number>

## Test Plan
- [ ] Manual testing completed
- [ ] Build passes

## Checklist
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Self-review completed
EOF
)"
```

### Step 13: Open in Browser

```bash
open <pr-url>
```

## Error Recovery

### Check Failures After Commit

1. **DO NOT amend** — the commit happened, but checks failed
2. Fix the issues
3. Stage the fixes
4. Create a **NEW commit** with the fixes
5. Re-run checks

### Merge Conflicts

1. Fetch latest from main: `git fetch origin main`
2. Rebase: `git rebase origin/main`
3. Resolve conflicts
4. Continue rebase: `git rebase --continue`
5. Force push (only your branch): `git push --force-with-lease`

### Wrong Branch

If you realize changes were made on the wrong branch:

1. Stage all changes: `git stash --include-untracked`
2. Create/switch to the correct branch: `git checkout -b <correct-branch> origin/main`
3. Apply stashed changes: `git stash pop`
4. Continue from Step 11

<user-request>
$ARGUMENTS
</user-request>

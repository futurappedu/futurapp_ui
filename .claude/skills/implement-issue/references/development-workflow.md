# Development Workflow Reference

This is a quick reference for the most common operations.

## Quick Commands

### Starting Work (ALWAYS do this first)

```bash
# 1. Stash any uncommitted changes
git stash --include-untracked

# 2. Start from latest main
git checkout main
git pull origin main

# 3. Create dedicated issue branch
git checkout -b feat/<description>

# 4. Verify you're on the correct branch
git branch --show-current
```

**CRITICAL:** Always create the branch BEFORE making any code changes.

### During Development

```bash
# Start dev server
npm run dev

# Verify you're still on the correct branch
git branch --show-current

# Run validation (before committing)
npm run lint && npm run build
```

### Committing

```bash
# Stage specific files (never use git add -A)
git add src/pages/TestHome.tsx

# Commit with conventional format
git commit -m "feat(pages): description

Fixes #123

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

### Creating PR

```bash
# Push branch
git push -u origin <branch-name>

# Create PR
gh pr create --title "feat(scope): description" --body "..."
```

## Branch Naming

- `feat/test-home-redesign` — New feature
- `fix/timer-autosubmit` — Bug fix
- `refactor/admin-components` — Code restructure

## Commit Types

| Type       | Use For             |
| ---------- | ------------------- |
| `feat`     | New feature         |
| `fix`      | Bug fix             |
| `refactor` | Code restructure    |
| `docs`     | Documentation       |
| `test`     | Tests               |
| `chore`    | Build, deps, config |

## Scopes

`pages`, `components`, `admin`, `tests`, `hooks`, `services`, `config`, `ui`, `auth`

## Code Organization

| Change Type       | Location                        |
| ----------------- | ------------------------------- |
| Page              | `src/pages/`                    |
| Test page         | `src/pages/tests/`             |
| UI component      | `src/components/ui/`           |
| Admin component   | `src/components/admin/`        |
| Auth component    | `src/components/auth/`         |
| Custom hook       | `src/hooks/`                   |
| API service       | `src/services/`                |
| API config        | `src/config/`                  |
| Utility function  | `src/utils/` or `src/lib/`     |
| Test question data| `src/data/`                    |

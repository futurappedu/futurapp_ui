# Git Rules

## Core Principles

- **NEVER** use `--no-verify` in commits or pushes
- **NEVER** use `git add -A` or `git add .` — stage specific files
- **NEVER** amend commits after a hook failure — create a new commit
- After creating a PR, open it in browser: `open <url>`

## Branch Naming

Format: `type/description`

```
feat/order-form
fix/scholarship-filter
refactor/test-timer
docs/update-readme
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

## Commit Messages

Use Conventional Commits format:

```
type(scope): short description

Optional longer body explaining the why.

Fixes #123

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Commit Types

| Type       | Use For                               |
| ---------- | ------------------------------------- |
| `feat`     | New feature                           |
| `fix`      | Bug fix                               |
| `refactor` | Code restructure (no behavior change) |
| `docs`     | Documentation only                    |
| `test`     | Adding or updating tests              |
| `chore`    | Build, config, dependencies           |

### Scopes (based on project areas)

`pages`, `components`, `admin`, `tests`, `hooks`, `services`, `config`, `ui`, `auth`

## Creating Commits

```bash
# Stage specific files
git add src/pages/TestHome.tsx src/components/TestTimer.tsx

# Commit with heredoc for proper formatting
git commit -m "$(cat <<'EOF'
feat(pages): add redesigned test home dashboard

Implements the new test hub layout with progress tracking
and improved navigation between aptitude tests.

Fixes #42

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

## Creating Pull Requests

```bash
# Push with upstream tracking
git push -u origin feat/test-home-redesign

# Create PR with heredoc body
gh pr create --title "feat(pages): redesign test home dashboard" --body "$(cat <<'EOF'
## Summary
- Change 1
- Change 2

Fixes #123

## Test Plan
- [ ] Manual testing completed
- [ ] Build passes

## Checklist
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Self-review completed
EOF
)"

# Open in browser
open <pr-url>
```

## After Hook Failures

1. **DO NOT amend** — the commit didn't happen
2. Fix the issue
3. Stage the fixes
4. Create a **new commit**
5. Re-run checks

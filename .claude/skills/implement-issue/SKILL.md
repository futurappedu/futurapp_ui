---
name: implement-issue
description: End-to-end implementation of GitHub issues. Pulls latest main, creates a branch, implements the changes. User validates locally before manually creating a PR.
---

# Implement Issue

This skill provides end-to-end implementation of GitHub issues, from understanding requirements to a ready-to-review local branch. The user validates locally and creates the PR manually.

## When to Use This Skill

Use this skill when the user:

- Says "implement issue #123" or "work on #123"
- Wants to fix a bug or build a feature from an issue
- Says "fix issue" or "build feature" referencing an issue number

## Implementation Workflow

### Step 1 — Sync with main

Always start by pulling the latest changes from `main` and creating a new branch on top of it:

```bash
git checkout main
git pull origin main
git checkout -b type/description
```

Branch naming follows the convention in git rules: `feat/`, `fix/`, `refactor/`, etc.

### Step 2 — Implement

Make the required code changes following the coding standards below.

### Step 3 — Verify

```bash
npm run lint
npm run build
```

### Step 4 — Commit

Stage specific files (never `git add -A`) and commit using Conventional Commits format.

> **Stop here.** Do not create a pull request. The user will validate the changes locally and create the PR manually.

## Codebase Knowledge

### Tech Stack

- **Frontend:** Vite + React 18 + TypeScript + Tailwind CSS 3 + Shadcn UI
- **Authentication:** Auth0 (`@auth0/auth0-react`)
- **Backend API:** Custom REST API on Railway
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **PDF Export:** @react-pdf/renderer

### Key Directories

```
src/
├── pages/           # Route page components
│   └── tests/       # Aptitude test pages
├── components/      # Reusable React components
│   ├── ui/          # Shadcn UI components
│   ├── admin/       # Admin-specific components
│   └── auth/        # Auth components
├── hooks/           # Custom React hooks
├── services/        # API client (adminApi.ts)
├── config/          # API configuration
├── lib/             # Utilities (cn helper)
├── utils/           # Answer persistence
└── data/            # Test question JSON files
```

## Coding Standards

### Must Follow

- Use `@/*` path alias for imports
- Handle loading and error states in all data-fetching components
- Use `useAuth0()` for authentication
- Handle API errors with user-friendly messages (Sonner toasts)

### Never Do

- Use `// eslint-disable` or `@ts-ignore` comments
- Use `as any` type casting
- Use `git add -A` or `git add .`
- Use `--no-verify` in git commands
- Amend commits after hook failures

## Pre-Commit Checklist

```bash
# 1. Linting
npm run lint

# 2. Build (includes TypeScript compilation)
npm run build
```

## Common Patterns

### New Page

1. Create page component in `src/pages/`
2. Add route in `src/main.tsx`
3. Wrap with `ProtectedRoute` or `AdminRoute` if needed

### New Admin Feature

1. Create component in `src/components/admin/`
2. Add tab or section in `src/pages/Admin.tsx`
3. Add API functions in `src/services/adminApi.ts`

### New Test Page

1. Create test component in `src/pages/tests/`
2. Add question data in `src/data/`
3. Add route in `src/main.tsx`
4. Use `useTestTimer` hook for countdown

---
allowed-tools: Bash, Read, Glob, Grep, AskUserQuestion, Write, Edit
description: Start a development session - checks env, installs deps, finds issues
---

# Start Development Session

Run through each section in order. If any check fails, help the user fix it before continuing.

## 1. Check Prerequisites

### Node.js

Check version:
!`node --version 2>/dev/null || echo "Node.js: NOT INSTALLED"`

**Requirements:**

- Node.js >= 20

### Node modules

Check if `node_modules` exists:
!`[ -d node_modules ] && echo "node_modules: installed" || echo "node_modules: NOT INSTALLED"`

**If missing:** Run `npm install`

## 2. Check Environment Configuration

### Environment file

Check for required env file:
!`[ -f .env ] && echo ".env: exists" || echo ".env: MISSING"`

**If `.env` is missing:**

1. Create `.env` with the required variable:
   - `VITE_AUTH0_RETURN_URL` — the Auth0 redirect URL (e.g., `http://localhost:5173/` for local dev)

### Verify key variables

Check if key variables are set:
!`grep -q "VITE_AUTH0_RETURN_URL" .env 2>/dev/null && echo "VITE_AUTH0_RETURN_URL: set" || echo "VITE_AUTH0_RETURN_URL: MISSING"`

## 3. Check Git Status

Current branch and status:
!`git branch --show-current`
!`git status --short`

**If on `main` with uncommitted changes:** Consider creating a feature branch before making more changes.

## 4. Start the Dev Server

Once environment is ready, start the dev server:

```bash
npm run dev
```

Confirm it starts successfully on http://localhost:5173

## 5. Fetch Open Issues

Get the list of open issues from the repository:
!`gh issue list --state open --limit 10 --json number,title,labels --jq '.[] | "#\(.number) [\(.labels | map(.name) | join(", "))] \(.title)"' 2>/dev/null || echo "No issues found or gh CLI not authenticated"`

## 6. Present Options

Based on the issues above:

- Show the user a summary of available issues
- Use AskUserQuestion to let them pick which issue to work on, or start fresh
- If they pick an issue, fetch full details with `gh issue view <number>` and summarize what needs to be done

## 7. Get Ready to Code

Once an issue is selected (or starting fresh):

- If on `main`, suggest creating a feature branch:
  ```bash
  git checkout -b feat/<description>
  ```
- Remind them to run `npm run lint && npm run build` before committing

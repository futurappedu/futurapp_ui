---
name: create-issue
description: Interactive guide for creating well-formatted GitHub issues. Use when users want to report bugs, request features, or file issues.
---

# Create Issue

This skill provides an interactive workflow for creating high-quality GitHub issues with proper labels and formatting.

## When to Use This Skill

Use this skill when the user:

- Wants to report a bug
- Has a feature request
- Wants to file an issue
- Says "create issue", "report bug", "file issue", "new ticket"

## Issue Structure

### Title Format

Use area-prefixed style:

```
[area]: Brief description

Examples:
- [tests]: Timer not auto-submitting when time expires
- [admin]: Bulk import fails on large CSV files
- [scholarships]: Filter not clearing when changing country
- [auth]: Login redirect loop on certain browsers
- [recommender]: Career recommendations not loading scores
```

### Required Sections by Type

**Bug Reports:**

- Description
- Reproduction Steps
- Expected vs Actual Behavior
- Environment (browser, OS if relevant)
- Screenshots/Logs if available

**Feature Requests:**

- Problem Statement (what pain point this solves)
- Proposed Solution
- User Story ("As a [role], I want [feature] so that [benefit]")
- Alternatives Considered

## Project Labels

### Area Labels

`tests`, `admin`, `scholarships`, `recommender`, `auth`, `profile`, `ui`, `api`

### Type Labels

- `bug` — Something broken
- `enhancement` — New feature
- `documentation` — Docs updates

### Priority Labels

- `High` — Critical issues
- `Medium` — Normal priority
- `Low` — Nice to have

### Category Labels

`aptitude-tests`, `personality-test`, `career-recommendations`, `scholarship-search`, `bulk-import`, `performance`, `security`

## GitHub CLI Integration

```bash
gh issue create \
  --title "[area]: description" \
  --body "..." \
  --label "label1,label2"
```

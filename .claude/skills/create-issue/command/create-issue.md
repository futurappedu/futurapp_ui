---
description: Create a well-formatted GitHub issue. Interactive guide for bug reports, feature requests, or feedback.
---

# Create Issue Command

## Workflow

### Step 1: Determine Issue Type

Use AskUserQuestion to identify:

- Bug Report
- Feature Request
- Documentation Update
- Technical Debt / Refactoring

### Step 2: Identify Area

Based on description, determine the affected area:

- `tests` — Aptitude tests (verbal, mechanical, numerical, spatial, abstract)
- `personality` — Personality test (RIASEC)
- `admin` — Admin dashboard, user management, bulk import
- `scholarships` — Scholarship & program search/filtering
- `recommender` — Career recommendations engine
- `auth` — Login, Auth0, route protection
- `profile` — User profile, test status tracking
- `ui` — General UI components, styling
- `api` — Backend API integration, services

### Step 3: Gather Information

**For bugs:**

1. What happened? (actual behavior)
2. What should have happened? (expected)
3. Steps to reproduce
4. Any error messages?

**For features:**

1. What problem does this solve?
2. Who benefits? (student, admin)
3. Proposed solution
4. Any alternatives considered?

### Step 4: Suggest Labels

Based on area and type, recommend labels from the available set:

- Type: `bug`, `enhancement`, `documentation`
- Priority: `High`, `Medium`, `Low`
- Area label
- Category labels as applicable

### Step 5: Format Title

Create area-prefixed title:

```
[area]: Brief, clear description
```

### Step 6: Format Body

Use the appropriate template based on issue type.

**Bug template:**

```markdown
## Description

[Clear description of the bug]

## Steps to Reproduce

1. Go to...
2. Click on...
3. Observe...

## Expected Behavior

[What should happen]

## Actual Behavior

[What actually happens]

## Environment

- Browser:
- OS:

## Additional Context

[Screenshots, error logs, etc.]
```

**Feature template:**

```markdown
## Problem Statement

[What pain point does this solve?]

## Proposed Solution

[How should it work?]

## User Story

As a [role], I want [feature] so that [benefit].

## Alternatives Considered

[Other approaches and why they were rejected]

## Additional Context

[Mockups, examples, references]
```

### Step 7: Preview and Confirm

Show the complete issue to user for approval before creating.

### Step 8: Create Issue

```bash
gh issue create \
  --title "[area]: description" \
  --body "$(cat <<'EOF'
[formatted body]
EOF
)" \
  --label "label1,label2"
```

### Step 9: Open in Browser

```bash
open <issue-url>
```

### Step 10: Confirm Completion

```
Issue #<number> created: [title]
URL: <url>
Labels: [labels]
```

## Error Handling

- **gh not authenticated:** Prompt `gh auth login`
- **Network error:** Check connection, retry
- **Invalid labels:** List available labels, let user pick
- **Missing repo:** Verify git remote is configured

<user-request>
$ARGUMENTS
</user-request>

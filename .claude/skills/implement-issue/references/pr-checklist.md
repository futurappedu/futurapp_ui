# Pull Request Checklist

## Before Creating PR

### Code Quality

- [ ] `npm run lint` passes
- [ ] No `// eslint-disable` comments added
- [ ] No `@ts-ignore` or `as any` added

### Build

- [ ] `npm run build` succeeds
- [ ] No new build warnings

### Functionality

- [ ] Feature works as described in issue
- [ ] Loading states handled
- [ ] Error states handled

### Security

- [ ] No secrets or credentials committed
- [ ] Input validation added where needed
- [ ] Auth checks in place for protected features

## PR Description Template

```markdown
## Summary

- Brief description of changes
- Key implementation decisions

Fixes #<issue-number>

## Changes

- [ ] Added/modified pages
- [ ] Added/modified components
- [ ] Added/modified services/hooks
- [ ] Updated routes

## Test Plan

- [ ] Manual testing: [describe what was tested]
- [ ] Build passes

## Screenshots (if UI changes)

[Attach screenshots or screen recordings]

## Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Self-review completed
```

## After PR is Created

- [ ] PR description is complete
- [ ] Correct labels applied
- [ ] Issue is linked
- [ ] Ready for review

## Review Response

When addressing review feedback:

1. **Make requested changes**
2. **Create new commit** (don't amend unless asked)
3. **Reply to each comment** explaining changes
4. **Re-request review** when ready

## Merge Criteria

PR can be merged when:

- [ ] All checks pass
- [ ] At least one approval received
- [ ] No unresolved conversations
- [ ] Branch is up to date with main

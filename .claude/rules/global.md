# Global Rules

## Communication Style

- Be direct and concise
- Explain technical decisions, not just code
- Use inline code references with `file:line` format
- Ask clarifying questions when requirements are ambiguous

## Autonomy Level

- Make small fixes and improvements without asking
- Ask before architectural changes or adding new dependencies
- Always explain the "why" behind non-obvious decisions

## Code Quality Standards

- No `// eslint-disable` or `@ts-ignore` comments without explicit approval
- Minimize type casting — prefer proper typing
- Keep functions under 50 lines when possible
- Prefer composition over inheritance

## Before Completing Any Task

1. Run `npm run lint` to check linting
2. Run `npm run build` to verify TypeScript compiles and Vite builds
3. Ensure no regressions in existing functionality

## Error Handling

- Always handle errors gracefully with user-friendly messages
- Use toast notifications (Sonner) for user-facing errors
- Log detailed errors to console for debugging
- Never expose internal error details to users

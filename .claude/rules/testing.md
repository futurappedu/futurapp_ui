# Testing Rules

## Current State

No testing framework is currently configured in this project. If tests are added in the future, follow the guidelines below.

## Recommended Setup

- **Vitest** for unit and integration tests
- **React Testing Library** for component tests

## Test File Location

Co-locate tests with source files:

```
src/
├── hooks/
│   ├── useTestTimer.ts
│   └── useTestTimer.test.ts
├── utils/
│   ├── answerPersistence.ts
│   └── answerPersistence.test.ts
├── components/
│   ├── TestTimer.tsx
│   └── TestTimer.test.tsx
```

## Test Structure (AAA Pattern)

```typescript
describe('useTestTimer', () => {
  it('should count down from the given duration', () => {
    // Arrange
    const duration = 1200; // 20 minutes in seconds

    // Act
    const result = renderHook(() => useTestTimer(duration));

    // Assert
    expect(result.current.timeRemaining).toBe(1200);
  });
});
```

## What to Test (When Tests Are Added)

### Should Test

- Custom hooks (`useTestTimer`)
- Utility functions (`answerPersistence`)
- Form validation logic (Zod schemas)
- Score calculation logic
- Admin API service functions

### Skip Testing

- Simple presentational components
- Third-party library wrappers (Shadcn UI components)
- Static data files (JSON question banks)

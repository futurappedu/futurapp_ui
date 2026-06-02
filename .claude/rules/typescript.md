# TypeScript Rules

## Strict Mode

Project uses strict TypeScript. Never bypass with:

- `// @ts-ignore`
- `// @ts-expect-error` (unless documenting expected error)
- `as any`

## Type Inference

Let TypeScript infer when obvious:

```typescript
// Good — type is inferred
const scores = await fetchTestScores();

// Unnecessary — adds noise
const scores: TestScores = await fetchTestScores();
```

## Explicit Types When Needed

```typescript
// Function parameters and return types
function calculateScore(answers: Answer[], correctAnswers: Answer[]): number {
  // ...
}

// Component props
interface TestTimerProps {
  duration: number;
  onTimeUp: () => void;
}
```

## Prefer Interfaces for Objects

```typescript
// Good
interface UserProfile {
  name: string;
  email: string;
  testsCompleted: string[];
}

// Use type for unions, primitives, mapped types
type TestType = 'verbal' | 'mechanical' | 'numerical' | 'spatial' | 'abstract' | 'personality';
```

## Avoid Type Assertions

```typescript
// Bad
const user = response.data as UserProfile;

// Good — validate at runtime
const user = userSchema.parse(response.data);
```

## Zod for Runtime Validation

```typescript
import { z } from 'zod';

const scholarshipFilterSchema = z.object({
  country: z.string().optional(),
  minPrice: z.number().min(0),
  maxPrice: z.number().max(100000),
  programType: z.string().optional(),
});

type ScholarshipFilter = z.infer<typeof scholarshipFilterSchema>;
```

## Null vs Undefined

- Use `null` for intentional absence (from API responses)
- Use `undefined` for optional properties
- Handle both in checks: `if (value == null)`

## Path Alias

Use `@/*` for imports within the project:

```typescript
import { useTestTimer } from '@/hooks/useTestTimer';
import { API_BASE_URL } from '@/config/api';
```

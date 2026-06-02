# Architecture Rules

## Project Structure

Futurapp UI is a single-page application (SPA) — **not a monorepo**.

```
src/
├── pages/               # Route page components
│   ├── Home.tsx         # Landing page
│   ├── Login.tsx        # Auth0 login flow
│   ├── Profile.tsx      # User profile & test status
│   ├── TestHome.tsx     # Test dashboard/hub
│   ├── Recommender.tsx  # AI career recommendations
│   ├── ScholarshipSearch.tsx  # Program & scholarship search
│   ├── Admin.tsx        # Admin dashboard
│   ├── About.tsx        # About page
│   ├── ProtectedRoute.tsx   # Auth-protected route wrapper
│   ├── AdminRoute.tsx       # Admin-only route wrapper
│   └── tests/           # Aptitude test pages
│       ├── VerbalTest.tsx
│       ├── MechanicalTest.tsx
│       ├── NumericTest.tsx
│       ├── SpatialTest.tsx
│       ├── AbstractTest.tsx
│       └── PersonalityTest.tsx
│
├── components/          # Reusable React components
│   ├── ui/              # Shadcn UI components
│   ├── admin/           # Admin-specific components
│   │   ├── BulkImporter/  # CSV import wizard
│   │   └── ...            # User, university, program, scholarship forms/lists
│   ├── ScoreReport.tsx  # PDF test report generator
│   ├── TestTimer.tsx    # Test countdown timer
│   └── auth/
│       └── AuthCheck.tsx
│
├── hooks/
│   └── useTestTimer.ts  # Timer state & logic hook
│
├── services/
│   └── adminApi.ts      # Admin API client (Axios)
│
├── config/
│   └── api.ts           # API base URL (dev/prod)
│
├── lib/
│   └── utils.ts         # Utility: cn() for clsx + tailwind-merge
│
├── utils/
│   └── answerPersistence.ts  # Save/load test answers from backend
│
├── data/                # Test question data (JSON files)
│   ├── verbalQuestions.json
│   ├── mechanicalQuestions.json
│   ├── numericalQuestions.json
│   ├── spatialQuestions.json
│   ├── abstractQuestions.json
│   └── personalityQuestions.json
│
├── main.tsx             # React entry point (router + Auth0 provider)
├── App.tsx              # Main app wrapper
└── index.css            # Global styles
```

## Component Patterns

### Page Components

```typescript
export default function TestHome() {
  // 1. Hooks at the top
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState(null);

  // 2. Effects for data fetching
  useEffect(() => { /* fetch data */ }, []);

  // 3. Early returns for loading/error
  if (!data) return <LoadingSpinner />;

  // 4. Main render
  return <div>...</div>;
}
```

### State Management

- **Component-level state** with `useState` / `useEffect`
- **Auth0 hook** (`useAuth0`) for user session & tokens
- **No global state library** — state is fetched from API and stored locally
- **localStorage** used for test answer persistence

## Naming Conventions

| Type       | Convention              | Example                  |
| ---------- | ----------------------- | ------------------------ |
| Components | PascalCase              | `ScoreReport.tsx`        |
| Hooks      | camelCase, `use` prefix | `useTestTimer.ts`        |
| Utilities  | camelCase               | `answerPersistence.ts`   |
| Services   | camelCase               | `adminApi.ts`            |
| Config     | camelCase               | `api.ts`                 |
| Constants  | SCREAMING_SNAKE_CASE    | `API_BASE_URL`           |

## Import Alias

Use the `@/*` path alias (mapped to `src/*`):

```typescript
// Good
import { Button } from '@/components/ui/button';
import { useTestTimer } from '@/hooks/useTestTimer';

// Bad
import { Button } from '../../../components/ui/button';
```

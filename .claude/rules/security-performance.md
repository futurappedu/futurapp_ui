# Security & Performance Rules

## Authentication (Auth0)

### Auth Flow

- Auth0 handles all authentication via `@auth0/auth0-react`
- Protected routes check for valid session using `useAuth0()` hook
- Admin routes verify admin permissions via backend API
- JWT tokens are sent as `Authorization: Bearer` headers

### Never Store Secrets Client-Side

- Only `VITE_*` prefixed env vars are exposed to the client
- Auth0 domain and client ID are public (safe to expose)
- Backend API keys and secrets live on Railway (server-side only)

## Common Vulnerabilities to Avoid

| Vulnerability           | Prevention                                          |
| ----------------------- | --------------------------------------------------- |
| XSS                     | React auto-escapes; avoid `dangerouslySetInnerHTML` |
| Sensitive Data Exposure | Never log tokens/passwords; use `.env`              |
| Unauthorized Access     | Always validate auth tokens on the backend          |
| CSRF                    | Auth0 handles token management via cookies/headers  |

## Performance

### Lazy Loading

```typescript
const AdminPage = lazy(() => import('./pages/Admin'));

<Suspense fallback={<LoadingSpinner />}>
  <AdminPage />
</Suspense>
```

### Image Optimization

- Use appropriate sizes
- Lazy load below-fold images
- Prefer WebP format

### Bundle Size

- Import specific functions, not entire libraries:

```typescript
// Good
import { format } from 'date-fns';

// Bad
import * as dateFns from 'date-fns';
```

### Data Fetching

- Show loading states while fetching from the backend API
- Handle API errors gracefully with user-friendly messages
- Consider caching repeated requests (e.g., question data, scores)

## Environment Variables

Required frontend variables (`.env`):

- `VITE_AUTH0_RETURN_URL` — Auth0 redirect URL after login

# Backend API & Authentication Rules

## Backend API

The frontend communicates with a custom REST API hosted on Railway.

### API Configuration

```typescript
// src/config/api.ts
// Dev:  http://localhost:5000
// Prod: https://futurappapi-staging.up.railway.app
```

### HTTP Client

Use **Axios** for API requests:

```typescript
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
```

### Key Endpoints

| Feature        | Endpoint                              | Method   | Purpose                          |
| -------------- | ------------------------------------- | -------- | -------------------------------- |
| Test Scores    | `/scores-tests`                       | POST     | Get user test completion & scores|
| Save Answers   | `/save-answers`                       | POST     | Persist test answers             |
| Load Answers   | `/get-answers`                        | GET      | Retrieve previous test answers   |
| Admin Users    | `/v1/admin/users`                     | GET/POST | User management                  |
| User Favorites | `/v1/admin/users/{id}/favorites`      | GET      | Saved programs                   |
| User History   | `/v1/admin/users/{id}/history`        | GET      | Activity history                 |
| Universities   | `/v1/admin/universities`              | GET/POST | University data                  |
| Programs       | `/v1/admin/programs`                  | GET/POST | Academic programs                |
| Scholarships   | `/v1/admin/scholarships`              | GET/POST | Scholarship data                 |
| Bulk Import    | `/v1/admin/import`                    | POST     | CSV data import                  |

### Authentication Header

All authenticated requests include the Auth0 JWT:

```typescript
const token = await getAccessTokenSilently();
const response = await axios.get(`${API_BASE_URL}/endpoint`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Authentication (Auth0)

### Configuration

Auth0 is configured in `src/main.tsx`:

- **Domain:** `dev-cw4j08ldhb6pgkzs.us.auth0.com`
- **Client ID:** `FOHKg168YFW90b7jRMF2k4K49Jb1vjXF`
- **Audience:** `https://dev-cw4j08ldhb6pgkzs.us.auth0.com/api/v2/`

### Using Auth0 in Components

```typescript
import { useAuth0 } from '@auth0/auth0-react';

function MyComponent() {
  const { isAuthenticated, user, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  // ...
}
```

### Route Protection

- **`ProtectedRoute`** — checks `isAuthenticated`, redirects to login if not
- **`AdminRoute`** — checks auth + admin permissions via API

## Environment Variables

### Frontend (.env)

- `VITE_AUTH0_RETURN_URL` — Auth0 redirect URL after login

### Backend (Railway)

Backend API credentials are managed on Railway — they are not part of this frontend repo.

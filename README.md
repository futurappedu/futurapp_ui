# Futurapp UI

Frontend for **Futurapp** — an AI-powered career recommender platform that helps students find the right university programs and scholarships based on their aptitude test results and personal preferences.

## What is Futurapp?

Futurapp guides students through a series of aptitude tests (verbal, mechanical, numerical, spatial, abstract, and personality), then uses the results to generate personalized career and university program recommendations powered by OpenAI, Cohere, and Pinecone.

Students can also browse and filter university programs, save favorites, and download a PDF report of their top picks.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS + Shadcn UI |
| Auth | Auth0 (`@auth0/auth0-react`) |
| HTTP client | Axios |
| Forms | React Hook Form + Zod |
| PDF generation | `@react-pdf/renderer` |
| Charts | Recharts |
| Notifications | Sonner |

## Project Structure

```
src/
├── pages/               # Route-level components
│   ├── Home.tsx         # Landing page
│   ├── Login.tsx        # Auth0 login flow
│   ├── Profile.tsx      # User profile & test status
│   ├── TestHome.tsx     # Test dashboard
│   ├── Recommender.tsx  # AI career recommendations
│   ├── ScholarshipSearch.tsx  # Program & scholarship search
│   ├── Admin.tsx        # Admin dashboard
│   └── tests/           # Aptitude test pages (6 tests)
│
├── components/          # Reusable components
│   ├── ui/              # Shadcn UI primitives
│   ├── admin/           # Admin-specific forms and tables
│   ├── ScoreReport.tsx  # PDF report generator
│   └── TestTimer.tsx    # Countdown timer
│
├── hooks/
│   └── useTestTimer.ts  # Timer state & logic
│
├── services/
│   └── adminApi.ts      # Admin API client
│
├── config/
│   └── api.ts           # API base URL (dev/prod)
│
├── data/                # Test question banks (JSON)
└── utils/
    └── answerPersistence.ts  # Save/resume test answers
```

## Getting Started

### Prerequisites

- Node.js >= 20
- npm

### Install & run

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### Environment variables

Create a `.env` file at the project root:

```env
VITE_AUTH0_RETURN_URL=http://localhost:5173
```

## Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # TypeScript check + production build
npm run lint      # ESLint (zero warnings allowed)
npm run preview   # Preview production build locally
```

## Authentication

Auth is handled entirely by Auth0. The frontend never stores passwords or secrets — it only holds a JWT that gets sent as a `Bearer` token on every API request.

- **Domain:** `dev-cw4j08ldhb6pgkzs.us.auth0.com`
- **Protected routes:** wrapped in `<ProtectedRoute>` (requires login)
- **Admin routes:** wrapped in `<AdminRoute>` (requires admin role)

## Backend API

The frontend talks to a Flask REST API hosted on Railway:

- **Production:** `https://futurappapi-staging.up.railway.app`
- **Local dev:** `http://localhost:5000`

See `src/config/api.ts` for the full config.

## Deployment

The app is deployed on **Netlify** as a static SPA. Every push to `main` triggers a new deploy.

```bash
npm run build     # Outputs to dist/
```

Make sure `VITE_AUTH0_RETURN_URL` is set to the production URL in the Netlify environment variables.

## How Recommendations Work

1. Student completes all 6 aptitude tests
2. Test scores + preferences are sent to the backend
3. Backend calls **OpenAI** to generate candidate fields of study
4. Each field is embedded via **Cohere** (`embed-multilingual-v3.0`)
5. **Pinecone** performs nearest-neighbor search against stored university programs
6. Top 3 matching programs per field are returned and displayed

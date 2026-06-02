# Package Management Rules

## Package Manager

**npm only** — this is a single-package project (not a monorepo).

```bash
# Install all dependencies
npm install

# Add a dependency
npm install package-name

# Add a dev dependency
npm install -D package-name

# Remove a package
npm uninstall package-name
```

## Never Edit package.json Directly

Always use CLI commands for dependency changes.

## Adding New Dependencies

Before adding a new dependency:

1. Check if existing packages can solve the problem
2. Verify the package is actively maintained
3. Prefer packages with TypeScript support
4. Consider bundle size impact

## Existing Key Dependencies

### Core

| Package              | Purpose                    |
| -------------------- | -------------------------- |
| `react` (18)         | UI framework               |
| `react-router-dom` (7) | Client-side routing     |
| `typescript` (5)     | Type system                |
| `vite` (5)           | Build tool & dev server    |
| `tailwindcss` (3)    | Utility-first CSS          |

### Authentication

| Package              | Purpose                    |
| -------------------- | -------------------------- |
| `@auth0/auth0-react` | Auth0 integration          |

### UI Components

| Package              | Purpose                    |
| -------------------- | -------------------------- |
| `@radix-ui/*`        | Accessible UI primitives (Shadcn UI) |
| `lucide-react`       | Icon library               |
| `sonner`             | Toast notifications        |
| `recharts`           | Charts & data visualization|
| `embla-carousel-react` | Carousel component       |

### Forms & Validation

| Package              | Purpose                    |
| -------------------- | -------------------------- |
| `react-hook-form`    | Form state management      |
| `@hookform/resolvers`| Zod integration for forms  |
| `zod`                | Runtime schema validation  |

### Utilities

| Package              | Purpose                    |
| -------------------- | -------------------------- |
| `axios`              | HTTP client                |
| `date-fns`           | Date utilities             |
| `papaparse`          | CSV parsing (bulk import)  |
| `@react-pdf/renderer`| PDF generation             |
| `katex` / `react-katex` | Math typesetting       |
| `class-variance-authority` | Component variants  |
| `tailwind-merge`     | Merge conflicting Tailwind classes |

## NPM Scripts

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # TypeScript compile + Vite production build
npm run lint      # ESLint with max-warnings 0
npm run preview   # Preview production build locally
```

## Runtime Requirements

- Node.js >= 20

# Ndlela Search Frontend

A modern React + TypeScript + Vite frontend for the South African national tourism search platform.

## Features

- **Authentication**: User registration and login with JWT token management
- **Search**: Full-featured search with results display and filtering
- **Protected Routes**: Authentication-based access control
- **Responsive Design**: Mobile-first UI with modern styling
- **Type Safety**: Strict TypeScript configuration
- **Development**: Hot module replacement (HMR) with Vite

## Quick Start

### Recommended: Single Command
```bash
# From the repository root:
cd frontend/client
npm install

cd ../server
npm install

cd ../client
# Start both Express server and Vite client
npm run dev
```

This runs both servers concurrently:
- **Express Server**: http://localhost:3001
- **Vite Dev Server**: http://localhost:5173

### Alternative: Separate Terminals

**Terminal 1 - Express Server:**
```bash
cd frontend/server
npm install
npm run dev
```

**Terminal 2 - Vite Client:**
```bash
cd frontend/client
npm install
npm run dev:client
```

## Scripts

- `npm run dev` - Start both Express and Vite servers concurrently (recommended)
- `npm run dev:client` - Start only Vite dev server
- `npm run dev:server` - Start only Express server (from client directory)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest

## Important: Proxy Configuration

The Vite dev server proxies `/api` requests to `http://localhost:3001` (Express server).
**The Express server must be running for API calls to work.** This is why we use `concurrently` 
to start both servers together.

## Available Routes

- `/login` - User login page
- `/register` - User registration page
- `/search` - Protected search page (requires authentication)
- `/` - Redirects to `/search`

## Authentication Flow

### Registration

1. User fills registration form with name, email, password
2. Frontend validates input and calls `POST /api/auth/register`
3. Receives JWT token and user data
4. Token stored in localStorage
5. Redirects to search page

### Login

1. User enters email and password
2. Frontend calls `POST /api/auth/login`
3. Receives JWT token and user data
4. Token stored in localStorage
5. Redirects to search page

## Search Functionality

### Features

- Full-text search across businesses and services
- Filter by category
- Display results in responsive grid
- Pagination support
- User profile display with logout option

### Search Flow

1. User enters search query
2. Frontend calls `GET /api/search?q={query}` with JWT token
3. Results displayed with name, description, category, and rating
4. Grid layout responsive for mobile/desktop

## API Integration

### Auth Endpoints

- `POST /api/auth/login` - Login (no auth required)
  - Body: `{ email, password }`
  - Returns: `{ token, user: { id, email, name } }`

- `POST /api/auth/register` - Register (no auth required)
  - Body: `{ email, password, name }`
  - Returns: `{ token, user: { id, email, name } }`

- `GET /api/auth/me` - Get current user (auth required)
  - Returns: `{ id, email, name }`

### Search Endpoints

- `GET /api/search` - Search (auth required)
  - Query: `?q={query}&limit={10}&offset={0}`
  - Returns: `{ query, total, results: [ { id, name, description, category, rating } ] }`

- `GET /api/search/category` - Category search (auth required)
  - Query: `?category={category}&limit={10}`
  - Returns: `{ query, total, results: [ ... ] }`

## Scripts

```powershell
# Development server (port 5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

## Technology Stack

- **React** 18 - UI library
- **TypeScript** 5 - Type safety
- **Vite** 5 - Build tool
- **React Router** 6 - Routing
- **CSS** - Styling with custom properties

## Project Structure

```
src/
├── components/
│   ├── ProtectedRoute.tsx    - Auth guard for protected routes
│   ├── SearchBar.tsx
│   └── SearchResults.tsx
├── contexts/
│   └── AuthContext.tsx       - Global auth state management
├── pages/
│   ├── Login.tsx             - Login page
│   ├── Register.tsx          - Registration page
│   └── Search.tsx            - Protected search page
├── services/
│   ├── search.service.ts     - Search API calls
│   └── searchClient.ts
├── types/
│   ├── auth.ts               - Auth type definitions
│   └── search.ts             - Search type definitions
├── App.tsx
├── main.tsx
└── styles.css
```

## Code Quality

- Strict TypeScript configuration
- Functional components with hooks
- React Context for state management
- Type-safe API calls
- Error handling and validation

## Development Guidelines

### Naming Conventions

- Components: PascalCase (e.g., `LoginForm.tsx`)
- Services: camelCase with `.service.ts` suffix (e.g., `search.service.ts`)
- Types: PascalCase interfaces (e.g., `SearchResult`)
- Files: kebab-case for pages (e.g., `login.tsx`)

### Creating New Features

1. Define types in `src/types/`
2. Create service in `src/services/`
3. Build component in `src/components/` or `src/pages/`
4. Add route in `src/main.tsx`
5. Wrap with `<ProtectedRoute>` if needed

### Error Handling

All errors are:
- Caught with try-catch
- Displayed to user in UI
- Logged to console for debugging
- Handled gracefully without crashes

## Styling

### Color Scheme

- Primary: `#0057b7` (Blue)
- Secondary: `#28a745` (Green)
- Danger: `#dc3545` (Red)
- Gray: `#f9fafb` to `#111827`

### Responsive Design

- Mobile-first approach
- Grid layout for results
- Flexbox for components
- Media queries for breakpoints

## Testing

Create `.spec.ts` files for tests:

```powershell
npm run test
```

## Troubleshooting

### Server Not Starting

Ensure Node.js v20.19+ is installed:

```powershell
node --version
npm --version
```

### API Connection Issues

1. Check Express server running on port 3001: `npm run dev` in `frontend/server`
2. Verify routes in `frontend/server/routes/`
3. Check browser console for errors
4. Verify JWT token format

### Module Not Found

Clear cache and reinstall:

```powershell
if (Test-Path node_modules) { Remove-Item node_modules -Recurse -Force }
npm install
```

## Production Build

```powershell
npm run build
# Output: dist/ folder with optimized files
```

Deploy `dist/` folder to static hosting (Vercel, Netlify, Azure Static Web Apps, etc.).

## Running the Full System

### Prerequisites

- Node.js v20.19+
- Backend .NET services running (or use docker-compose)

### Start Frontend

```powershell
# Terminal 1: Express Server (API proxy)
cd frontend/server
npm install
npm run dev

# Terminal 2: Vite React Client
cd frontend/client
npm install
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

### Test the Flow

1. Open http://localhost:5173 in browser
2. Redirects to `/login` if not authenticated
3. Click "Register here" to create account
4. Enter name, email, password (minimum 8 chars)
5. Click Register
6. Redirected to Search page after successful registration
7. Enter search query and click Search
8. View results displayed in grid

## Contributing

Follow the guidelines in `/instructions/frontend-guidelines.md` for consistent code quality and standards.

## License

© 2025 South African Tourism Board. All rights reserved.

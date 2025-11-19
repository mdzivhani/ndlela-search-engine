# Ndlela Search Express Server

Express.js proxy server for the Ndlela Search platform frontend. Acts as a middleware between the React client and backend services.

## Quick Start

```powershell
cd frontend/server
npm install
npm run dev
```

Server runs on `http://localhost:3001`

## Features

- **API Proxy**: Routes to backend microservices
- **CORS Enabled**: Allow cross-origin requests from frontend
- **Auth Routing**: Handles user registration and login
- **Search Routing**: Proxies search requests
- **Mock Data**: Development-friendly mock responses
- **Hot Reload**: Nodemon for automatic restart on changes

## Configuration

### Environment Variables

Create `.env` file in server directory:

```env
PORT=3001
NODE_ENV=development
```

### CORS Configuration

Currently allows all origins. Update in `index.js` for production:

```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

## API Routes

### Auth Routes (`/api/auth`)

Handles user authentication operations.

#### POST /api/auth/register
Register a new user.

Request body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

Response (201):
```json
{
  "token": "dev-token-1234567890-user-123",
  "user": {
    "id": "user-1234567890",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/login
Login existing user.

Request body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response (200):
```json
{
  "token": "dev-token-1234567890-user-123",
  "user": {
    "id": "user-1234567890",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### GET /api/auth/me
Get current authenticated user.

Headers required:
```
Authorization: Bearer dev-token-1234567890-user-123
```

Response (200):
```json
{
  "id": "user-1234567890",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Search Routes (`/api/search`)

Requires authentication header.

#### GET /api/search
Search for businesses and services.

Query parameters:
- `q` (string) - Search query
- `limit` (number, optional) - Results per page (default: 10)
- `offset` (number, optional) - Pagination offset (default: 0)

Headers required:
```
Authorization: Bearer {token}
```

Request:
```
GET /api/search?q=safari&limit=10&offset=0
```

Response (200):
```json
{
  "query": "safari",
  "total": 3,
  "results": [
    {
      "id": "1",
      "name": "Kruger Game Lodge",
      "description": "Luxury safari lodge offering guided game drives and accommodation.",
      "category": "Accommodation",
      "rating": 4.8
    }
  ]
}
```

#### GET /api/search/category
Search by category.

Query parameters:
- `category` (string, required) - Category name
- `limit` (number, optional) - Results per page (default: 10)

Request:
```
GET /api/search/category?category=Tours&limit=5
```

Response (200):
```json
{
  "query": "Tours",
  "total": 2,
  "results": [
    {
      "id": "2",
      "name": "Table Mountain Tours",
      "description": "Guided hiking and cable car tours with stunning views.",
      "category": "Tours",
      "rating": 4.9
    }
  ]
}
```

### Operator Routes (`/api/operator`)

Placeholder for operator/business management endpoints.

## Project Structure

```
frontend/server/
├── index.js                 - Express app entry point
├── routes/
│   ├── auth.router.js      - Authentication routes
│   ├── search.router.js    - Search routes
│   └── operator.router.js  - Operator routes (placeholder)
├── package.json
└── .env                     - Environment variables (local only)
```

## Development

### Installation

```powershell
npm install
```

Dependencies:
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `dotenv` - Environment variables
- `nodemon` - Auto-restart on file changes

### Running in Development

```powershell
npm run dev
```

Nodemon watches for file changes and restarts server automatically.

### Starting in Production

```powershell
npm start
```

## Authentication

### Token Format

Tokens are simple dev tokens in format:
```
dev-token-{timestamp}-{userId}
```

For production, integrate with:
- JWT (JSON Web Tokens)
- OAuth 2.0
- OIDC (OpenID Connect)
- Azure AD / Entra ID

### Token Validation

Current implementation:
1. Extracts token from `Authorization: Bearer {token}` header
2. Validates token starts with `dev-token-`
3. Validates token format
4. Extracts user ID from token for `/me` endpoint

### Enhancing Authentication

To add proper JWT authentication:

```javascript
const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
```

## Mock Data

Search endpoint returns mock tourism businesses:
- Kruger Game Lodge
- Table Mountain Tours
- Cape Town Spa & Wellness
- Winelands Wine Tasting
- Garden Route Adventure Park
- East London Beach Resort
- Durban Aquarium & Museum
- Knysna Oyster Farm Tour
- Mpumalanga Hiking Trail
- Johannesburg Arts District

To use real backend services, update routes to proxy to:
- Backend Search Service: `http://localhost:5000/api/search`
- Backend Auth Service: `http://localhost:5001/api/auth`

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Successful GET request
- `201` - Successful POST request (resource created)
- `400` - Bad request (missing/invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `409` - Conflict (user already exists)
- `500` - Server error

Error responses:
```json
{
  "message": "Error description"
}
```

## Security

### Current Security

- CORS enabled for development
- Helmet.js for HTTP headers
- JSON body parsing
- Basic token validation

### Production Security

- Use HTTPS only
- Validate JWT tokens properly
- Rate limiting on auth endpoints
- CORS restricted to known domains
- Secure CORS configuration
- CSRF protection if needed
- Input validation/sanitization
- SQL injection prevention (use parameterized queries)
- Never log sensitive data

## Scaling for Production

### Connect to Real Backend Services

Update routes to call actual microservices instead of mocks:

```javascript
// routes/search.router.js
const backendUrl = process.env.SEARCH_SERVICE_URL || 'http://localhost:5000';

router.get('/', verifyToken, async (req, res) => {
  try {
    const response = await fetch(`${backendUrl}/api/search?${req.url.split('?')[1]}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### Database Integration

Replace in-memory user storage with database:

```javascript
const db = require('./db'); // Your database connection

router.post('/login', async (req, res) => {
  const user = await db.users.findOne({ email: req.body.email });
  // ... rest of login logic
});
```

### Container Deployment

See `Dockerfile` for containerization details.

```bash
docker build -t ndlela-server .
docker run -p 3001:3001 ndlela-server
```

## Testing

Create test files alongside routes:

```javascript
// routes/auth.router.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});
```

Run tests:
```powershell
npm run test
```

## Performance Optimization

- Add caching for search results
- Implement request queuing
- Use connection pooling for database
- Add compression middleware
- Implement rate limiting

## Monitoring & Logging

Add logging for production:

```javascript
const morgan = require('morgan');
app.use(morgan('combined'));

const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`)
};
```

## Troubleshooting

### Port Already in Use

```powershell
# Kill process on port 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID {PID} /F

# Or start on different port
PORT=3002 npm run dev
```

### CORS Errors

Ensure frontend and server URLs match in CORS configuration.

### Authentication Failing

1. Check token format in Authorization header
2. Verify token is included in request
3. Check console logs for validation errors
4. Ensure user exists in storage

## Contributing

- Follow Express.js best practices
- Keep routes focused and modular
- Add error handling to all endpoints
- Document new endpoints
- Test before committing

## License

© 2025 South African Tourism Board. All rights reserved.

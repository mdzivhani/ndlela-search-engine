# 🎯 Quick Reference - Ndlela Search Frontend

## 🚀 Running the System

### Start Terminal 1 - Express Server
```powershell
cd frontend/server
npm run dev
# Output: Server listening on 3001
```

### Start Terminal 2 - Vite Client
```powershell
cd frontend/client
npm run dev
# Output: VITE ready at http://localhost:5173/
```

### Open Browser
```
http://localhost:5173
```

## 🧪 Quick Test

1. **Register**: Click "Register here" → Fill form → Click "Register"
2. **Search**: Type "safari" → Click "Search" → See results
3. **Logout**: Click "Logout" button
4. **Login**: Use same email/password → Click "Login"

## 📍 Key Locations

| Component | Path |
|-----------|------|
| Auth Context | `frontend/client/src/contexts/AuthContext.tsx` |
| Auth Pages | `frontend/client/src/pages/{Login,Register}.tsx` |
| Search Page | `frontend/client/src/pages/Search.tsx` |
| API Service | `frontend/client/src/services/search.service.ts` |
| Types | `frontend/client/src/types/{auth,search}.ts` |
| Styling | `frontend/client/src/styles.css` |
| Express Routes | `frontend/server/routes/` |
| Express App | `frontend/server/index.js` |

## 🔑 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me (requires token)
```

### Search
```
GET /api/search?q=query (requires token)
GET /api/search/category?category=name (requires token)
```

## 🧩 Component Structure

```
App
├── LoginPage (public)
├── RegisterPage (public)
└── ProtectedRoute
    └── SearchPage (protected)
```

## 💾 Token Management

- **Stored**: localStorage key `auth_token`
- **Format**: `dev-token-{timestamp}-{userId}`
- **Header**: `Authorization: Bearer {token}`
- **Cleared**: On logout
- **Verified**: On app load

## 🎨 Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Blue | #0057b7 |
| Secondary | Green | #28a745 |
| Danger | Red | #dc3545 |
| Gray Light | Light | #f9fafb |
| Gray Dark | Dark | #111827 |

## 📝 Form Validation

| Field | Rules |
|-------|-------|
| Email | Valid email format |
| Password | Minimum 8 characters |
| Confirm Password | Must match password |
| Name | Required, non-empty |

## 🔍 Mock Search Keywords

- `safari` → Kruger Game Lodge
- `table` → Table Mountain Tours
- `cape` → Cape Town services
- `wine` → Winelands
- `adventure` → Garden Route
- `beach` → East London Resort
- `tour` → All tour-related
- `accommodation` → All lodges
- `spa` → Wellness services
- `food` → Food & Drink services

## 📊 TypeScript Configuration

- ✅ Strict: true
- ✅ No implicit any
- ✅ No unused parameters
- ✅ No unused locals
- ✅ Force consistent casing

## 🛡️ Protected Route Logic

```typescript
if (isLoading) → Show loading spinner
else if (isAuthenticated) → Render component
else → Redirect to /login
```

## 🔄 Auth Context Hooks

```typescript
const { user, isAuthenticated, isLoading, login, register, logout } = useAuth()
```

## 📡 API Call Pattern

```typescript
// Service
const response = await performSearch({ q, limit, offset })

// Component
try {
  const data = await performSearch({ q: query })
  setResults(data)
} catch (error) {
  setError(error.message)
}
```

## 🎯 Responsive Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (two columns)
- **Desktop**: > 1024px (multi-column grid)

## 🐛 Debugging

### Browser Console (F12)
- Check for errors
- Verify token in localStorage
- Check network requests

### Terminal
- Watch for server logs
- Watch for Vite compilation errors
- Check for TypeScript errors

### Network Tab (F12)
- Verify API calls
- Check response status
- View response headers

## ⚡ Performance Tips

- Vite HMR: < 100ms for changes
- Bundle size: Minimal
- First load: < 1 second
- API response: < 100ms

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `FRONTEND_SUMMARY.md` | Complete overview |
| `FRONTEND_TESTING_GUIDE.md` | How to test |
| `FRONTEND_IMPLEMENTATION.md` | Detailed implementation |
| `frontend/client/README.md` | Client documentation |
| `frontend/server/README.md` | Server documentation |

## 🚨 Troubleshooting Quick Fixes

### Port in Use
```powershell
# Kill process on port
netstat -ano | findstr :PORT
taskkill /PID {PID} /F
```

### Module Not Found
```powershell
# Clear and reinstall
rm -r node_modules
npm install
```

### TypeScript Errors
```powershell
# Check types
npx tsc --noEmit
```

### API Connection Failed
1. Check Express server running
2. Check browser console
3. Verify authorization header
4. Check network tab

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Server | http://localhost:3001 |
| Login Page | http://localhost:5173/login |
| Register | http://localhost:5173/register |
| Search | http://localhost:5173/search |

## ✅ Pre-Testing Checklist

- [ ] Both servers running
- [ ] Port 5173 accessible
- [ ] Port 3001 accessible
- [ ] No console errors
- [ ] Node modules installed
- [ ] npm packages updated

## 🎓 File Organization

```
frontend/
├── client/           # React app
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   └── README.md
└── server/           # Express
    ├── routes/
    ├── index.js
    └── README.md
```

## 🎉 Success Indicators

✅ Page loads at http://localhost:5173
✅ Can register new user
✅ Can login with credentials
✅ Can search for businesses
✅ Results display in grid
✅ Can logout
✅ No console errors
✅ Responsive on mobile
✅ Responsive on desktop
✅ All buttons functional

---

## 📞 Need Help?

1. Read the comprehensive docs
2. Check browser console (F12)
3. Check server terminal output
4. Verify ports are accessible
5. Try clearing cache and reinstalling

---

**Status**: ✅ Ready for Testing
**Frontend**: http://localhost:5173
**Server**: http://localhost:3001

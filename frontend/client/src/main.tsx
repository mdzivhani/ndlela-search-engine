import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { SearchProvider } from './contexts/SearchContext'
import { FavouritesProvider } from './contexts/FavouritesContext'
import App from './App'
import Search from './pages/Search'
import Browse from './pages/Browse'
import Favourites from './pages/Favourites'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import BusinessDetail from './pages/BusinessDetail'
import Checkout from './pages/Checkout'
import ProtectedRoute from './components/ProtectedRoute'
import './styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <SearchProvider>
          <FavouritesProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </FavouritesProvider>
        </SearchProvider>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <Navigate to='/search' replace /> },
      { path: 'search', element: <Search /> },
      { path: 'browse', element: <Browse /> },
      { path: 'favourites', element: <Favourites /> },
      { path: 'login', element: <Auth /> },
      { path: 'register', element: <Auth /> },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: 'business/:id', element: <BusinessDetail /> },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
})

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

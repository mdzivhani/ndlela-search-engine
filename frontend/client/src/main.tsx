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
import ForgotPassword from './pages/ForgotPassword'
import BusinessDetail from './pages/BusinessDetail'
import Checkout from './pages/Checkout'
import ProtectedRoute from './components/ProtectedRoute'
import './styles.css'
import './discovery.css'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ListingDetail from './pages/ListingDetail'
import Collections from './pages/Collections'
import TripPlanner from './pages/TripPlanner'
import Trips, { SharedTrip } from './pages/Trips'
import OperatorHub from './pages/OperatorHub'
import Enquiries from './pages/Enquiries'
import Moderation from './pages/Moderation'

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
      { index: true, element: <Home /> },
      { path: 'search', element: <Explore /> },
      { path: 'browse', element: <Browse /> },
      { path: 'favourites', element: <Collections /> },
      { path: 'planner', element: <TripPlanner /> },
      { path: 'trips', element: <ProtectedRoute><Trips /></ProtectedRoute> },
      { path: 'shared/:token', element: <SharedTrip /> },
      { path: 'operator', element: <ProtectedRoute><OperatorHub /></ProtectedRoute> },
      { path: 'enquiries', element: <ProtectedRoute><Enquiries /></ProtectedRoute> },
      { path: 'admin', element: <ProtectedRoute><Moderation /></ProtectedRoute> },
      { path: 'login', element: <Auth /> },
      { path: 'register', element: <Auth /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Enquiries />
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
      { path: 'business/:id', element: <ListingDetail /> },
      { path: '*', element: <div className="nd-section"><h1>This path ends here.</h1><a href="/">Back to discovery</a></div> },
    ],
  },
])

document.documentElement.dataset.lowData = localStorage.getItem('ndlela_low_data') || 'false'
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

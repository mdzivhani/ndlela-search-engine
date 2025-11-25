import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import BusinessDetail from './pages/BusinessDetail'
import ProtectedRoute from './components/ProtectedRoute'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Navigate to='/search' replace />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route
              path='search'
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path='business/:id'
              element={
                <ProtectedRoute>
                  <BusinessDetail />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

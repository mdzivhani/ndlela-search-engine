import React, { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { AuthResponse, AuthContextType, User, LoginRequest, RegisterRequest } from '../types/auth'
import { apiClient, ApiClientError } from '../utils/apiClient'

const TOKEN_KEY = 'auth_token'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        try {
          // Verify token is still valid by making a request
          const userData = await apiClient.get<User>('/auth/me')
          setUser(userData)
        } catch (error) {
          console.error('Failed to verify token:', error)
          localStorage.removeItem(TOKEN_KEY)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      } as LoginRequest, { skipAuth: true })

      localStorage.setItem(TOKEN_KEY, data.token)
      setUser(data.user)
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error
      }
      throw new Error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const data = await apiClient.post<AuthResponse>('/auth/register', {
        email,
        password,
        name,
      } as RegisterRequest, { skipAuth: true })

      localStorage.setItem(TOKEN_KEY, data.token)
      setUser(data.user)
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error
      }
      throw new Error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...partial } : prev))
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAuthHeader() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

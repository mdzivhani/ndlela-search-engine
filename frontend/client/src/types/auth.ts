export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  location?: string
  city?: string
  province?: string
  profilePicture?: string
  createdAt?: string
}

export interface UpdateProfileRequest {
  name?: string
  phone?: string
  location?: string
  city?: string
  province?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateUser: (partial: Partial<User>) => void
}

import { getAuthHeader } from '../contexts/AuthContext'

const MAX_AVATAR_SIZE = 1_000_000 // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

export interface AvatarUploadResult {
  url: string
}

// Upload avatar via multipart/form-data to backend. Returns persisted URL.
export async function uploadAvatar(file: File): Promise<AvatarUploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Use JPG or PNG.')
  }
  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error('File too large. Max 1MB.')
  }

  const formData = new FormData()
  formData.append('avatar', file)
  const authHeader = getAuthHeader()
  const headers: Record<string, string> = {}
  if ((authHeader as any).Authorization) headers.Authorization = (authHeader as any).Authorization
  const response = await fetch('/api/auth/avatar', {
    method: 'POST',
    headers,
    body: formData
  })

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    const text = await response.text()
    throw new Error(text || 'Unexpected response format')
  }

  const payload = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Avatar upload failed')
  }
  return { url: payload.url }
}

export async function removeAvatar(): Promise<void> {
  const authHeader = getAuthHeader()
  const headers: Record<string, string> = {}
  if ((authHeader as any).Authorization) headers.Authorization = (authHeader as any).Authorization
  const response = await fetch('/api/auth/avatar', { method: 'DELETE', headers })
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    // Non-JSON error fallback
    throw new Error('Unexpected response format')
  }
  const payload = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Avatar remove failed')
  }
}

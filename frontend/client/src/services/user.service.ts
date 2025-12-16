import { apiClient } from '../utils/apiClient'

const MAX_AVATAR_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface AvatarUploadResult {
  url: string
}

// Upload avatar via multipart/form-data to backend. Returns persisted URL.
export async function uploadAvatar(file: File): Promise<AvatarUploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Use JPG, PNG, or WEBP.')
  }
  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error('File too large. Max 5MB.')
  }

  const formData = new FormData()
  formData.append('avatar', file)
  const payload = await apiClient.postForm<{ success: boolean; url: string }>('/auth/avatar', formData)
  if (!payload.success || !payload.url) {
    throw new Error('Avatar upload failed')
  }
  return { url: payload.url }
}

export async function removeAvatar(): Promise<void> {
  const payload = await apiClient.delete<{ success: boolean }>('/auth/avatar')
  if (!payload.success) {
    throw new Error('Avatar remove failed')
  }
}

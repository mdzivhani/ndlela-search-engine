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
  
  try {
    if (import.meta.env.DEV) {
      console.log('[Avatar Upload] Starting upload:', { fileName: file.name, fileSize: file.size, fileType: file.type })
    }
    const payload = await apiClient.postForm<{ success: boolean; url: string }>('/auth/avatar', formData)
    if (import.meta.env.DEV) {
      console.log('[Avatar Upload] Response:', payload)
    }
    
    if (!payload.success || !payload.url) {
      throw new Error('Avatar upload failed: Server returned invalid response')
    }
    return { url: payload.url }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Avatar Upload] Failed:', error)
    }
    throw error
  }
}

export async function removeAvatar(): Promise<void> {
  try {
    if (import.meta.env.DEV) {
      console.log('[Avatar Remove] Starting removal')
    }
    const payload = await apiClient.delete<{ success: boolean }>('/auth/avatar')
    if (import.meta.env.DEV) {
      console.log('[Avatar Remove] Response:', payload)
    }
    
    if (!payload.success) {
      throw new Error('Avatar remove failed: Server returned invalid response')
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Avatar Remove] Failed:', error)
    }
    throw error
  }
}

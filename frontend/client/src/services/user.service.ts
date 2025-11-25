import { getAuthHeader } from '../contexts/AuthContext'
import { User } from '../types/auth'

// Max file size 1MB
const MAX_AVATAR_SIZE = 1_000_000
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

export interface AvatarUploadResult {
  url: string
  fileName?: string
}

function centerCropToSquare(image: HTMLImageElement, size: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const minSide = Math.min(image.width, image.height)
  const sx = (image.width - minSide) / 2
  const sy = (image.height - minSide) / 2
  ctx.drawImage(image, sx, sy, minSide, minSide, 0, 0, size, size)
  return canvas.toDataURL('image/png')
}

export async function uploadAvatar(file: File): Promise<AvatarUploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Use JPG or PNG.')
  }
  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error('File too large. Max 1MB.')
  }

  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        try {
          const cropped = centerCropToSquare(img, 256)
          resolve(cropped)
        } catch (e) {
          reject(e)
        }
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  // In absence of backend endpoint, return data URL directly.
  // Future: POST multipart/form-data to /api/users/me/avatar and receive persisted URL.
  return { url: dataUrl }
}

export async function removeAvatar(): Promise<void> {
  // Placeholder for DELETE /api/users/me/avatar
  return Promise.resolve()
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  // Placeholder for PUT /api/users/me
  const headers = { 'Content-Type': 'application/json', ...getAuthHeader() }
  // Perform optimistic update; backend integration to be added later.
  return Promise.resolve(data as User)
}

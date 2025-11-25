import React, { useRef, useState } from 'react'
import { uploadAvatar, removeAvatar } from '../services/user.service'
import { useAuth } from '../contexts/AuthContext'

interface ProfileAvatarProps {
  size?: 'small' | 'large'
  showActions?: boolean
}

export default function ProfileAvatar({ size = 'large', showActions = false }: ProfileAvatarProps) {
  const { user, updateUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleSelectClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setIsUploading(true)
    try {
      const result = await uploadAvatar(file)
      updateUser({ profilePicture: result.url })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemove = async () => {
    setError('')
    setIsUploading(true)
    try {
      await removeAvatar()
      updateUser({ profilePicture: undefined })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Remove failed')
    } finally {
      setIsUploading(false)
    }
  }

  const renderContent = () => {
    if (user?.profilePicture) {
      return <img src={user.profilePicture} alt={user.name + ' avatar'} className="avatar-image" />
    }
    const initial = user?.name?.charAt(0).toUpperCase() || '?' 
    return <span className="avatar-initial" aria-label="avatar-initial">{initial}</span>
  }

  return (
    <div className={`avatar-wrapper avatar-${size}`}> 
      <div className={`avatar ${!user?.profilePicture ? 'avatar-placeholder' : ''}`}>{renderContent()}</div>
      {showActions && (
        <div className="avatar-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handleSelectClick}
            disabled={isUploading}
          >
            {user?.profilePicture ? 'Change' : 'Upload'}
          </button>
          {user?.profilePicture && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleRemove}
              disabled={isUploading}
            >
              Remove
            </button>
          )}
          {error && <div className="message-error avatar-error">{error}</div>}
        </div>
      )}
    </div>
  )
}

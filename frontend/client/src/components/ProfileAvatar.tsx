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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleSelectClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    // revoke previous preview if exists
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
  }

  const handleUpload = async () => {
    if (!fileInputRef.current || !fileInputRef.current.files || !fileInputRef.current.files[0]) return
    const file = fileInputRef.current.files[0]
    setIsUploading(true)
    setError('')
    try {
      const result = await uploadAvatar(file)
      updateUser({ profilePicture: result.url })
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      fileInputRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    setError('')
    setIsUploading(true)
    try {
      await removeAvatar()
      updateUser({ profilePicture: undefined })
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
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
            data-testid="avatar-file-input"
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handleSelectClick}
            disabled={isUploading}
          >
            {user?.profilePicture ? 'Change' : 'Upload'}
          </button>
          {previewUrl && !isUploading && (
            <div className="avatar-preview" style={{ marginTop: '0.5rem' }}>
              <img
                src={previewUrl}
                alt="Preview"
                className="avatar-image"
                style={{ width: size === 'large' ? 100 : 48, height: size === 'large' ? 100 : 48, objectFit: 'cover', borderRadius: '50%' }}
                data-testid="avatar-preview"
              />
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleUpload}
                  disabled={isUploading}
                  data-testid="confirm-upload-button"
                >
                  {isUploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl)
                    setPreviewUrl(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  disabled={isUploading}
                  style={{ marginLeft: '0.5rem' }}
                  data-testid="cancel-upload-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {user?.profilePicture && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleRemove}
              disabled={isUploading}
              data-testid="remove-avatar-button"
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

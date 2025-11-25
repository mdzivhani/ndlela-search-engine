import React, { useRef, useState } from 'react'
import { uploadAvatar, removeAvatar } from '../services/user.service'
import { useAuth } from '../contexts/AuthContext'
import { processAvatarImage } from '../utils/image'

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
  const [processedFile, setProcessedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSelectClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setIsProcessing(true)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    try {
      const optimized = await processAvatarImage(file)
      setProcessedFile(optimized)
      const objectUrl = URL.createObjectURL(optimized)
      setPreviewUrl(objectUrl)
    } catch (err) {
      // Fallback: use original file
      setProcessedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setError(err instanceof Error ? err.message : 'Process failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpload = async () => {
    if (!fileInputRef.current || !fileInputRef.current.files || !fileInputRef.current.files[0]) return
    const file = processedFile || fileInputRef.current.files[0]
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
      return <img src={user.profilePicture} alt={user.name + ' avatar'} className="avatar-image" loading="lazy" />
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
                loading="lazy"
              />
              <div style={{ marginTop: '0.5rem' }}>
                {isProcessing && <span style={{ fontSize: '0.75rem', color: '#666' }}>Optimizing...</span>}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleUpload}
                  disabled={isUploading || isProcessing}
                  data-testid="confirm-upload-button"
                >
                  {isUploading ? 'Uploading...' : isProcessing ? 'Processing...' : 'Confirm Upload'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl)
                    setPreviewUrl(null)
                    setProcessedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  disabled={isUploading || isProcessing}
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

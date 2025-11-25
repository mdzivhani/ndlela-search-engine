/**
 * Profile Page Component
 * Allows authenticated users to view and edit their profile information
 */
import React, { useState, useCallback } from 'react'
import { useAuth, getAuthHeader } from '../contexts/AuthContext'
import { UpdateProfileRequest } from '../types/auth'

const API_BASE_URL = '/api'

export default function Profile() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    city: user?.city || '',
    province: user?.province || '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSaving(true)
      setError('')
      setSuccess('')

      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to update profile')
        }

        const updatedUser = await response.json()
        setSuccess('Profile updated successfully!')
        setIsEditing(false)

        // Update local user data (would need to add updateUser to AuthContext in production)
        // For now, we'll rely on a page refresh or re-fetch
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile')
      } finally {
        setIsSaving(false)
      }
    },
    [formData]
  )

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || '',
      city: user?.city || '',
      province: user?.province || '',
    })
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  const SA_PROVINCES = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape',
  ]

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="header-content">
          <h1>Ndlela Search</h1>
          <div className="user-info">
            <span>{user.name}</span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-card-header">
            <h2>My Profile</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                Edit Profile
              </button>
            )}
          </div>

          {error && <div className="message-error">{error}</div>}
          {success && <div className="message-success">{success}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-section">
              <h3>Personal Information</h3>

              <div className="form-group">
                <label htmlFor="name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  disabled
                  className="form-input form-input-readonly"
                  title="Email cannot be changed"
                />
                <small className="form-help-text">Email address cannot be changed</small>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="+27 XX XXX XXXX"
                  className="form-input"
                />
              </div>
            </div>

            <div className="profile-section">
              <h3>Location Details</h3>

              <div className="form-group">
                <label htmlFor="location">Address</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Street address, suburb"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g., Cape Town"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="province">Province</label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-input"
                  >
                    <option value="">Select province</option>
                    {SA_PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Profile Picture Section - Stub for future implementation */}
            <div className="profile-section profile-section-disabled">
              <h3>Profile Picture</h3>
              <p className="form-help-text">
                Profile picture upload will be available soon. This feature requires image storage
                configuration.
              </p>
              <div className="profile-picture-placeholder">
                <div className="profile-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button type="button" disabled className="btn-secondary">
                  Upload Photo
                </button>
              </div>
            </div>

            {isEditing && (
              <div className="profile-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="btn-primary">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>

          <div className="profile-info">
            <p className="form-help-text">
              <strong>Member since:</strong>{' '}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-ZA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

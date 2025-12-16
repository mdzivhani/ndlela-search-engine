/**
 * Integration tests for avatar upload flow
 * Tests: valid image, unsupported type, file too large
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfileAvatar from '../ProfileAvatar'
import { AuthProvider } from '../../contexts/AuthContext'
import * as userService from '../../services/user.service'

vi.mock('../../services/user.service', () => ({
  uploadAvatar: vi.fn(),
  removeAvatar: vi.fn(async () => {}),
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('Avatar Upload Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uploads valid PNG image and calls service', async () => {
    ;(userService.uploadAvatar as any).mockResolvedValueOnce({
      url: '/uploads/avatars/user1/avatar.png?v=1234567890',
    })

    render(
      <Wrapper>
        <ProfileAvatar showActions />
      </Wrapper>
    )

    // Click upload button
    const uploadBtn = screen.getByRole('button', { name: /upload/i })
    fireEvent.click(uploadBtn)

    // Select valid PNG file
    const fileInput = screen.getByTestId('avatar-file-input') as HTMLInputElement
    const file = new File([new Uint8Array([137, 80, 78, 71])], 'avatar.png', {
      type: 'image/png',
    })
    Object.defineProperty(fileInput, 'files', { value: [file] })
    fireEvent.change(fileInput)

    // Wait for preview
    await waitFor(() => {
      expect(screen.getByTestId('avatar-preview')).toBeInTheDocument()
    })

    // Confirm upload
    const confirmBtn = screen.getByTestId('confirm-upload-button')
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(userService.uploadAvatar).toHaveBeenCalledWith(expect.any(File))
    })
  })

  it('shows error when service rejects unsupported type', async () => {
    ;(userService.uploadAvatar as any).mockRejectedValueOnce(
      new Error('Unsupported file type. Use JPG, PNG, or WEBP.')
    )

    render(
      <Wrapper>
        <ProfileAvatar showActions />
      </Wrapper>
    )

    const uploadBtn = screen.getByRole('button', { name: /upload/i })
    fireEvent.click(uploadBtn)

    const fileInput = screen.getByTestId('avatar-file-input') as HTMLInputElement
    const file = new File(['GIF89a'], 'avatar.gif', { type: 'image/gif' })
    Object.defineProperty(fileInput, 'files', { value: [file] })
    fireEvent.change(fileInput)

    // Preview still shows (client doesn't validate type)
    await waitFor(() => {
      expect(screen.getByTestId('avatar-preview')).toBeInTheDocument()
    })

    // Confirm triggers error from service
    const confirmBtn = screen.getByTestId('confirm-upload-button')
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument()
    })
  })

  it('shows error when service rejects file too large', async () => {
    ;(userService.uploadAvatar as any).mockRejectedValueOnce(
      new Error('File too large. Max 5MB.')
    )

    render(
      <Wrapper>
        <ProfileAvatar showActions />
      </Wrapper>
    )

    const uploadBtn = screen.getByRole('button', { name: /upload/i })
    fireEvent.click(uploadBtn)

    const fileInput = screen.getByTestId('avatar-file-input') as HTMLInputElement
    const file = new File([new Uint8Array(1000)], 'large.png', { type: 'image/png' })
    Object.defineProperty(fileInput, 'files', { value: [file] })
    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(screen.getByTestId('avatar-preview')).toBeInTheDocument()
    })

    const confirmBtn = screen.getByTestId('confirm-upload-button')
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(screen.getByText(/file too large/i)).toBeInTheDocument()
    })
  })
  it('cancels upload without calling service', async () => {
    render(
      <Wrapper>
        <ProfileAvatar showActions />
      </Wrapper>
    )

    const uploadBtn = screen.getByRole('button', { name: /upload/i })
    fireEvent.click(uploadBtn)

    const fileInput = screen.getByTestId('avatar-file-input') as HTMLInputElement
    const file = new File([new Uint8Array([137, 80, 78, 71])], 'avatar.png', {
      type: 'image/png',
    })
    Object.defineProperty(fileInput, 'files', { value: [file] })
    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(screen.getByTestId('avatar-preview')).toBeInTheDocument()
    })

    const cancelBtn = screen.getByTestId('cancel-upload-button')
    fireEvent.click(cancelBtn)

    await waitFor(() => {
      expect(screen.queryByTestId('avatar-preview')).not.toBeInTheDocument()
      expect(userService.uploadAvatar).not.toHaveBeenCalled()
    })
  })
})
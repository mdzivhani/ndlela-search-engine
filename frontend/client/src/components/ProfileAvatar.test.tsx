import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ProfileAvatar from './ProfileAvatar'
import React from 'react'
import { AuthProvider } from '../contexts/AuthContext'
import * as userService from '../services/user.service'

vi.mock('../services/user.service', () => ({
  uploadAvatar: vi.fn(async (_file: File) => ({ url: 'http://example.com/avatar.png' })),
  removeAvatar: vi.fn(async () => {})
}))

// Helper to wrap component with AuthProvider having initial user
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>
}

describe('ProfileAvatar', () => {
  it('renders initial when no profile picture', () => {
    render(
      <Wrapper>
        <ProfileAvatar />
      </Wrapper>
    )
    expect(screen.getByLabelText('avatar-initial')).toBeInTheDocument()
  })

  it('shows preview then confirms upload for valid image', async () => {
    render(
      <Wrapper>
        <ProfileAvatar showActions />
      </Wrapper>
    )
    const file = new File([new Uint8Array([137,80,78,71])], 'avatar.png', { type: 'image/png' })
    fireEvent.click(screen.getByRole('button', { name: /upload/i }))
    const input = screen.getByTestId('avatar-file-input') as HTMLInputElement
    Object.defineProperty(input, 'files', { value: [file] })
    fireEvent.change(input)
    // Preview should appear before confirming
    expect(await screen.findByTestId('avatar-preview')).toBeInTheDocument()
    // Confirm upload
    fireEvent.click(screen.getByTestId('confirm-upload-button'))
    await waitFor(() => {
      expect(userService.uploadAvatar).toHaveBeenCalledTimes(1)
      // initial placeholder removed
      expect(screen.queryByLabelText('avatar-initial')).not.toBeInTheDocument()
    })
  })

  it('shows error for unsupported file type on confirm', async () => {
    // Override mock to throw for unsupported type
    (userService.uploadAvatar as any).mockImplementationOnce(async (file: File) => {
      throw new Error('Unsupported file type. Use JPG or PNG.')
    })
    render(
      <Wrapper>
        <ProfileAvatar showActions />
      </Wrapper>
    )
    const file = new File(['dummy'], 'avatar.gif', { type: 'image/gif' })
    fireEvent.click(screen.getByRole('button', { name: /upload/i }))
    const input = screen.getByTestId('avatar-file-input') as HTMLInputElement
    Object.defineProperty(input, 'files', { value: [file] })
    fireEvent.change(input)
    // Preview appears despite type
    expect(await screen.findByTestId('avatar-preview')).toBeInTheDocument()
    // Confirm triggers error
    fireEvent.click(screen.getByTestId('confirm-upload-button'))
    await waitFor(() => {
      expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument()
    })
  })

  it('cancels preview without uploading', async () => {
    render(
      <Wrapper>
        <ProfileAvatar showActions />
      </Wrapper>
    )
    const file = new File([new Uint8Array([1,2,3])], 'avatar.png', { type: 'image/png' })
    fireEvent.click(screen.getByRole('button', { name: /upload/i }))
    const input = screen.getByTestId('avatar-file-input') as HTMLInputElement
    Object.defineProperty(input, 'files', { value: [file] })
    fireEvent.change(input)
    expect(await screen.findByTestId('avatar-preview')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('cancel-upload-button'))
    await waitFor(() => {
      expect(screen.queryByTestId('avatar-preview')).not.toBeInTheDocument()
      expect(userService.uploadAvatar).not.toHaveBeenCalled()
    })
  })
})

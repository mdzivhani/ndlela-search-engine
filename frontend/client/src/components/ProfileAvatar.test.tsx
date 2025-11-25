import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfileAvatar from './ProfileAvatar'
import React from 'react'
import { AuthProvider } from '../contexts/AuthContext'

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

  it('handles upload of valid image type', async () => {
    render(
      <Wrapper>
        <ProfileAvatar showActions />
      </Wrapper>
    )

    const file = new File([new Uint8Array([137,80,78,71])], 'avatar.png', { type: 'image/png' })
    const uploadBtn = screen.getByRole('button', { name: /upload/i })
    fireEvent.click(uploadBtn)

    const input = screen.getByTestId('avatar-file-input')
    Object.defineProperty(input, 'files', { value: [file] })
    fireEvent.change(input)

    await waitFor(() => {
      // After processing, image should exist (src set). We check placeholder replaced.
      expect(screen.queryByLabelText('avatar-initial')).not.toBeInTheDocument()
    })
  })

  it('rejects unsupported file type', async () => {
    render(
      <Wrapper>
        <ProfileAvatar showActions />
      </Wrapper>
    )
    const file = new File(['dummy'], 'avatar.gif', { type: 'image/gif' })
    const uploadBtn = screen.getByRole('button', { name: /upload/i })
    fireEvent.click(uploadBtn)
    const input = screen.getByTestId('avatar-file-input')
    Object.defineProperty(input, 'files', { value: [file] })
    fireEvent.change(input)
    await waitFor(() => {
      expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument()
    })
  })
})

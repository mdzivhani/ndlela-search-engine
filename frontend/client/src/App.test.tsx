import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from './components/SearchBar'

describe('SearchBar', () => {
  it('calls onSearch when button clicked', () => {
    let calledWith = ''
    render(<SearchBar onSearch={(q) => (calledWith = q)} />)
    const input = screen.getByLabelText('search-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(screen.getByText('Search'))
    expect(calledWith).toBe('test')
  })
})

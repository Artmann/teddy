// @vitest-environment jsdom

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Size } from './size'

describe('Size', () => {
  it('should display bytes for values less than 1024', () => {
    const { container } = render(<Size sizeInBytes={500} />)

    expect(container.textContent).toBe('500 bytes')
  })

  it('should display bytes for exactly 1023 bytes', () => {
    const { container } = render(<Size sizeInBytes={1023} />)

    expect(container.textContent).toBe('1023 bytes')
  })

  it('should display KB for values between 1024 and 1MB', () => {
    const { container } = render(<Size sizeInBytes={1024} />)

    expect(container.textContent).toBe('1.00 KB')
  })

  it('should display KB with proper decimal formatting', () => {
    const { container } = render(<Size sizeInBytes={1536} />)

    expect(container.textContent).toBe('1.50 KB')
  })

  it('should display KB for values just under 1MB', () => {
    const { container } = render(<Size sizeInBytes={1024 * 1024 - 1} />)

    expect(container.textContent).toBe('1024.00 KB')
  })

  it('should display MB for values 1MB and above', () => {
    const { container } = render(<Size sizeInBytes={1024 * 1024} />)

    expect(container.textContent).toBe('1.00 MB')
  })

  it('should display MB with proper decimal formatting', () => {
    const { container } = render(<Size sizeInBytes={1024 * 1024 * 1.5} />)

    expect(container.textContent).toBe('1.50 MB')
  })

  it('should display MB for large values', () => {
    const { container } = render(<Size sizeInBytes={1024 * 1024 * 10.25} />)

    expect(container.textContent).toBe('10.25 MB')
  })

  it('should handle zero bytes', () => {
    const { container } = render(<Size sizeInBytes={0} />)

    expect(container.textContent).toBe('0 bytes')
  })
})

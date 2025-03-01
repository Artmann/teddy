import { describe, expect, it, vi } from 'vitest'

import { sendRequest } from './send'

describe('sendRequest', () => {
  it('handles a plain text response.', async () => {
    const fetch = vi.fn().mockResolvedValue({
      status: 200,
      text: vi.fn().mockResolvedValue('Hello, World!')
    })

    vi.stubGlobal('fetch', fetch)

    const { error, response } = await sendRequest({} as any, {
      url: 'https://example.com'
    })

    expect(error).toBeUndefined()
    expect(response).toEqual({
      body: 'Hello, World!',
      statusCode: 200
    })
  })

  it('handles JSON responses.', async () => {
    const mockContacts = [{ name: 'Alice' }, { name: 'Bob' }]

    const fetch = vi.fn().mockResolvedValue({
      status: 200,
      text: vi
        .fn()
        .mockResolvedValue(JSON.stringify({ contacts: mockContacts }))
    })

    vi.stubGlobal('fetch', fetch)

    const { error, response } = await sendRequest({} as any, {
      url: 'https://example.com'
    })

    expect(error).toBeUndefined()
    expect(response).toEqual({
      body: JSON.stringify({ contacts: mockContacts }),
      statusCode: 200
    })
  })

  it('handles a 404 response.', async () => {
    const fetch = vi.fn().mockResolvedValue({
      status: 404,
      text: vi.fn().mockResolvedValue('Not Found')
    })

    vi.stubGlobal('fetch', fetch)

    const { error, response } = await sendRequest({} as any, {
      url: 'https://example.com'
    })

    expect(error).toBeUndefined()
    expect(response).toEqual({
      body: 'Not Found',
      statusCode: 404
    })
  })

  it('handles errors.', async () => {
    const fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    vi.stubGlobal('fetch', fetch)

    const { error, response } = await sendRequest({} as any, {
      url: 'https://example.com'
    })

    expect(error).toBe('Network error')
    expect(response).toBeUndefined()
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'

import { sendRequest } from './send'

describe('sendRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

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
      headers: [],
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
      headers: [],
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
      headers: [],
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

  it('returns the headers.', async () => {
    const mockContacts = [{ name: 'Alice' }, { name: 'Bob' }]

    const headers = new Headers()

    headers.set('access-control-allow-origin', 'http://localhost:5173')
    headers.set('Origin', '')
    headers.set('Content-type', 'application/json')
    headers.set('keep-alive', 'timeout=5')

    const fetch = vi.fn().mockResolvedValue({
      headers,
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
      headers: [
        { name: 'access-control-allow-origin', value: 'http://localhost:5173' },
        { name: 'content-type', value: 'application/json' },
        { name: 'keep-alive', value: 'timeout=5' },
        { name: 'origin', value: '' }
      ],
      statusCode: 200
    })
  })
})

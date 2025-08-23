import { afterEach, describe, expect, it, vi } from 'vitest'

import { sendRequest } from './send'

// Mock global fetch
const mockFetch = vi.fn()
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true
})

describe('sendRequest', () => {
  afterEach(() => {
    // Clear mocks manually
    mockFetch.mockClear()
  })

  it('handles a plain text response.', async () => {
    mockFetch.mockResolvedValue({
      headers: new Headers(),
      status: 200,
      text: vi.fn().mockResolvedValue('Hello, World!')
    })

    const mockRequest = {
      id: 'test',
      method: 'GET',
      url: 'https://example.com',
      headers: {}
    }

    const { error, response } = await sendRequest({} as any, {
      request: mockRequest
    })

    expect(error).toBeUndefined()
    expect(response).toEqual({
      body: 'Hello, World!',
      headers: [],
      responseTimeInMilliseconds: expect.any(Number),
      sizeInBytes: 13,
      statusCode: 200
    })
  })

  it('handles JSON responses.', async () => {
    const mockContacts = [{ name: 'Alice' }, { name: 'Bob' }]

    mockFetch.mockResolvedValue({
      headers: new Headers(),
      status: 200,
      text: vi
        .fn()
        .mockResolvedValue(JSON.stringify({ contacts: mockContacts }))
    })

    const mockRequest = {
      id: 'test',
      method: 'GET',
      url: 'https://example.com',
      headers: {}
    }

    const { error, response } = await sendRequest({} as any, {
      request: mockRequest
    })

    expect(error).toBeUndefined()
    expect(response).toEqual({
      body: JSON.stringify({ contacts: mockContacts }),
      headers: [],
      responseTimeInMilliseconds: expect.any(Number),
      sizeInBytes: 46,
      statusCode: 200
    })
  })

  it('handles a 404 response.', async () => {
    mockFetch.mockResolvedValue({
      headers: new Headers(),
      status: 404,
      text: vi.fn().mockResolvedValue('Not Found')
    })

    const mockRequest = {
      id: 'test',
      method: 'GET',
      url: 'https://example.com',
      headers: {}
    }

    const { error, response } = await sendRequest({} as any, {
      request: mockRequest
    })

    expect(error).toBeUndefined()
    expect(response).toEqual({
      body: 'Not Found',
      headers: [],
      responseTimeInMilliseconds: expect.any(Number),
      sizeInBytes: 9,
      statusCode: 404
    })
  })

  it('handles errors.', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const mockRequest = {
      id: 'test',
      method: 'GET',
      url: 'https://example.com',
      headers: {}
    }

    const { error, response } = await sendRequest({} as any, {
      request: mockRequest
    })

    expect(error).toBe('Network error')
    expect(response).toBeUndefined()
  })

  it('handles response with content-length header', async () => {
    const headers = new Headers()
    headers.set('content-length', '42')

    mockFetch.mockResolvedValue({
      headers,
      status: 200,
      text: vi.fn().mockResolvedValue('Response with content-length')
    })

    const mockRequest = {
      id: 'test',
      method: 'GET',
      url: 'https://example.com',
      headers: {}
    }

    const { error, response } = await sendRequest({} as any, {
      request: mockRequest
    })

    expect(error).toBeUndefined()
    expect(response).toEqual({
      body: 'Response with content-length',
      headers: [{ name: 'content-length', value: '42' }],
      responseTimeInMilliseconds: expect.any(Number),
      sizeInBytes: 42,
      statusCode: 200
    })
  })

  it('handles error without message', async () => {
    mockFetch.mockRejectedValue({ toString: () => 'Unknown error' })

    const mockRequest = {
      id: 'test',
      method: 'GET',
      url: 'https://example.com',
      headers: {}
    }

    const { error, response } = await sendRequest({} as any, {
      request: mockRequest
    })

    expect(error).toBe('Unknown error')
    expect(response).toBeUndefined()
  })

  it('handles undefined error', async () => {
    mockFetch.mockRejectedValue(undefined)

    const mockRequest = {
      id: 'test',
      method: 'GET',
      url: 'https://example.com',
      headers: {}
    }

    const { error, response } = await sendRequest({} as any, {
      request: mockRequest
    })

    expect(error).toBe('undefined')
    expect(response).toBeUndefined()
  })

  it('returns the headers.', async () => {
    const mockContacts = [{ name: 'Alice' }, { name: 'Bob' }]

    const headers = new Headers()

    headers.set('access-control-allow-origin', 'http://localhost:5173')
    headers.set('Origin', '')
    headers.set('Content-type', 'application/json')
    headers.set('keep-alive', 'timeout=5')

    mockFetch.mockResolvedValue({
      headers,
      status: 200,
      text: vi
        .fn()
        .mockResolvedValue(JSON.stringify({ contacts: mockContacts }))
    })

    const mockRequest = {
      id: 'test',
      method: 'GET',
      url: 'https://example.com',
      headers: {}
    }

    const { error, response } = await sendRequest({} as any, {
      request: mockRequest
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
      responseTimeInMilliseconds: expect.any(Number),
      sizeInBytes: 46,
      statusCode: 200
    })
  })
})

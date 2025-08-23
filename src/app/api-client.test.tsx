// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { ApiClient } from './api-client'
import { SessionProvider } from '../sessions'

// Add types to the window
declare global {
  interface Window {
    api: {
      invoke: {
        loadSession: () => Promise<void>
        saveSession: () => Promise<void>
        sendRequest: () => Promise<void>
      }
    }
  }
}

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    window.api = {
      invoke: {
        loadSession: vi.fn(),
        saveSession: vi.fn(),
        sendRequest: vi.fn()
      }
    }
  })

  it('opens up with the last request', async () => {
    const mockSession = {
      requestLibrary: {
        'tranquil-fog-531': {
          id: 'tranquil-fog-531',
          headers: {},
          method: 'GET',
          response: {
            body: 'Hello, world!',
            headers: [],
            responseTimeInMilliseconds: 125,
            sizeInBytes: 13,
            statusCode: 200
          },
          url: 'https://example.com'
        }
      },
      selectedRequestId: 'tranquil-fog-531'
    }

    window.api.invoke.loadSession.mockResolvedValue(mockSession)

    render(
      <SessionProvider>
        <ApiClient />
      </SessionProvider>
    )

    // Wait for session to load
    await waitFor(() => {
      expect(screen.getByTestId('url-input')).toHaveValue('https://example.com')
    })

    await waitFor(() => {
      expect(screen.getByText('Hello, world!')).toBeInTheDocument()
    })

    expect(screen.getByTestId('response-status-code')).toHaveTextContent('200')
    expect(screen.getByTestId('response-size')).toHaveTextContent('13 bytes')
    expect(screen.getByTestId('response-time')).toHaveTextContent('125ms')
  })

  it('sends a request and shows the response.', async () => {
    const mockSession = {
      requestLibrary: {
        'azure-fog-422': {
          id: 'azure-fog-422',
          headers: {},
          method: 'GET',
          url: ''
        }
      },
      selectedRequestId: 'azure-fog-422'
    }

    window.api.invoke.loadSession.mockResolvedValue(mockSession)

    const json = JSON.stringify(
      {
        contacts: [
          { name: 'Alice', email: 'alice@example.com' },
          { name: 'Bob', email: 'bob@example.com' }
        ]
      },
      null,
      2
    )

    window.api.invoke.sendRequest.mockResolvedValue({
      error: undefined,
      response: {
        body: json,
        headers: [],
        responseTimeInMilliseconds: 250,
        sizeInBytes: json.length,
        statusCode: 200
      }
    })

    render(
      <SessionProvider>
        <ApiClient />
      </SessionProvider>
    )

    const user = userEvent.setup()

    // Wait for session to load
    await waitFor(() => {
      expect(screen.getByTestId('url-input')).toBeInTheDocument()
    })

    await user.type(
      screen.getByTestId('url-input'),
      'https://example.com/api/v1/contacts'
    )

    await user.click(screen.getByText('Send'))

    expect(window.api.invoke.sendRequest).toHaveBeenCalledWith({
      request: expect.objectContaining({
        method: 'GET',
        url: 'https://example.com/api/v1/contacts'
      })
    })

    await waitFor(() => {
      expect(screen.getByText('200')).toBeInTheDocument()
    })

    expect(screen.getByTestId('response-status-code')).toHaveTextContent('200')
    expect(screen.getByTestId('response-size')).toHaveTextContent('160 bytes')
    expect(screen.getByTestId('response-time')).toHaveTextContent('250ms')

    const textContent = screen.getByTestId('response-body').textContent

    expect(textContent).toEqual(json)
  })

  it('should submit request when Enter is pressed in URL input', async () => {
    const mockSession = {
      requestLibrary: {
        'test-123': {
          id: 'test-123',
          headers: {},
          method: 'GET',
          url: 'https://api.test.com'
        }
      },
      selectedRequestId: 'test-123'
    }

    window.api.invoke.loadSession.mockResolvedValue(mockSession)
    window.api.invoke.sendRequest.mockResolvedValue({
      error: undefined,
      response: {
        body: '{"success": true}',
        headers: [],
        responseTimeInMilliseconds: 100,
        sizeInBytes: 17,
        statusCode: 200
      }
    })

    render(
      <SessionProvider>
        <ApiClient />
      </SessionProvider>
    )

    const user = userEvent.setup()

    // Wait for session to load
    await waitFor(() => {
      expect(screen.getByTestId('url-input')).toBeInTheDocument()
    })

    // Focus the URL input and press Enter
    const urlInput = screen.getByTestId('url-input')
    await user.click(urlInput)
    await user.keyboard('{Enter}')

    // Verify request was sent
    expect(window.api.invoke.sendRequest).toHaveBeenCalledWith({
      request: expect.objectContaining({
        method: 'GET',
        url: 'https://api.test.com'
      })
    })

    await waitFor(() => {
      expect(screen.getByText('200')).toBeInTheDocument()
    })
  })

  it('should submit request when Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux) is pressed from anywhere', async () => {
    const mockSession = {
      requestLibrary: {
        'test-456': {
          id: 'test-456',
          headers: {},
          method: 'POST',
          url: 'https://api.example.com/users'
        }
      },
      selectedRequestId: 'test-456'
    }

    window.api.invoke.loadSession.mockResolvedValue(mockSession)
    window.api.invoke.sendRequest.mockResolvedValue({
      error: undefined,
      response: {
        body: '{"id": 123}',
        headers: [],
        responseTimeInMilliseconds: 150,
        sizeInBytes: 11,
        statusCode: 201
      }
    })

    render(
      <SessionProvider>
        <ApiClient />
      </SessionProvider>
    )

    const user = userEvent.setup()

    // Wait for session to load
    await waitFor(() => {
      expect(screen.getByTestId('url-input')).toBeInTheDocument()
    })

    // Press Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux) from anywhere in the app
    await user.keyboard('{Meta>}{Enter}{/Meta}')

    // Verify request was sent
    expect(window.api.invoke.sendRequest).toHaveBeenCalledWith({
      request: expect.objectContaining({
        method: 'POST',
        url: 'https://api.example.com/users'
      })
    })

    await waitFor(() => {
      expect(screen.getByText('201')).toBeInTheDocument()
    })
  })

  it('should not submit when Enter is pressed in URL input while request is sending', async () => {
    const mockSession = {
      requestLibrary: {
        'test-789': {
          id: 'test-789',
          headers: {},
          method: 'GET',
          url: 'https://api.test.com/slow'
        }
      },
      selectedRequestId: 'test-789'
    }

    window.api.invoke.loadSession.mockResolvedValue(mockSession)
    
    // Mock a slow response
    let resolveRequest: any
    const requestPromise = new Promise(resolve => {
      resolveRequest = resolve
    })
    window.api.invoke.sendRequest.mockReturnValue(requestPromise)

    render(
      <SessionProvider>
        <ApiClient />
      </SessionProvider>
    )

    const user = userEvent.setup()

    // Wait for session to load
    await waitFor(() => {
      expect(screen.getByTestId('url-input')).toBeInTheDocument()
    })

    const urlInput = screen.getByTestId('url-input')
    await user.click(urlInput)
    
    // Start first request
    await user.keyboard('{Enter}')
    
    // Wait for sending state
    await waitFor(() => {
      expect(screen.getByText('Sending')).toBeInTheDocument()
    })

    // Try to send another request while first is in progress
    await user.keyboard('{Enter}')

    // Should only have been called once
    expect(window.api.invoke.sendRequest).toHaveBeenCalledTimes(1)

    // Complete the request
    resolveRequest({
      error: undefined,
      response: {
        body: '{"done": true}',
        headers: [],
        responseTimeInMilliseconds: 1000,
        sizeInBytes: 14,
        statusCode: 200
      }
    })
  })

})

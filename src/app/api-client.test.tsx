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
})

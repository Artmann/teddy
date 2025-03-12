// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ApiClient } from './api-client'
import { SessionProvider } from '../sessions'

describe('ApiClient', () => {
  window.api = {
    invoke: {
      saveSession: vi.fn(),
      sendRequest: vi.fn()
    }
  } as any

  it('opens up with the last request', async () => {
    window.session = {
      requestLibrary: {
        'tranquil-fog-531': {
          id: 'tranquil-fog-531',
          headers: {},
          method: 'GET',
          response: {
            body: 'Hello, world!',
            headers: [],
            statusCode: 200
          },
          url: 'https://example.com'
        }
      },
      selectedRequestId: 'tranquil-fog-531'
    }

    render(
      <SessionProvider>
        <ApiClient />
      </SessionProvider>
    )

    expect(screen.getByTestId('url-input')).toHaveValue('https://example.com')

    await waitFor(() => {
      expect(screen.getByText('Hello, world!')).toBeInTheDocument()
    })

    expect(screen.getByTestId('response-status-code')).toHaveTextContent('200')
  })

  it('sends a request and shows the response.', async () => {
    window.session = {
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

    vi.mocked(window.api.invoke.sendRequest).mockResolvedValue({
      error: undefined,
      response: {
        body: json,
        headers: [],
        statusCode: 200
      }
    })

    render(
      <SessionProvider>
        <ApiClient />
      </SessionProvider>
    )

    const user = userEvent.setup()

    await user.type(
      screen.getByTestId('url-input'),
      'https://example.com/api/v1/contacts'
    )

    await user.click(screen.getByText('Send'))

    expect(window.api.invoke.sendRequest).toHaveBeenCalledWith({
      options: {
        method: 'GET'
      },
      url: 'https://example.com/api/v1/contacts'
    })

    await waitFor(() => {
      expect(screen.getByText('200')).toBeInTheDocument()
    })

    expect(screen.getByTestId('response-status-code')).toHaveTextContent('200')

    const textContent = screen.getByTestId('response-body').textContent

    expect(textContent).toEqual(json)
  })
})

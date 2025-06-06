import {
  createContext,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState
} from 'react'

import type { Session } from '.'
import { createNewSession } from '.'
import type { Response } from '../http'
import type { Request } from '../requests'
import { createNewRequest } from '../requests'

interface SessionContextProps {
  selectedRequest: Request
  session: Session
  updateRequest: (requestId: string, request: Partial<Request>) => void
  updateResponse: (requestId: string, response?: Response) => void
  isLoading: boolean
}

export const SessionContext = createContext<SessionContextProps>(
  {} as SessionContextProps
)

export function SessionProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        console.log('Loading session via IPC...')
        const loadedSession = await window.api.invoke.loadSession()
        
        if (loadedSession) {
          console.log('Session loaded:', loadedSession)
          
          // Ensure requestLibrary exists and is an object
          if (!loadedSession.requestLibrary || typeof loadedSession.requestLibrary !== 'object') {
            loadedSession.requestLibrary = {}
          }
          
          // Ensure session has a selected request
          if (!loadedSession.selectedRequestId && Object.keys(loadedSession.requestLibrary).length > 0) {
            // Select the first available request if no request is selected
            loadedSession.selectedRequestId = Object.keys(loadedSession.requestLibrary)[0]
          } else if (!loadedSession.selectedRequestId) {
            // If no requests exist, create a new one
            const newRequest = createNewRequest()
            loadedSession.requestLibrary[newRequest.id] = newRequest
            loadedSession.selectedRequestId = newRequest.id
          }
          setSession(loadedSession)
        } else {
          console.log('No session found, creating new one')
          const newSession = createNewSession()
          setSession(newSession)
          // Save the new session
          await window.api.invoke.saveSession(newSession)
        }
      } catch (error) {
        console.error('Failed to load session:', error)
        // Fallback to creating a new session
        const newSession = createNewSession()
        setSession(newSession)
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  const updateRequest = (
    requestId: string,
    partialRequest: Partial<Request>
  ): void => {
    setSession((prevSession) => {
      if (!prevSession) return prevSession
      return {
        ...prevSession,
        requestLibrary: {
          ...prevSession.requestLibrary,
          [requestId]: {
            ...prevSession.requestLibrary[requestId],
            ...partialRequest
          }
        }
      }
    })
  }

  const updateResponse = (requestId: string, response?: Response): void => {
    setSession((prevSession) => {
      if (!prevSession) return prevSession
      return {
        ...prevSession,
        requestLibrary: {
          ...prevSession.requestLibrary,
          [requestId]: {
            ...prevSession.requestLibrary[requestId],
            response
          }
        }
      }
    })
  }

  useEffect(
    function persistSession() {
      if (session && !isLoading) {
        console.log('Persisting session', session)
        window.api.invoke.saveSession(session)
      }
    },
    [session, isLoading]
  )

  // Show loading state while session is being loaded
  if (isLoading || !session) {
    return (
      <div className="full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session.selectedRequestId) {
    throw new Error('No selected request ID available.')
  }

  console.log('Current session:', session)

  const selectedRequest = session.requestLibrary[session.selectedRequestId]

  const context: SessionContextProps = {
    selectedRequest,
    session,
    updateRequest,
    updateResponse,
    isLoading: false // Loading is complete at this point
  }

  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  )
}

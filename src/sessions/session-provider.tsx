import {
  createContext,
  ReactElement,
  ReactNode,
  useEffect,
  useState
} from 'react'
import invariant from 'tiny-invariant'

import { Session } from '.'
import { Response } from '../http'
import { Request } from '../requests'

interface SessionContextProps {
  selectedRequest: Request
  session: Session
  updateResponse: (requestId: string, response?: Response) => void
}

export const SessionContext = createContext<SessionContextProps>(
  {} as SessionContextProps
)

export function SessionProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const [session, setSession] = useState<Session>(window.session)

  console.log(window.session)

  invariant(
    Boolean(session),
    'There is no session data available. Did you forget to pass it to the window object?'
  )

  if (!session) {
    throw new Error('No session data available.')
  }

  if (!session.selectedRequestId) {
    throw new Error('No selected request ID available.')
  }

  console.log(session)

  const selectedRequest = session.requestLibrary[session.selectedRequestId]

  const updateResponse = (requestId: string, response?: Response): void => {
    setSession((prevSession) => ({
      ...prevSession,
      requestLibrary: {
        ...prevSession.requestLibrary,
        [requestId]: {
          ...prevSession.requestLibrary[requestId],
          response
        }
      }
    }))
  }

  useEffect(
    function persistSession() {
      window.api.invoke.saveSession(session)
    },
    [session]
  )

  const context: SessionContextProps = {
    selectedRequest,
    session,
    updateResponse
  }

  return (
    <SessionContext.Provider value={context}>
      {children}
    </SessionContext.Provider>
  )
}

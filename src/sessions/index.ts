import { createNewRequest, Request } from '../requests'

export * from './session-provider'

export class Session {
  public requestLibrary: Record<string, Request> = {}
  public selectedRequestId?: string
}

export function createNewSession(): Session {
  const session = new Session()
  const request = createNewRequest()

  session.requestLibrary[request.id] = request
  session.selectedRequestId = request.id

  return session
}


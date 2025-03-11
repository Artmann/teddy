import Store from 'electron-store'

import { Request, Response } from '../requests/send'

export interface Session {
  lastRequest?: Request
  lastResponse?: Response
}

interface StoredData {
  session: Session
}

const store = new Store<StoredData>({
  name: 'teddy-data',
  defaults: {
    session: {
      lastRequest: undefined,
      lastResponse: undefined
    }
  }
})

export function saveSession(request: Request, response?: Response): void {
  const session: Session = {
    lastRequest: request,
    lastResponse: response
  }

  store.set('session', session)
}

export function loadLastSession(): Session {
  return store.get('session')
}
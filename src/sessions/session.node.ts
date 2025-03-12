import { IpcMainInvokeEvent } from 'electron'
import Store from 'electron-store'

import { Session } from '.'

interface StoredData {
  session: Session
}

const store = new Store<StoredData>({
  name: 'teddy-data',
})

export function loadLastSession(): Session {
  console.log('Loading last session...')

  return store.get('session')
}

export const session = {
  saveSession: async (_: IpcMainInvokeEvent, session: Session): Promise<string | undefined> => {
    try {
      store.set('session', session)

      return undefined
    } catch (error: any) {
      console.error('Failed to save the session:', error)

      return error.message
    }
  }
}

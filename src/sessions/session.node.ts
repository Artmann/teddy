import Store from 'electron-store'

import type { Session } from '.'

interface StoredData {
  session: Session
}

const store = new Store<StoredData>({
  name: process.env.NODE_ENV === 'test' ? 'teddy-data-test' : 'teddy-data'
})

export function loadLastSession(): Session | undefined {
  console.log('Loading last session...')

  const session = store.get('session')
  console.log('Loaded session:', session)
  
  return session
}

export const session = {
  loadSession: async (): Promise<Session | undefined> => {
    try {
      console.log('Loading session via IPC...')
      const session = loadLastSession()
      console.log('Loaded session via IPC:', session)
      return session
    } catch (error: any) {
      console.error('Failed to load the session:', error)
      return undefined
    }
  },

  saveSession: async (
    session: Session
  ): Promise<string | undefined> => {
    try {
      store.set('session', session)

      return undefined
    } catch (error: any) {
      console.error('Failed to save the session:', error)

      return error.message
    }
  }
}

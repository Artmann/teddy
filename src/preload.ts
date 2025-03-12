import { contextBridge } from 'electron'

import { exposeApiToGlobalWindow } from './ipcs'
import { Session } from './sessions'

const { key, api } = exposeApiToGlobalWindow({
  exposeAll: true // expose handlers, invokers and removers
})

declare global {
  interface Window {
    [key]: typeof api
    session: Session
  }
}

try {
  const sessionArg = process.argv.find(arg => arg.startsWith('--session-data='))

  if (sessionArg) {
    const sessionString = sessionArg.replace('--session-data=', '')

    const sessionData = JSON.parse(sessionString)

    contextBridge.exposeInMainWorld('session', sessionData)
  }
} catch (e) {
  console.error('Failed to parse session data:', e)
}




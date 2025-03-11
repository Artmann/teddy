import { contextBridge } from 'electron'

import { exposeApiToGlobalWindow } from './ipcs'
import { RequestDto } from './sessions'
import { Response } from './requests'

const { key, api } = exposeApiToGlobalWindow({
  exposeAll: true // expose handlers, invokers and removers
})

declare global {
  interface Window {
    [key]: typeof api
    session: typeof sessionData
  }
}

// Parse session data from process arguments
let sessionData: { lastRequest?: RequestDto; lastResponse?: Response } = { lastRequest: undefined, lastResponse: undefined }

try {
  const sessionArg = process.argv.find(arg => arg.startsWith('--session-data='))

  if (sessionArg) {
    const sessionString = sessionArg.replace('--session-data=', '')

    sessionData = JSON.parse(sessionString)

    contextBridge.exposeInMainWorld('session', sessionData)
  }
} catch (e) {
  console.error('Failed to parse session data:', e)
}




import { createInterprocess } from 'interprocess'

import { requests } from '../http'
import { windowHandlers } from '../window'
import { session } from '../sessions/session.node'

export const { ipcMain, ipcRenderer, exposeApiToGlobalWindow } =
  createInterprocess({
    main: {
      ...requests,
      ...session,
      ...windowHandlers
    },

    renderer: {
      async getPong(_, data: 'pong') {
        const message = `from main: ${data} on renderer process`

        console.log(message)

        return message
      }
    }
  })

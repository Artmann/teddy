import { createInterprocess } from 'interprocess'

import { requests } from '../requests'
import { windowHandlers } from '../window'

export const { ipcMain, ipcRenderer, exposeApiToGlobalWindow } =
  createInterprocess({
    main: {
      async getPing(_, data: 'ping') {
        const message = `from renderer: ${data} on main process`

        console.log(message)

        return message
      },
      ...requests,
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

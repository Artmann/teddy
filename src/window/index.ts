import { getCurrentWindow } from '@electron/remote/main'

export const windowHandlers = {
  async maximizeWindow(): Promise<void> {
    getCurrentWindow().maximize()
  },
  async minimizeWindow(): Promise<void> {
    getCurrentWindow().minimize()
  },
  async restoreWindow(): Promise<void> {
    getCurrentWindow().restore()
  },
  async closeWindow(): Promise<void> {
    getCurrentWindow().close()
  }
}
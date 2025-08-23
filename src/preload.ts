import { exposeApiToGlobalWindow } from './ipcs'
import { contextBridge, ipcRenderer } from 'electron'

const { key, api } = exposeApiToGlobalWindow({
  exposeAll: true // expose handlers, invokers and removers
})

// Expose window controls to renderer
contextBridge.exposeInMainWorld('windowControls', {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized')
})

declare global {
  interface Window {
    [key]: typeof api
    windowControls: {
      minimize: () => Promise<void>
      maximize: () => Promise<boolean>
      close: () => Promise<void>
      isMaximized: () => Promise<boolean>
    }
  }
}

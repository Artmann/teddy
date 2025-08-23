import { app, BrowserWindow, Menu, ipcMain as electronIpcMain } from 'electron'
import fs from 'fs'
import path from 'path'

import { ipcMain } from './ipcs'
import { createNewSession } from './sessions'
import { loadLastSession } from './sessions/session.node'
import Store from 'electron-store'

const { handle } = ipcMain

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (process.platform === 'win32') {
  try {
    // Using dynamic import to handle optional dependency
    import('electron-squirrel-startup')
      .then((squirrelStartup) => {
        if (squirrelStartup.default) {
          app.quit()
        }
      })
      .catch(() => {
        // Module not found in production build, which is fine for non-Windows platforms
        console.log('electron-squirrel-startup not found, continuing...')
      })
  } catch (e) {
    console.log('electron-squirrel-startup not found, continuing...')
  }
}

function getObjectMethods(obj: any): string[] {
  return Object.getOwnPropertyNames(obj).filter(
    (key) => typeof obj[key] === 'function'
  )
}

const handleOnReady = () => {
  // Initialize session storage if it doesn't exist
  const lastSession = loadLastSession()
  if (!lastSession) {
    const session = createNewSession()
    console.log('Creating new session on startup:', session)

    // Save the new session to storage
    const store = new Store({ name: 'teddy-data' })
    store.set('session', session)
  }

  const iconPath = path.join(process.cwd(), 'icon.png')
  console.log('Icon path:', iconPath)
  console.log('Icon exists:', fs.existsSync(iconPath))

  const mainWindow = new BrowserWindow({
    backgroundColor: '#282C34',
    darkTheme: true,
    frame: false,
    height: 900,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    },
    width: 1600
  })

  Menu.setApplicationMenu(null)

  const methodNames = getObjectMethods(handle)

  methodNames.forEach((methodName) => {
    // @ts-ignore
    handle[methodName].call(handle)
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    )
  }

  // Only open dev tools in development
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.webContents.openDevTools()
  }

  // Window control IPC handlers
  electronIpcMain.handle('window-minimize', () => {
    mainWindow.minimize()
  })

  electronIpcMain.handle('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
    return mainWindow.isMaximized()
  })

  electronIpcMain.handle('window-close', () => {
    mainWindow.close()
  })

  electronIpcMain.handle('window-is-maximized', () => {
    return mainWindow.isMaximized()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', handleOnReady)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    handleOnReady()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

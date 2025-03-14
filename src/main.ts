import { app, BrowserWindow, Menu } from 'electron'
import path from 'path'

import { ipcMain } from './ipcs'
import { loadLastSession } from './sessions'

const { handle } = ipcMain

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

function getObjectMethods(obj: any): string[] {
  return Object.getOwnPropertyNames(obj).filter(
    (key) => typeof obj[key] === 'function'
  )
}

const handleOnReady = () => {
  const lastSession = loadLastSession()

  const mainWindow = new BrowserWindow({
    backgroundColor: '#282C34',
    darkTheme: true,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      additionalArguments: [
        `--session-data=${JSON.stringify(lastSession)}`
      ]
    },
    width: 1200
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

  mainWindow.webContents.openDevTools()
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
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

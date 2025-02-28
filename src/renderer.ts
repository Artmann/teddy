/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import { createRoot } from 'react-dom/client'
import { createElement } from 'react'

import { App } from './app/App'

import './index.css'
import './app/app.css'
import { ipcRenderer } from 'electron'

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite.'
)

ipcRenderer.invoke('foo').then(console.log)

const container = document.getElementById('app')

if (!container) {
  throw new Error('Container not found. Make sure you have a div with id="app" in your index.html')
}

const root = createRoot(container)

root.render(createElement(App, {}))
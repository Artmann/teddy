import { createRoot } from 'react-dom/client'
import { createElement } from 'react'

import { App } from './app/App'

import './index.css'
import './app/app.css'

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite.'
)

window.api.invoke.sendRequest('foo').then(console.log)

const container = document.getElementById('app')

if (!container) {
  throw new Error(
    'Container not found. Make sure you have a div with id="app" in your index.html'
  )
}

const root = createRoot(container)

root.render(createElement(App, {}))

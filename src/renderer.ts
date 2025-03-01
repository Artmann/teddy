import { createRoot } from 'react-dom/client'
import { createElement } from 'react'

import { App } from './app'

import './index.css'
import './app/global.css'

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite.'
)

const container = document.getElementById('app')

if (!container) {
  throw new Error(
    'Container not found. Make sure you have a div with id="app" in your index.html'
  )
}

const root = createRoot(container)

root.render(createElement(App, {}))

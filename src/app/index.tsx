import { StrictMode } from 'react'

import { ApiClient } from './api-client'

export function App() {
  return (
    <StrictMode>
      <main className="text-sm w-full h-screen overflow-hidden">
        <ApiClient />
      </main>
    </StrictMode>
  )
}

import { StrictMode } from 'react'

import { ApiClient } from './api-client'
import { SessionProvider } from '@/sessions'

export function App() {
  return (
    <StrictMode>
      <SessionProvider>
        <main className="text-sm w-full h-screen overflow-hidden">
          <ApiClient />
        </main>
      </SessionProvider>
    </StrictMode>
  )
}

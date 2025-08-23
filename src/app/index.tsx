import { StrictMode } from 'react'

import { ApiClient } from './api-client'
import { Header } from './components/header'
import { SessionProvider } from '@/sessions'

export function App() {
  return (
    <StrictMode>
      <SessionProvider>
        <div className="text-sm w-full h-screen overflow-hidden flex flex-col">
          <Header />
          <main className="flex-1 min-h-0">
            <ApiClient />
          </main>
        </div>
      </SessionProvider>
    </StrictMode>
  )
}

import { memo, ReactElement, useEffect, useState } from 'react'
import { Minus, Square, X, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export const Header = memo(function Header({
  className
}: HeaderProps): ReactElement {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    // Detect platform
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)

    // Check initial maximized state
    window.windowControls?.isMaximized().then(setIsMaximized)
  }, [])

  const handleMinimize = async () => {
    console.log('Minimize clicked, windowControls:', window.windowControls)
    try {
      await window.windowControls?.minimize()
    } catch (error) {
      console.error('Error minimizing window:', error)
    }
  }

  const handleMaximize = async () => {
    console.log('Maximize clicked, windowControls:', window.windowControls)
    try {
      const maximized = await window.windowControls?.maximize()
      setIsMaximized(maximized)
    } catch (error) {
      console.error('Error maximizing window:', error)
    }
  }

  const handleClose = async () => {
    console.log('Close clicked, windowControls:', window.windowControls)
    try {
      await window.windowControls?.close()
    } catch (error) {
      console.error('Error closing window:', error)
    }
  }

  const MacWindowControls = () => (
    <div
      className="flex items-center gap-2 pl-4 group"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <button
        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center"
        title="Close"
        type="button"
        onClick={handleClose}
      >
        <X className="w-2 h-2 opacity-0 group-hover:opacity-100 text-red-900 transition-opacity duration-150" />
      </button>
      <button
        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center"
        title="Minimize"
        type="button"
        onClick={handleMinimize}
      >
        <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100 text-yellow-900 transition-opacity duration-150" />
      </button>
      <button
        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center"
        title={isMaximized ? 'Restore' : 'Maximize'}
        type="button"
        onClick={handleMaximize}
      >
        {isMaximized ? (
          <Square className="w-1.5 h-1.5 opacity-0 group-hover:opacity-100 text-green-900 transition-opacity duration-150" />
        ) : (
          <Maximize2 className="w-1.5 h-1.5 opacity-0 group-hover:opacity-100 text-green-900 transition-opacity duration-150" />
        )}
      </button>
    </div>
  )

  const WindowsWindowControls = () => (
    <div className="flex items-center h-full">
      <button
        className="h-full px-4 hover:bg-white/10 transition-colors flex items-center justify-center"
        title="Minimize"
        type="button"
        onClick={handleMinimize}
      >
        <Minus className="w-4 h-4 text-white/80" />
      </button>
      <button
        className="h-full px-4 hover:bg-white/10 transition-colors flex items-center justify-center"
        title={isMaximized ? 'Restore' : 'Maximize'}
        type="button"
        onClick={handleMaximize}
      >
        {isMaximized ? (
          <div className="w-3.5 h-3.5 border border-white/80 relative">
            <div className="absolute -top-0.5 -left-0.5 w-3.5 h-3.5 border border-white/80 bg-[#282C34]" />
          </div>
        ) : (
          <Square className="w-3.5 h-3.5 text-white/80" />
        )}
      </button>
      <button
        className="h-full px-4 hover:bg-red-600 transition-colors flex items-center justify-center"
        title="Close"
        type="button"
        onClick={handleClose}
      >
        <X className="w-4 h-4 text-white/80" />
      </button>
    </div>
  )

  return (
    <header
      className={cn(
        'h-8 bg-[#282C34] border-b border-border flex items-center justify-between select-none',
        'drag-region',
        className
      )}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {isMac ? (
        <>
          <MacWindowControls />
          <div className="flex-1 flex items-center justify-center">
            <span className="text-white/60 text-sm font-medium">🧸</span>
          </div>
          <div className="w-20" /> {/* Spacer for balance */}
        </>
      ) : (
        <>
          <div className="flex items-center pl-4">
            <span className="text-white/60 text-sm font-medium">🧸</span>
          </div>
          <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
            <WindowsWindowControls />
          </div>
        </>
      )}
    </header>
  )
})

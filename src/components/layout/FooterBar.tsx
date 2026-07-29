import { useCallback, useEffect, useState } from 'react'
import { LineChart } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

function FooterBar() {
  const [now, setNow] = useState(new Date())
  const [focusMode, setFocusMode] = useState(false)

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleFullscreenChange() {
      setFocusMode(document.fullscreenElement !== null)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleFocusModeChange = useCallback((next: boolean) => {
    if (next) {
      document.documentElement.requestFullscreen?.().catch(() => {
        setFocusMode(false)
      })
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
    }
    setFocusMode(next)
  }, [])

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <footer className="flex items-center justify-between gap-4 border-t border-glass-border bg-glass px-6 py-3 text-sm text-ink-secondary backdrop-blur-glass">
      <span className="hidden sm:inline">{timezone}</span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xl font-semibold text-ink">{timeFormatter.format(now)}</span>
        <span>{dateFormatter.format(now)}</span>
      </div>
      <div className="flex items-center gap-3">
        <LineChart className="h-4 w-4" strokeWidth={2} />
        <span className="hidden sm:inline">Focus Mode</span>
        <Switch checked={focusMode} onCheckedChange={handleFocusModeChange} ariaLabel="Toggle focus mode" />
      </div>
    </footer>
  )
}

export { FooterBar }

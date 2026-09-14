import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pause, Play, RotateCcw, Volume2, VolumeX, Maximize } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { useAuth } from '@/hooks/useAuth'
import { useFocusTimer } from '@/hooks/useFocusTimer'
import { FOCUS_SESSION_EVENT, listFocusSessions } from '@/lib/focus-sessions'
import { cn } from '@/lib/utils'

function formatTime(totalSeconds: number, showMs = false, ms = 0) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const base = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  if (!showMs) return { main: base, ms: '' }
  return { main: base, ms: `.${ms.toString().padStart(3, '0')}` }
}

function formatSessionTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function useAmbientNoise(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)

  useEffect(() => {
    if (!enabled) {
      sourceRef.current?.stop()
      sourceRef.current = null
      contextRef.current?.close().catch(() => {})
      contextRef.current = null
      return undefined
    }

    const AudioContextClass = window.AudioContext
    const ctx = new AudioContextClass()
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.6
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900

    const gain = ctx.createGain()
    gain.gain.value = 0.05

    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start()

    contextRef.current = ctx
    sourceRef.current = source

    return () => {
      source.stop()
      ctx.close().catch(() => {})
    }
  }, [enabled])
}

function FocusTimer() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const {
    mode,
    secondsLeft,
    milliseconds,
    running,
    focusMinutes,
    breakMinutes,
    totalSeconds,
    toggleRunning,
    switchMode,
    setDurations,
    reset,
  } = useFocusTimer()

  const showMs = profile?.showMilliseconds !== false

  const [ambientOn, setAmbientOn] = useState(false)
  const [historyKey, setHistoryKey] = useState(0)

  useAmbientNoise(ambientOn)

  useEffect(() => {
    function handleUpdate() {
      setHistoryKey((current) => current + 1)
    }
    window.addEventListener(FOCUS_SESSION_EVENT, handleUpdate)
    return () => window.removeEventListener(FOCUS_SESSION_EVENT, handleUpdate)
  }, [])

  const sessions = useMemo(
    () => (user ? listFocusSessions(user.$id) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, historyKey],
  )

  const todayMinutes = sessions
    .filter(
      (session) =>
        session.mode === 'focus' &&
        new Date(session.completedAt).toDateString() === new Date().toDateString(),
    )
    .reduce((sum, session) => sum + session.durationMinutes, 0)

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
      <GlassCard className="flex flex-col items-center gap-6 p-8">
        <div className="flex items-center gap-1 rounded-control border border-glass-border bg-tint/5 p-1 text-sm">
          <button
            type="button"
            onClick={() => switchMode('focus')}
            className={cn(
              'rounded-[10px] px-5 py-2 text-ink-secondary transition-colors',
              mode === 'focus' && 'bg-tint/10 text-ink',
            )}
          >
            Focus
          </button>
          <button
            type="button"
            onClick={() => switchMode('break')}
            className={cn(
              'rounded-[10px] px-5 py-2 text-ink-secondary transition-colors',
              mode === 'break' && 'bg-tint/10 text-ink',
            )}
          >
            Break
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/app/ultra-focus')}
          className="w-full flex items-center justify-center gap-2 rounded-control border border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-3 text-sm font-medium text-primary transition-all hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/15 hover:to-secondary/15"
          aria-label="Enter ultra focus mode"
        >
          <Maximize className="h-4 w-4" strokeWidth={2} />
          Ultra Focus Mode
        </button>

        <ProgressRing progress={progress} size={260} strokeWidth={14}>
          <div className="text-center">
            <p className="font-mono text-4xl font-semibold leading-none text-ink">
              {formatTime(secondsLeft, showMs, milliseconds).main}
            </p>
            {showMs && (
              <p className="font-mono text-lg leading-none text-ink-secondary">
                {formatTime(secondsLeft, showMs, milliseconds).ms}
              </p>
            )}
            <p className="mt-1 text-xs text-ink-secondary">
              {running
                ? mode === 'focus'
                  ? 'Focusing...'
                  : 'On a break...'
                : 'Ready when you are'}
            </p>
          </div>
        </ProgressRing>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset timer"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-glass-border bg-tint/5 text-ink-secondary transition-colors hover:text-primary"
          >
            <RotateCcw className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={toggleRunning}
            aria-label={running ? 'Pause focus timer' : 'Start focus timer'}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-glow transition-transform hover:scale-105"
          >
            {running ? (
              <Pause className="h-7 w-7" strokeWidth={2} />
            ) : (
              <Play className="h-7 w-7 translate-x-0.5" strokeWidth={2} />
            )}
          </button>
          <button
            type="button"
            onClick={() => setAmbientOn((current) => !current)}
            aria-label={ambientOn ? 'Disable ambient sound' : 'Enable ambient sound'}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full border border-glass-border bg-tint/5 text-ink-secondary transition-colors hover:text-primary',
              ambientOn && 'border-primary text-primary',
            )}
          >
            {ambientOn ? (
              <Volume2 className="h-5 w-5" strokeWidth={2} />
            ) : (
              <VolumeX className="h-5 w-5" strokeWidth={2} />
            )}
          </button>
        </div>

        <div className="flex w-full max-w-sm items-center justify-between gap-6 border-t border-glass-border pt-6 text-sm">
          <label className="flex flex-1 flex-col gap-1.5 text-ink-secondary">
            Focus (min)
            <input
              type="number"
              min={1}
              max={180}
              value={focusMinutes}
              disabled={running}
              onChange={(event) =>
                setDurations(Math.max(1, Number(event.target.value)), breakMinutes)
              }
              className="rounded-control border border-glass-border bg-tint/5 px-3 py-2 text-ink outline-none focus:border-primary disabled:opacity-50"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1.5 text-ink-secondary">
            Break (min)
            <input
              type="number"
              min={1}
              max={60}
              value={breakMinutes}
              disabled={running}
              onChange={(event) =>
                setDurations(focusMinutes, Math.max(1, Number(event.target.value)))
              }
              className="rounded-control border border-glass-border bg-tint/5 px-3 py-2 text-ink outline-none focus:border-primary disabled:opacity-50"
            />
          </label>
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Today</p>
          <p className="font-mono text-3xl font-semibold text-ink">
            {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
          </p>
          <p className="text-xs text-ink-secondary">Focused time logged today</p>
        </GlassCard>

        <GlassCard className="space-y-3 p-5">
          <h2 className="font-heading text-sm font-semibold text-ink">Session History</h2>
          {sessions.length === 0 ? (
            <p className="text-sm text-ink-secondary">
              No sessions yet. Start your first focus session!
            </p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {sessions.slice(0, 20).map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between gap-2 rounded-control border border-glass-border bg-tint/5 px-3 py-2 text-sm"
                >
                  <span
                    className={cn(
                      'font-medium',
                      session.mode === 'focus' ? 'text-primary' : 'text-ink-secondary',
                    )}
                  >
                    {session.mode === 'focus' ? 'Focus' : 'Break'}
                  </span>
                  <span className="text-ink-secondary">{session.durationMinutes}m</span>
                  <span className="text-xs text-muted">
                    {formatSessionTime(session.completedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

export default FocusTimer

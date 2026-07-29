import { useEffect, useMemo, useRef, useState } from 'react'
import { AlarmClock, Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const WORLD_CLOCKS = [
  { label: 'New York', timeZone: 'America/New_York' },
  { label: 'London', timeZone: 'Europe/London' },
  { label: 'Dubai', timeZone: 'Asia/Dubai' },
  { label: 'Tokyo', timeZone: 'Asia/Tokyo' },
  { label: 'Sydney', timeZone: 'Australia/Sydney' },
]

function playBeep() {
  const ctx = new AudioContext()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = 880
  gain.gain.value = 0.2
  oscillator.connect(gain).connect(ctx.destination)
  oscillator.start()
  oscillator.stop(ctx.currentTime + 0.5)
  oscillator.onended = () => ctx.close().catch(() => {})
}

function formatStopwatch(ms: number) {
  const totalCentis = Math.floor(ms / 10)
  const minutes = Math.floor(totalCentis / 6000)
  const seconds = Math.floor((totalCentis % 6000) / 100)
  const centis = totalCentis % 100
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`
}

function LocalTimeCard({ now }: { now: Date }) {
  const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const dateFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <GlassCard className="space-y-2 p-8 text-center">
      <p className="text-sm text-ink-secondary">{timezone}</p>
      <p className="font-mono text-6xl font-semibold text-ink">{timeFormatter.format(now)}</p>
      <p className="text-sm text-ink-secondary">{dateFormatter.format(now)}</p>
    </GlassCard>
  )
}

function WorldClockCard({ now }: { now: Date }) {
  return (
    <GlassCard className="space-y-4 p-5">
      <h2 className="font-heading text-sm font-semibold text-ink">World Clock</h2>
      <ul className="space-y-2.5">
        {WORLD_CLOCKS.map((city) => {
          const formatter = new Intl.DateTimeFormat(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: city.timeZone,
          })
          return (
            <li key={city.timeZone} className="flex items-center justify-between rounded-control border border-glass-border bg-tint/5 px-3 py-2">
              <span className="text-sm text-ink-secondary">{city.label}</span>
              <span className="font-mono text-sm font-medium text-ink">{formatter.format(now)}</span>
            </li>
          )
        })}
      </ul>
    </GlassCard>
  )
}

function StopwatchCard() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const startRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return undefined

    startRef.current = Date.now() - elapsed
    function tick() {
      setElapsed(Date.now() - startRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  return (
    <GlassCard className="space-y-4 p-5">
      <h2 className="font-heading text-sm font-semibold text-ink">Stopwatch</h2>
      <p className="text-center font-mono text-4xl font-semibold text-ink">{formatStopwatch(elapsed)}</p>
      <div className="flex justify-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setElapsed(0)
            setRunning(false)
          }}
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2} />
          Reset
        </Button>
        <Button size="sm" onClick={() => setRunning((current) => !current)}>
          {running ? <Pause className="h-4 w-4" strokeWidth={2} /> : <Play className="h-4 w-4" strokeWidth={2} />}
          {running ? 'Pause' : 'Start'}
        </Button>
      </div>
    </GlassCard>
  )
}

function CountdownCard() {
  const [inputMinutes, setInputMinutes] = useState(5)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return undefined
    const timeout = window.setTimeout(() => {
      setSecondsLeft((current) => {
        const next = (current ?? 1) - 1
        if (next <= 0) {
          setDone(true)
          playBeep()
          return 0
        }
        return next
      })
    }, 1000)
    return () => window.clearTimeout(timeout)
  }, [secondsLeft])

  const running = secondsLeft !== null && secondsLeft > 0
  const display = secondsLeft !== null ? `${Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}` : '--:--'

  return (
    <GlassCard className="space-y-4 p-5">
      <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-ink">
        <TimerIcon className="h-4 w-4" strokeWidth={2} />
        Countdown Timer
      </h2>
      <p className={cn('text-center font-mono text-4xl font-semibold text-ink', done && 'text-success')}>
        {done ? "Time's up!" : display}
      </p>
      {secondsLeft === null ? (
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={180}
            value={inputMinutes}
            onChange={(event) => setInputMinutes(Math.max(1, Number(event.target.value)))}
            className="w-full rounded-control border border-glass-border bg-tint/5 px-3 py-2 text-sm text-ink outline-none focus:border-primary"
          />
          <Button
            size="sm"
            onClick={() => {
              setDone(false)
              setSecondsLeft(inputMinutes * 60)
            }}
          >
            Start
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-center"
          onClick={() => {
            setSecondsLeft(null)
            setDone(false)
          }}
        >
          {running ? 'Cancel' : 'Reset'}
        </Button>
      )}
    </GlassCard>
  )
}

function AlarmCard({ now }: { now: Date }) {
  const [alarmTime, setAlarmTime] = useState('')
  const [armed, setArmed] = useState(false)
  const [ringing, setRinging] = useState(false)
  const firedRef = useRef(false)

  useEffect(() => {
    if (!armed || !alarmTime) return
    const [hh, mm] = alarmTime.split(':').map(Number)
    if (now.getHours() === hh && now.getMinutes() === mm) {
      if (!firedRef.current) {
        firedRef.current = true
        setRinging(true)
        playBeep()
      }
    } else {
      firedRef.current = false
    }
  }, [now, armed, alarmTime])

  return (
    <GlassCard className="space-y-4 p-5">
      <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-ink">
        <AlarmClock className="h-4 w-4" strokeWidth={2} />
        Alarm
      </h2>

      {ringing ? (
        <div className="space-y-3 rounded-control border border-primary/40 bg-primary/10 p-3 text-center">
          <p className="font-medium text-ink">⏰ It&apos;s {alarmTime}!</p>
          <Button
            size="sm"
            className="w-full justify-center"
            onClick={() => {
              setRinging(false)
              setArmed(false)
            }}
          >
            Dismiss
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="time"
            value={alarmTime}
            disabled={armed}
            onChange={(event) => setAlarmTime(event.target.value)}
            className="w-full rounded-control border border-glass-border bg-tint/5 px-3 py-2 text-sm text-ink outline-none focus:border-primary disabled:opacity-50"
          />
          <Button
            size="sm"
            variant={armed ? 'secondary' : 'primary'}
            disabled={!alarmTime}
            onClick={() => setArmed((current) => !current)}
          >
            {armed ? 'Cancel' : 'Set'}
          </Button>
        </div>
      )}
      {armed && !ringing ? <p className="text-xs text-ink-secondary">Alarm set for {alarmTime}. Keep this tab open.</p> : null}
    </GlassCard>
  )
}

function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const memoNow = useMemo(() => now, [now])

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <LocalTimeCard now={memoNow} />
      <div className="grid gap-6 md:grid-cols-2">
        <WorldClockCard now={memoNow} />
        <StopwatchCard />
        <CountdownCard />
        <AlarmCard now={memoNow} />
      </div>
    </div>
  )
}

export default Clock

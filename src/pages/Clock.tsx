import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlarmClock,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Timer as TimerIcon,
  Trash2,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAlarm } from '@/hooks/useAlarm'

const WORLD_CLOCKS = [
  { label: 'New York', timeZone: 'America/New_York' },
  { label: 'London', timeZone: 'Europe/London' },
  { label: 'Dubai', timeZone: 'Asia/Dubai' },
  { label: 'Tokyo', timeZone: 'Asia/Tokyo' },
  { label: 'Sydney', timeZone: 'Australia/Sydney' },
]

function playCountdownBeep() {
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 880
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.03)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.65)
  osc.onended = () => ctx.close().catch(() => {})
}

function formatStopwatch(ms: number) {
  const totalMillis = ms
  const minutes = Math.floor(totalMillis / 60000)
  const seconds = Math.floor((totalMillis % 60000) / 1000)
  const millis = totalMillis % 1000
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`
}

function LocalTimeCard({ now }: { now: Date }) {
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const ms = now.getMilliseconds().toString().padStart(3, '0')

  return (
    <GlassCard className="space-y-2 p-8 text-center">
      <p className="text-sm text-ink-secondary">{timezone}</p>
      <p className="font-mono text-6xl font-semibold text-ink">
        {timeFormatter.format(now)}
        <span className="text-3xl text-ink-secondary">.{ms}</span>
      </p>
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
            <li
              key={city.timeZone}
              className="flex items-center justify-between rounded-control border border-glass-border bg-tint/5 px-3 py-2"
            >
              <span className="text-sm text-ink-secondary">{city.label}</span>
              <span className="font-mono text-sm font-medium text-ink">
                {formatter.format(now)}
              </span>
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
      <p className="text-center font-mono text-4xl font-semibold text-ink">
        {formatStopwatch(elapsed)}
      </p>
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
          {running ? (
            <Pause className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Play className="h-4 w-4" strokeWidth={2} />
          )}
          {running ? 'Pause' : 'Start'}
        </Button>
      </div>
    </GlassCard>
  )
}

function CountdownCard() {
  const [inputMinutes, setInputMinutes] = useState(5)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const endTimeRef = useRef<number | null>(null)

  useEffect(() => {
    endTimeRef.current = endTime
  }, [endTime])

  useEffect(() => {
    if (endTimeRef.current === null) return undefined

    let raf: number
    function tick() {
      const now = Date.now()
      const end = endTimeRef.current
      if (end === null) return
      const left = Math.max(0, end - now)
      setRemaining(left)
      if (left <= 0) {
        setDone(true)
        playCountdownBeep()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [])

  const running = remaining !== null && remaining > 0
  const formatDisplay = (ms: number) => {
    const mm = Math.floor(ms / 60000)
      .toString()
      .padStart(2, '0')
    const ss = Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, '0')
    const ms_val = (ms % 1000).toString().padStart(3, '0')
    return `${mm}:${ss}.${ms_val}`
  }
  const display =
    remaining !== null
      ? formatDisplay(remaining)
      : formatDisplay(inputMinutes * 60 * 1000)

  return (
    <GlassCard className="space-y-4 p-5">
      <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-ink">
        <TimerIcon className="h-4 w-4" strokeWidth={2} />
        Countdown Timer
      </h2>
      <p
        className={cn(
          'text-center font-mono text-4xl font-semibold text-ink',
          done && 'text-success',
        )}
      >
        {done ? "Time's up!" : display}
      </p>
      {remaining === null ? (
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
              setEndTime(Date.now() + inputMinutes * 60 * 1000)
              setRemaining(inputMinutes * 60 * 1000)
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
            setEndTime(null)
            setRemaining(null)
            setDone(false)
          }}
        >
          {running ? 'Cancel' : 'Reset'}
        </Button>
      )}
    </GlassCard>
  )
}

function AlarmCard() {
  const {
    alarms,
    ringingId,
    ringingAlarm,
    addAlarm,
    removeAlarm,
    toggleAlarm,
    dismiss,
    snooze,
  } = useAlarm()
  const [inputTime, setInputTime] = useState('')
  const [inputTitle, setInputTitle] = useState('')
  const [showForm, setShowForm] = useState(false)

  const enabledAlarms = alarms.filter((a) => a.enabled)

  return (
    <GlassCard className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-ink">
          <AlarmClock className="h-4 w-4" strokeWidth={2} />
          Alarm
          {enabledAlarms.length > 0 && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
              {enabledAlarms.length}
            </span>
          )}
        </h2>
        {!showForm && (
          <Button size="sm" variant="secondary" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add
          </Button>
        )}
      </div>

      {/* Ringing overlay */}
      {ringingId && ringingAlarm && (
        <div className="space-y-3 rounded-control border border-primary/40 bg-primary/10 p-3 text-center">
          <p className="font-medium text-ink">
            ⏰ {ringingAlarm.title || ringingAlarm.time}
          </p>
          {ringingAlarm.title && (
            <p className="text-sm text-ink-secondary">{ringingAlarm.time}</p>
          )}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 justify-center"
              onClick={snooze}
            >
              Snooze (5 min)
            </Button>
            <Button size="sm" className="flex-1 justify-center" onClick={dismiss}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Add alarm form */}
      {showForm && (
        <div className="space-y-3 rounded-control border border-glass-border bg-tint/5 p-3">
          <input
            type="time"
            value={inputTime}
            onChange={(event) => setInputTime(event.target.value)}
            className="w-full rounded-control border border-glass-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
          />
          <input
            type="text"
            value={inputTitle}
            placeholder="Label (optional)"
            maxLength={40}
            onChange={(event) => setInputTitle(event.target.value)}
            className="w-full rounded-control border border-glass-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary placeholder:text-ink-secondary/50"
          />
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 justify-center"
              onClick={() => {
                setShowForm(false)
                setInputTime('')
                setInputTitle('')
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1 justify-center"
              disabled={!inputTime}
              onClick={() => {
                addAlarm(inputTime, inputTitle)
                setInputTime('')
                setInputTitle('')
                setShowForm(false)
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Alarm list */}
      {alarms.length > 0 ? (
        <ul className="space-y-2">
          {alarms.map((alarm) => (
            <li
              key={alarm.id}
              className="flex items-center gap-3 rounded-control border border-glass-border bg-tint/5 px-3 py-2.5"
            >
              <button
                type="button"
                role="switch"
                aria-checked={alarm.enabled}
                aria-label={`Toggle alarm ${alarm.title || alarm.time}`}
                onClick={() => toggleAlarm(alarm.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
                  alarm.enabled
                    ? 'bg-gradient-to-r from-primary to-secondary'
                    : 'bg-tint/15'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    alarm.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
                  }`}
                />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {alarm.title || alarm.time}
                </p>
                {alarm.title && (
                  <p className="text-xs text-ink-secondary">{alarm.time}</p>
                )}
              </div>
              <button
                type="button"
                aria-label={`Delete alarm ${alarm.title || alarm.time}`}
                onClick={() => removeAlarm(alarm.id)}
                className="rounded-md p-1 text-ink-secondary/60 transition-colors hover:text-danger"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !showForm && (
          <p className="py-2 text-center text-sm text-ink-secondary">
            No alarms set. Tap &quot;Add&quot; to create one.
          </p>
        )
      )}

      {enabledAlarms.length > 0 && !ringingId && (
        <p className="text-xs text-ink-secondary">
          {enabledAlarms.length} alarm{enabledAlarms.length !== 1 ? 's' : ''} active. You
          can navigate freely — alarms will still fire.
        </p>
      )}
    </GlassCard>
  )
}

function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    let raf: number
    function tick() {
      setNow(new Date())
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const memoNow = useMemo(() => now, [now])

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <LocalTimeCard now={memoNow} />
      <div className="grid gap-6 md:grid-cols-2">
        <WorldClockCard now={memoNow} />
        <StopwatchCard />
        <CountdownCard />
        <AlarmCard />
      </div>
    </div>
  )
}

export default Clock

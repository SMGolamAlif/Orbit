import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

/**
 * Plays a rich classical alarm chime — a two-note bell pattern (C5-E5)
 * that repeats every 1.5s. Returns a stop function to cancel the loop.
 */
function playAlarmChime(): () => void {
  let stopped = false
  const ctx = new AudioContext()

  function playChime() {
    if (stopped) return

    const now = ctx.currentTime
    const notes = [
      { freq: 523.25, start: 0, duration: 0.8 }, // C5
      { freq: 659.25, start: 0.15, duration: 0.7 }, // E5
    ]

    for (const note of notes) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = note.freq

      gain.gain.setValueAtTime(0, now + note.start)
      gain.gain.linearRampToValueAtTime(0.25, now + note.start + 0.04)
      gain.gain.setValueAtTime(0.25, now + note.start + note.duration * 0.6)
      gain.gain.linearRampToValueAtTime(0, now + note.start + note.duration)

      osc.connect(gain).connect(ctx.destination)
      osc.start(now + note.start)
      osc.stop(now + note.start + note.duration + 0.05)
    }

    const nextDelay = 1.5
    setTimeout(() => {
      if (!stopped) playChime()
    }, nextDelay * 1000)
  }

  playChime()

  return () => {
    stopped = true
    ctx.close().catch(() => {})
  }
}

export interface AlarmEntry {
  id: string
  time: string
  title: string
  enabled: boolean
}

interface AlarmContextValue {
  alarms: AlarmEntry[]
  ringingId: string | null
  ringingAlarm: AlarmEntry | null
  addAlarm: (time: string, title: string) => void
  removeAlarm: (id: string) => void
  toggleAlarm: (id: string) => void
  dismiss: () => void
  snooze: () => void
}

const AlarmContext = createContext<AlarmContextValue | null>(null)

const STORAGE_KEY = 'orbit-alarms'

function loadAlarms(): AlarmEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (a: unknown) =>
        typeof a === 'object' &&
        a !== null &&
        typeof (a as AlarmEntry).id === 'string' &&
        typeof (a as AlarmEntry).time === 'string' &&
        typeof (a as AlarmEntry).enabled === 'boolean',
    )
  } catch {
    return []
  }
}

function saveAlarms(alarms: AlarmEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms))
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

let nextId = 1
function generateId(): string {
  return `alarm-${nextId++}-${Date.now()}`
}

function AlarmProvider({ children }: { children: ReactNode }) {
  const [alarms, setAlarms] = useState<AlarmEntry[]>(() => loadAlarms())
  const [ringingId, setRingingId] = useState<string | null>(null)
  const firedRef = useRef<Set<string>>(new Set())
  const stopAlarmRef = useRef<(() => void) | null>(null)

  const ringingAlarm = alarms.find((a) => a.id === ringingId) ?? null

  // Persist alarms to localStorage on every change
  useEffect(() => {
    saveAlarms(alarms)
  }, [alarms])

  // Check every second if any enabled alarm should fire
  useEffect(() => {
    const enabled = alarms.filter((a) => a.enabled)
    if (enabled.length === 0) return

    const interval = window.setInterval(() => {
      const now = new Date()
      for (const alarm of enabled) {
        const [hh, mm] = alarm.time.split(':').map(Number)
        if (now.getHours() === hh && now.getMinutes() === mm) {
          if (!firedRef.current.has(alarm.id)) {
            firedRef.current.add(alarm.id)
            setRingingId(alarm.id)
            stopAlarmRef.current = playAlarmChime()
            break // only one rings at a time
          }
        } else {
          firedRef.current.delete(alarm.id)
        }
      }
    }, 1000)

    return () => window.clearInterval(interval)
  }, [alarms])

  // Cleanup alarm sound on unmount
  useEffect(() => {
    return () => {
      stopAlarmRef.current?.()
    }
  }, [])

  const addAlarm = useCallback((time: string, title: string) => {
    const entry: AlarmEntry = {
      id: generateId(),
      time,
      title: title.trim() || '',
      enabled: true,
    }
    setAlarms((prev) => [...prev, entry])
  }, [])

  const removeAlarm = useCallback((id: string) => {
    // If the removed alarm is currently ringing, stop it
    setRingingId((current) => {
      if (current === id) {
        stopAlarmRef.current?.()
        stopAlarmRef.current = null
        return null
      }
      return current
    })
    firedRef.current.delete(id)
    setAlarms((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    )
    firedRef.current.delete(id)
  }, [])

  const dismiss = useCallback(() => {
    stopAlarmRef.current?.()
    stopAlarmRef.current = null
    setRingingId(null)
  }, [])

  const snooze = useCallback(() => {
    stopAlarmRef.current?.()
    stopAlarmRef.current = null
    setRingingId(null)
    // Snooze for 5 minutes — create a new one-shot alarm
    const snoozeDate = new Date(Date.now() + 5 * 60 * 1000)
    const hh = snoozeDate.getHours().toString().padStart(2, '0')
    const mm = snoozeDate.getMinutes().toString().padStart(2, '0')
    const entry: AlarmEntry = {
      id: generateId(),
      time: `${hh}:${mm}`,
      title: 'Snoozed',
      enabled: true,
    }
    setAlarms((prev) => [...prev, entry])
  }, [])

  return (
    <AlarmContext.Provider
      value={{
        alarms,
        ringingId,
        ringingAlarm,
        addAlarm,
        removeAlarm,
        toggleAlarm,
        dismiss,
        snooze,
      }}
    >
      {children}
    </AlarmContext.Provider>
  )
}

export { AlarmContext, AlarmProvider }
export type { AlarmContextValue }

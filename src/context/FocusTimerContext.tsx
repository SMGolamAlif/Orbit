import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { logFocusSession } from '@/lib/focus-sessions'

type TimerMode = 'focus' | 'break'

interface FocusTimerContextValue {
  mode: TimerMode
  secondsLeft: number
  running: boolean
  focusMinutes: number
  breakMinutes: number
  totalSeconds: number
  toggleRunning: () => void
  switchMode: (mode: TimerMode) => void
  setDurations: (focusMinutes: number, breakMinutes: number) => void
  reset: () => void
}

const FocusTimerContext = createContext<FocusTimerContextValue | null>(null)

const DEFAULT_FOCUS_MINUTES = 25
const DEFAULT_BREAK_MINUTES = 5

function FocusTimerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [focusMinutes, setFocusMinutes] = useState(DEFAULT_FOCUS_MINUTES)
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES)
  const [mode, setMode] = useState<TimerMode>('focus')
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_FOCUS_MINUTES * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const modeRef = useRef(mode)
  const durationsRef = useRef({ focusMinutes, breakMinutes })
  const userIdRef = useRef(user?.$id)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    durationsRef.current = { focusMinutes, breakMinutes }
  }, [focusMinutes, breakMinutes])

  useEffect(() => {
    userIdRef.current = user?.$id
  }, [user])

  useEffect(() => {
    if (!running) return undefined

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalRef.current ?? undefined)
          setRunning(false)
          const activeMode = modeRef.current
          const userId = userIdRef.current
          if (userId) {
            logFocusSession(userId, {
              mode: activeMode,
              durationMinutes: activeMode === 'focus' ? durationsRef.current.focusMinutes : durationsRef.current.breakMinutes,
              completedAt: new Date().toISOString(),
            })
          }
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running])

  const switchMode = useCallback((next: TimerMode) => {
    setMode(next)
    setSecondsLeft((next === 'focus' ? durationsRef.current.focusMinutes : durationsRef.current.breakMinutes) * 60)
    setRunning(false)
  }, [])

  const toggleRunning = useCallback(() => setRunning((current) => !current), [])

  const reset = useCallback(() => {
    setRunning(false)
    setSecondsLeft((modeRef.current === 'focus' ? durationsRef.current.focusMinutes : durationsRef.current.breakMinutes) * 60)
  }, [])

  const setDurations = useCallback((nextFocus: number, nextBreak: number) => {
    setFocusMinutes(nextFocus)
    setBreakMinutes(nextBreak)
    setRunning(false)
    setSecondsLeft((modeRef.current === 'focus' ? nextFocus : nextBreak) * 60)
  }, [])

  const totalSeconds = (mode === 'focus' ? focusMinutes : breakMinutes) * 60

  const value = useMemo<FocusTimerContextValue>(
    () => ({
      mode,
      secondsLeft,
      running,
      focusMinutes,
      breakMinutes,
      totalSeconds,
      toggleRunning,
      switchMode,
      setDurations,
      reset,
    }),
    [mode, secondsLeft, running, focusMinutes, breakMinutes, totalSeconds, toggleRunning, switchMode, setDurations, reset],
  )

  return <FocusTimerContext.Provider value={value}>{children}</FocusTimerContext.Provider>
}

export { FocusTimerContext, FocusTimerProvider }

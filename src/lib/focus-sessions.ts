const FOCUS_SESSION_EVENT = 'orbit-focus-session-logged'

interface FocusSession {
  id: string
  mode: 'focus' | 'break'
  durationMinutes: number
  completedAt: string
}

function getStorageKey(userId: string) {
  return `orbit-focus-sessions-${userId}`
}

function listFocusSessions(userId: string): FocusSession[] {
  try {
    const raw = window.localStorage.getItem(getStorageKey(userId))
    return raw ? (JSON.parse(raw) as FocusSession[]) : []
  } catch {
    return []
  }
}

function logFocusSession(userId: string, session: Omit<FocusSession, 'id'>): FocusSession[] {
  const sessions = listFocusSessions(userId)
  const next: FocusSession = { id: crypto.randomUUID(), ...session }
  const updated = [next, ...sessions].slice(0, 300)
  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(updated))
  window.dispatchEvent(new Event(FOCUS_SESSION_EVENT))
  return updated
}

interface DailyFocus {
  day: string
  hours: number
}

function getWeeklyFocusData(userId: string): DailyFocus[] {
  const sessions = listFocusSessions(userId).filter((session) => session.mode === 'focus')
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const days: DailyFocus[] = []

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const totalMinutes = sessions
      .filter((session) => new Date(session.completedAt).toDateString() === date.toDateString())
      .reduce((sum, session) => sum + session.durationMinutes, 0)
    days.push({ day: dayLabels[date.getDay()], hours: Math.round((totalMinutes / 60) * 10) / 10 })
  }

  return days
}

function getFocusMinutesInRange(userId: string, days: number): number {
  const sessions = listFocusSessions(userId).filter((session) => session.mode === 'focus')
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return sessions
    .filter((session) => new Date(session.completedAt) >= cutoff)
    .reduce((sum, session) => sum + session.durationMinutes, 0)
}

function getMonthlyFocusData(userId: string): { label: string; hours: number }[] {
  const sessions = listFocusSessions(userId).filter((session) => session.mode === 'focus')
  const today = new Date()
  const buckets: { label: string; hours: number }[] = []

  for (let i = 3; i >= 0; i -= 1) {
    const end = new Date(today)
    end.setDate(today.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(end.getDate() - 6)
    const totalMinutes = sessions
      .filter((session) => {
        const date = new Date(session.completedAt)
        return date >= start && date <= end
      })
      .reduce((sum, session) => sum + session.durationMinutes, 0)
    buckets.push({ label: i === 0 ? 'This week' : `${i} wk ago`, hours: Math.round((totalMinutes / 60) * 10) / 10 })
  }

  return buckets
}

export {
  FOCUS_SESSION_EVENT,
  getFocusMinutesInRange,
  getMonthlyFocusData,
  getWeeklyFocusData,
  listFocusSessions,
  logFocusSession,
}
export type { FocusSession }

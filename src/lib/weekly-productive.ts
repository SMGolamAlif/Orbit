import type { WorkbookEntry } from '@/types/workbook'

interface DailyProductive {
  day: string
  hours: number
}

/**
 * Given a list of workbook entries, compute productive hours per day
 * for the last 7 days. Only entries with `productive: true` are counted.
 * Hours are calculated from startTime/endTime differences.
 */
function getWeeklyProductiveData(entries: WorkbookEntry[]): DailyProductive[] {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const days: DailyProductive[] = []

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateKey = date.toISOString().slice(0, 10)

    const totalMinutes = entries
      .filter((entry) => {
        if (!entry.productive) return false
        const entryDate = (entry.date ?? '').slice(0, 10)
        return entryDate === dateKey
      })
      .reduce((sum, entry) => {
        const [startH, startM] = (entry.startTime ?? '00:00').split(':').map(Number)
        const [endH, endM] = (entry.endTime ?? '00:00').split(':').map(Number)
        const minutes = endH * 60 + endM - (startH * 60 + startM)
        return sum + Math.max(0, minutes)
      }, 0)

    days.push({
      day: dayLabels[date.getDay()],
      hours: Math.round((totalMinutes / 60) * 10) / 10,
    })
  }

  return days
}

/**
 * Total productive minutes from workbook entries within the last `days` days.
 */
function getProductiveMinutesInRange(entries: WorkbookEntry[], days: number): number {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  cutoff.setHours(0, 0, 0, 0)

  return entries
    .filter((entry) => {
      if (!entry.productive) return false
      const entryDate = (entry.date ?? '').slice(0, 10)
      return entryDate >= cutoff.toISOString().slice(0, 10)
    })
    .reduce((sum, entry) => {
      const [startH, startM] = (entry.startTime ?? '00:00').split(':').map(Number)
      const [endH, endM] = (entry.endTime ?? '00:00').split(':').map(Number)
      const minutes = endH * 60 + endM - (startH * 60 + startM)
      return sum + Math.max(0, minutes)
    }, 0)
}

/**
 * Monthly (4-week) productive data from workbook entries.
 */
function getMonthlyProductiveData(
  entries: WorkbookEntry[],
): { label: string; hours: number }[] {
  const today = new Date()
  const buckets: { label: string; hours: number }[] = []

  for (let i = 3; i >= 0; i -= 1) {
    const end = new Date(today)
    end.setDate(today.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(end.getDate() - 6)

    const totalMinutes = entries
      .filter((entry) => {
        if (!entry.productive) return false
        const entryDate = (entry.date ?? '').slice(0, 10)
        return (
          entryDate >= start.toISOString().slice(0, 10) &&
          entryDate <= end.toISOString().slice(0, 10)
        )
      })
      .reduce((sum, entry) => {
        const [startH, startM] = (entry.startTime ?? '00:00').split(':').map(Number)
        const [endH, endM] = (entry.endTime ?? '00:00').split(':').map(Number)
        const minutes = endH * 60 + endM - (startH * 60 + startM)
        return sum + Math.max(0, minutes)
      }, 0)

    buckets.push({
      label: i === 0 ? 'This week' : `${i} wk ago`,
      hours: Math.round((totalMinutes / 60) * 10) / 10,
    })
  }

  return buckets
}

export { getMonthlyProductiveData, getProductiveMinutesInRange, getWeeklyProductiveData }
export type { DailyProductive }

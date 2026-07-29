const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const YEAR_DAYS = 365.25
const WEEKS_PER_YEAR = 52

interface LifeCalendarStats {
  totalWeeks: number
  weeksLived: number
  weeksRemaining: number
  currentWeekIndex: number
  progressPercent: number
  ageYears: number
}

function differenceInWeeks(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / WEEK_MS)
}

function getLifeCalendarStats(
  birthDate: Date,
  lifeExpectancyYears: number,
  now: Date = new Date(),
): LifeCalendarStats {
  const totalWeeks = Math.round(lifeExpectancyYears * WEEKS_PER_YEAR)
  const weeksLived = Math.min(totalWeeks, Math.max(0, differenceInWeeks(birthDate, now)))
  const weeksRemaining = Math.max(0, totalWeeks - weeksLived)
  const currentWeekIndex = Math.min(weeksLived, Math.max(totalWeeks - 1, 0))
  const progressPercent = totalWeeks > 0 ? Math.round((weeksLived / totalWeeks) * 100) : 0
  const ageYears = (now.getTime() - birthDate.getTime()) / (YEAR_DAYS * DAY_MS)

  return { totalWeeks, weeksLived, weeksRemaining, currentWeekIndex, progressPercent, ageYears }
}

function getWeekDateRange(birthDate: Date, weekIndex: number): { start: Date; end: Date } {
  const start = new Date(birthDate.getTime() + weekIndex * WEEK_MS)
  const end = new Date(start.getTime() + WEEK_MS - DAY_MS)
  return { start, end }
}

function formatWeekRange(start: Date, end: Date): string {
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
  return `${formatter.format(start)} – ${formatter.format(end)}`
}

type GradientStop = { stop: number; rgb: [number, number, number] }

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function getWeekColor(ratio: number, stops: GradientStop[]): string {
  const clamped = Math.min(1, Math.max(0, ratio))
  let lower = stops[0]
  let upper = stops[stops.length - 1]

  for (let i = 0; i < stops.length - 1; i += 1) {
    if (clamped >= stops[i].stop && clamped <= stops[i + 1].stop) {
      lower = stops[i]
      upper = stops[i + 1]
      break
    }
  }

  const range = upper.stop - lower.stop || 1
  const localT = (clamped - lower.stop) / range
  const r = Math.round(lerp(lower.rgb[0], upper.rgb[0], localT))
  const g = Math.round(lerp(lower.rgb[1], upper.rgb[1], localT))
  const b = Math.round(lerp(lower.rgb[2], upper.rgb[2], localT))

  return `rgb(${r} ${g} ${b})`
}

export {
  WEEKS_PER_YEAR,
  formatWeekRange,
  getLifeCalendarStats,
  getWeekColor,
  getWeekDateRange,
  type GradientStop,
  type LifeCalendarStats,
}

import type { Habit, HabitLog } from '@/types/habit'

const DAY_MS = 24 * 60 * 60 * 1000

export interface HabitStreak {
  current: number
  longest: number
}

export interface HabitCompletionRate {
  rate: number // 0-1
  completed: number
  total: number
}

export interface WeeklyHeatmapData {
  date: string // ISO date string "YYYY-MM-DD"
  count: number
  completed: boolean
}

export interface HabitStats {
  streak: HabitStreak
  completionRate: HabitCompletionRate
  weeklyHeatmap: WeeklyHeatmapData[]
  totalCompletions: number
  totalTarget: number
}

/**
 * Calculate streak (current and longest) for a habit based on its logs
 */
export function calculateStreak(habit: Habit, logs: HabitLog[]): HabitStreak {
  if (logs.length === 0) {
    return { current: 0, longest: 0 }
  }

  // Sort logs by date ascending
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date))

  // Filter only completed logs
  const completedLogs = sortedLogs.filter((log) => log.completed)

  if (completedLogs.length === 0) {
    return { current: 0, longest: 0 }
  }

  // Calculate streaks based on frequency
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  let lastDate: Date | null = null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  for (const log of completedLogs) {
    const logDate = new Date(log.date + 'T00:00:00')

    if (lastDate === null) {
      tempStreak = 1
    } else {
      const diffDays = Math.round((logDate.getTime() - lastDate.getTime()) / DAY_MS)

      if (habit.frequency === 'daily') {
        if (diffDays === 1) {
          tempStreak += 1
        } else if (diffDays > 1) {
          tempStreak = 1
        }
      } else if (habit.frequency === 'weekly') {
        if (diffDays <= 7 && diffDays > 0) {
          tempStreak += 1
        } else if (diffDays > 7) {
          tempStreak = 1
        }
      } else if (habit.frequency === 'custom' && habit.customDays) {
        // For custom frequency, check if the log date falls on a valid day
        const dayOfWeek = logDate.getDay()
        if (habit.customDays.includes(dayOfWeek)) {
          const prevDayOfWeek = lastDate.getDay()
          if (habit.customDays.includes(prevDayOfWeek)) {
            const diffWeeks = Math.round(diffDays / 7)
            if (diffWeeks === 1) {
              tempStreak += 1
            } else if (diffWeeks > 1) {
              tempStreak = 1
            }
          } else {
            tempStreak = 1
          }
        } else {
          tempStreak = 1
        }
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak)
    lastDate = logDate
  }

  // Calculate current streak (from today backwards)
  if (lastDate) {
    const todayDate = new Date(todayStr + 'T00:00:00')
    const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / DAY_MS)

    if (habit.frequency === 'daily') {
      if (diffDays <= 1) {
        currentStreak = tempStreak
      } else {
        currentStreak = 0
      }
    } else if (habit.frequency === 'weekly') {
      if (diffDays <= 7) {
        currentStreak = tempStreak
      } else {
        currentStreak = 0
      }
    } else if (habit.frequency === 'custom' && habit.customDays) {
      const todayDayOfWeek = todayDate.getDay()
      if (habit.customDays.includes(todayDayOfWeek)) {
        if (diffDays <= 7) {
          currentStreak = tempStreak
        } else {
          currentStreak = 0
        }
      } else {
        // Check if the last valid day was recent enough
        const lastValidDay = habit.customDays
          .map((d) => (d - todayDayOfWeek + 7) % 7)
          .filter((d) => d > 0)
          .sort((a, b) => a - b)[0]
        if (lastValidDay && diffDays <= lastValidDay + 1) {
          currentStreak = tempStreak
        } else {
          currentStreak = 0
        }
      }
    }
  }

  return { current: currentStreak, longest: longestStreak }
}

/**
 * Calculate completion rate for a habit over a given period
 */
export function calculateCompletionRate(
  habit: Habit,
  logs: HabitLog[],
  days: number = 30,
): HabitCompletionRate {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = new Date(today.getTime() - (days - 1) * DAY_MS)

  let completed = 0
  let total = 0

  for (let i = 0; i < days; i++) {
    const checkDate = new Date(startDate.getTime() + i * DAY_MS)
    const dateStr = checkDate.toISOString().split('T')[0]

    // Check if this date should be tracked based on habit frequency
    let shouldTrack = false

    if (habit.frequency === 'daily') {
      shouldTrack = true
    } else if (habit.frequency === 'weekly') {
      // Track every 7 days from habit creation
      const habitCreated = new Date(habit.$createdAt)
      const diffDays = Math.round((checkDate.getTime() - habitCreated.getTime()) / DAY_MS)
      shouldTrack = diffDays >= 0 && diffDays % 7 === 0
    } else if (habit.frequency === 'custom' && habit.customDays) {
      shouldTrack = habit.customDays.includes(checkDate.getDay())
    }

    if (shouldTrack) {
      total += habit.targetCount
      const log = logs.find((l) => l.date === dateStr)
      if (log && log.completed) {
        completed += Math.min(log.count, habit.targetCount)
      }
    }
  }

  const rate = total > 0 ? completed / total : 0
  return { rate: Math.min(1, rate), completed, total }
}

/**
 * Generate weekly heatmap data for a habit (last 7 weeks = 49 days)
 */
export function generateWeeklyHeatmap(
  habit: Habit,
  logs: HabitLog[],
): WeeklyHeatmapData[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const heatmap: WeeklyHeatmapData[] = []

  // Last 7 weeks (49 days)
  for (let i = 48; i >= 0; i--) {
    const date = new Date(today.getTime() - i * DAY_MS)
    const dateStr = date.toISOString().split('T')[0]

    if (habit.frequency === 'daily') {
      // always track
    } else if (habit.frequency === 'weekly') {
      const habitCreated = new Date(habit.$createdAt)
      const diffDays = Math.round((date.getTime() - habitCreated.getTime()) / DAY_MS)
      if (!(diffDays >= 0 && diffDays % 7 === 0)) continue
    } else if (habit.frequency === 'custom' && habit.customDays) {
      if (!habit.customDays.includes(date.getDay())) continue
    }

    const log = logs.find((l) => l.date === dateStr)

    heatmap.push({
      date: dateStr,
      count: log?.count || 0,
      completed: log?.completed || false,
    })
  }

  return heatmap
}

/**
 * Get comprehensive stats for a habit
 */
export function getHabitStats(habit: Habit, logs: HabitLog[]): HabitStats {
  const streak = calculateStreak(habit, logs)
  const completionRate = calculateCompletionRate(habit, logs, 30)
  const weeklyHeatmap = generateWeeklyHeatmap(habit, logs)

  const totalCompletions = logs
    .filter((l) => l.completed)
    .reduce((sum, l) => sum + l.count, 0)
  const totalTarget = logs.length * habit.targetCount

  return {
    streak,
    completionRate,
    weeklyHeatmap,
    totalCompletions,
    totalTarget,
  }
}

/**
 * Check if a habit should be tracked on a specific date
 */
export function shouldTrackHabitOnDate(habit: Habit, date: Date): boolean {
  if (habit.frequency === 'daily') return true

  if (habit.frequency === 'weekly') {
    const habitCreated = new Date(habit.$createdAt)
    const diffDays = Math.round((date.getTime() - habitCreated.getTime()) / DAY_MS)
    return diffDays >= 0 && diffDays % 7 === 0
  }

  if (habit.frequency === 'custom' && habit.customDays) {
    return habit.customDays.includes(date.getDay())
  }

  return false
}

/**
 * Get today's log for a habit, or create a default one
 */
export function getTodayLog(habit: Habit, logs: HabitLog[]): HabitLog | null {
  const today = new Date().toISOString().split('T')[0]
  return logs.find((l) => l.date === today && l.habitId === habit.$id) || null
}

/**
 * Check if habit is completed for today
 */
export function isHabitCompletedToday(habit: Habit, logs: HabitLog[]): boolean {
  const todayLog = getTodayLog(habit, logs)
  return todayLog?.completed || false
}

/**
 * Get habit color as RGB array for gradients
 */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [99, 102, 241] // default indigo
}

/**
 * Sort habits by order, then by creation date
 */
export function sortHabits(habits: Habit[]): Habit[] {
  return [...habits].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
  })
}

/**
 * Filter active (non-archived) habits
 */
export function filterActiveHabits(habits: Habit[]): Habit[] {
  return habits.filter((h) => !h.archived)
}

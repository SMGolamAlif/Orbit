interface Habit {
  $id: string
  $createdAt: string
  $updatedAt: string
  userId: string
  title: string
  description: string
  color: string
  frequency: 'daily' | 'weekly' | 'custom'
  customDays?: number[] // 0-6 for Sunday-Saturday, used when frequency === 'custom'
  targetCount: number // target completions per period
  reminderTime?: string // "HH:MM" format
  archived: boolean
  order: number
}

interface HabitInput {
  title: string
  description: string
  color: string
  frequency: 'daily' | 'weekly' | 'custom'
  customDays?: number[]
  targetCount: number
  reminderTime?: string
  archived?: boolean
  order?: number
}

interface HabitLog {
  $id: string
  $createdAt: string
  $updatedAt: string
  habitId: string
  userId: string
  date: string // ISO date string "YYYY-MM-DD"
  count: number
  completed: boolean
}

interface HabitLogInput {
  habitId: string
  date: string
  count: number
  completed: boolean
}

export type { Habit, HabitInput, HabitLog, HabitLogInput }

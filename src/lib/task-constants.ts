import type { TaskPriority } from '@/types/task'

const TASK_CATEGORIES = ['Work', 'Health', 'Growth', 'Mind', 'Personal', 'Study'] as const

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger'

const PRIORITY_VARIANT: Record<TaskPriority, BadgeVariant> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

const CATEGORY_VARIANT: Record<string, BadgeVariant> = {
  Work: 'primary',
  Health: 'success',
  Growth: 'default',
  Mind: 'warning',
  Personal: 'danger',
  Study: 'primary',
}

export { CATEGORY_VARIANT, PRIORITY_VARIANT, TASK_CATEGORIES }

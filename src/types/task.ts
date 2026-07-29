type TaskStatus = 'todo' | 'doing' | 'done'
type TaskPriority = 'low' | 'medium' | 'high'

interface Task {
  $id: string
  $createdAt: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  category: string
  dueDate: string | null
  order: number
}

interface TaskInput {
  title: string
  status: TaskStatus
  priority: TaskPriority
  category: string
  dueDate: string | null
  order: number
}

export type { Task, TaskInput, TaskPriority, TaskStatus }

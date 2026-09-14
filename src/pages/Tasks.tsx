import { useMemo, useState, type FormEvent } from 'react'
import { CalendarClock, Check, Plus, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { useTasks } from '@/hooks/useTasks'
import { useCategories } from '@/hooks/useCategories'
import { CATEGORY_VARIANT, PRIORITY_VARIANT } from '@/lib/task-constants'
import { cn } from '@/lib/utils'
import type { TaskPriority } from '@/types/task'

type FilterKey = 'all' | 'today' | 'overdue' | 'high' | 'completed'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Due Today' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'high', label: 'High Priority' },
  { key: 'completed', label: 'Completed' },
]

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}

function Tasks() {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks()
  const { categories, createCategory, isCreating } = useCategories()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>('Work')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const doneCount = tasks.filter((task) => task.status === 'done').length

  const filteredTasks = useMemo(() => {
    const now = new Date()
    return tasks.filter((task) => {
      if (filter === 'completed') return task.status === 'done'
      if (task.status === 'done' && filter !== 'all') return false
      if (filter === 'today')
        return task.dueDate ? isSameDay(new Date(task.dueDate), now) : false
      if (filter === 'overdue') return task.dueDate ? new Date(task.dueDate) < now : false
      if (filter === 'high') return task.priority === 'high'
      return true
    })
  }, [tasks, filter])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return
    await createTask({
      title: title.trim(),
      status: 'todo',
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      order: Date.now(),
    })
    setTitle('')
    setDueDate('')
  }

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return
    const newName = newCategoryName.trim()
    try {
      await createCategory({
        name: newName,
        color: 'primary',
        isCustom: true,
      })
      setCategory(newName)
      setNewCategoryName('')
      setShowNewCategory(false)
    } catch (error) {
      console.error('Failed to create category:', error)
      setNewCategoryName('')
    }
  }

  async function toggleComplete(taskId: string, status: string) {
    await updateTask({
      id: taskId,
      input: { status: status === 'done' ? 'todo' : 'done' },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-ink">Tasks</h1>
        <p className="text-sm text-ink-secondary">
          {doneCount} / {tasks.length} completed
        </p>
      </div>

      <GlassCard className="p-5">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 md:flex-row md:items-center"
        >
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
                setShowNewCategory(false)
              }}
              className="rounded-control border border-glass-border bg-tint/5 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
            >
              {categories.map((cat) => (
                <option key={cat.$id || cat.name} value={cat.name} className="bg-surface">
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="relative">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowNewCategory(!showNewCategory)}
              >
                + Add
              </Button>
              {showNewCategory && (
                <div className="absolute right-0 top-full z-10 mt-2 flex gap-2 rounded-control border border-glass-border bg-surface p-2 shadow-glass">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="Category name"
                    className="rounded-control border border-glass-border bg-tint/5 px-2 py-1.5 text-sm text-ink outline-none focus:border-primary"
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddCategory}
                    disabled={isCreating || !newCategoryName.trim()}
                  >
                    {isCreating ? '...' : 'Add'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false)
                      setNewCategoryName('')
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary hover:text-ink"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            className="rounded-control border border-glass-border bg-tint/5 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
          >
            <option value="low" className="bg-surface">
              Low
            </option>
            <option value="medium" className="bg-surface">
              Medium
            </option>
            <option value="high" className="bg-surface">
              High
            </option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="rounded-control border border-glass-border bg-tint/5 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
          />
          <Button type="submit">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add
          </Button>
        </form>
      </GlassCard>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              'rounded-full border border-glass-border px-3.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors',
              filter === key
                ? 'border-primary bg-primary/15 text-primary'
                : 'hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <GlassCard className="divide-y divide-glass-border p-2">
        {isLoading ? (
          <p className="p-6 text-center text-sm text-ink-secondary">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="p-6 text-center text-sm text-ink-secondary">
            No tasks here. Add one above.
          </p>
        ) : (
          filteredTasks.map((task) => {
            const overdue =
              task.dueDate &&
              task.status !== 'done' &&
              new Date(task.dueDate) < new Date()
            return (
              <div key={task.$id} className="flex items-center gap-3 px-3 py-3">
                <button
                  type="button"
                  onClick={() => toggleComplete(task.$id, task.status)}
                  aria-label="Toggle complete"
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-glass-border transition-colors',
                    task.status === 'done' && 'border-success bg-success/20 text-success',
                  )}
                >
                  {task.status === 'done' ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : null}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'truncate text-sm text-ink',
                      task.status === 'done' && 'text-ink-secondary line-through',
                    )}
                  >
                    {task.title}
                  </p>
                  {task.dueDate ? (
                    <p
                      className={cn(
                        'mt-0.5 flex items-center gap-1 text-xs text-ink-secondary',
                        overdue && 'text-danger',
                      )}
                    >
                      <CalendarClock className="h-3 w-3" strokeWidth={2} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>

                <Badge variant={PRIORITY_VARIANT[task.priority]}>{task.priority}</Badge>
                <Badge variant={CATEGORY_VARIANT[task.category] ?? 'default'}>
                  {task.category}
                </Badge>

                <button
                  type="button"
                  onClick={() => deleteTask(task.$id)}
                  aria-label="Delete task"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-secondary transition-colors hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            )
          })
        )}
      </GlassCard>
    </div>
  )
}

export default Tasks

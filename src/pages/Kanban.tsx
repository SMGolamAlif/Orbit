import { useState, type DragEvent, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useTasks } from '@/hooks/useTasks'
import { CATEGORY_VARIANT, PRIORITY_VARIANT } from '@/lib/task-constants'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types/task'

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'Todo' },
  { status: 'doing', label: 'Doing' },
  { status: 'done', label: 'Done' },
]

function Kanban() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  const [draftByColumn, setDraftByColumn] = useState<Record<TaskStatus, string>>({
    todo: '',
    doing: '',
    done: '',
  })
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)

  function handleDragStart(event: DragEvent<HTMLDivElement>, task: Task) {
    event.dataTransfer.setData('text/plain', task.$id)
    event.dataTransfer.effectAllowed = 'move'
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, status: TaskStatus) {
    event.preventDefault()
    const taskId = event.dataTransfer.getData('text/plain')
    setDragOverColumn(null)
    if (!taskId) return
    updateTask({ id: taskId, input: { status } })
  }

  async function handleAddCard(event: FormEvent<HTMLFormElement>, status: TaskStatus) {
    event.preventDefault()
    const value = draftByColumn[status].trim()
    if (!value) return
    await createTask({
      title: value,
      status,
      priority: 'medium',
      category: 'Work',
      dueDate: null,
      order: Date.now(),
    })
    setDraftByColumn((current) => ({ ...current, [status]: '' }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-ink">Kanban Board</h1>
        <p className="text-sm text-ink-secondary">Drag cards across columns — stays in sync with Tasks.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {COLUMNS.map(({ status, label }) => {
          const columnTasks = tasks.filter((task) => task.status === status)
          return (
            <div
              key={status}
              onDragOver={(event) => {
                event.preventDefault()
                setDragOverColumn(status)
              }}
              onDragLeave={() => setDragOverColumn((current) => (current === status ? null : current))}
              onDrop={(event) => handleDrop(event, status)}
              className={cn(
                'flex min-h-[480px] flex-col gap-3 rounded-card border border-glass-border bg-glass p-4 backdrop-blur-glass transition-colors',
                dragOverColumn === status && 'border-primary bg-primary/5',
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-semibold text-ink">{label}</h2>
                <span className="rounded-full bg-tint/10 px-2 py-0.5 font-mono text-xs text-ink-secondary">
                  {columnTasks.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
                {columnTasks.map((task) => (
                  <div
                    key={task.$id}
                    draggable
                    onDragStart={(event) => handleDragStart(event, task)}
                    onDoubleClick={() => deleteTask(task.$id)}
                    title="Double-click to delete"
                    className="cursor-grab space-y-2 rounded-control border border-glass-border bg-tint/5 p-3 text-sm text-ink transition-transform hover:-translate-y-0.5 active:cursor-grabbing"
                  >
                    <p>{task.title}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant={PRIORITY_VARIANT[task.priority]}>{task.priority}</Badge>
                      <Badge variant={CATEGORY_VARIANT[task.category] ?? 'default'}>{task.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={(event) => handleAddCard(event, status)} className="flex items-center gap-2">
                <input
                  value={draftByColumn[status]}
                  onChange={(event) =>
                    setDraftByColumn((current) => ({ ...current, [status]: event.target.value }))
                  }
                  placeholder="Add card..."
                  className="flex-1 rounded-control border border-glass-border bg-tint/5 px-3 py-2 text-xs text-ink outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  aria-label={`Add card to ${label}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-glass-border text-ink-secondary transition-colors hover:text-primary"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                </button>
              </form>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Kanban

import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'
import { useTasks } from '@/hooks/useTasks'
import { CATEGORY_VARIANT } from '@/lib/task-constants'
import { cn } from '@/lib/utils'

function TodaysFocusCard() {
  const { tasks, isLoading, updateTask } = useTasks()
  const doneCount = tasks.filter((task) => task.status === 'done').length
  const visibleTasks = [...tasks]
    .sort((a, b) => Number(a.status === 'done') - Number(b.status === 'done'))
    .slice(0, 5)

  function toggleTask(id: string, status: string) {
    updateTask({ id, input: { status: status === 'done' ? 'todo' : 'done' } })
  }

  return (
    <GlassCard className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-ink">
          Today&apos;s Focus
        </h2>
        <span className="font-mono text-xs text-ink-secondary">
          {doneCount} / {tasks.length} done
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-secondary">Loading tasks...</p>
      ) : visibleTasks.length === 0 ? (
        <p className="text-sm text-ink-secondary">
          No tasks yet. Add your first one below.
        </p>
      ) : (
        <ul className="space-y-2">
          {visibleTasks.map((task) => (
            <li
              key={task.$id}
              className="flex items-center gap-3 rounded-control px-1 py-1.5"
            >
              <button
                type="button"
                onClick={() => toggleTask(task.$id, task.status)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-glass-border transition-colors',
                    task.status === 'done' && 'border-success bg-success/20 text-success',
                  )}
                >
                  {task.status === 'done' ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : null}
                </span>
                <span
                  className={cn(
                    'min-w-0 truncate text-sm text-ink-secondary',
                    task.status === 'done' && 'text-ink line-through',
                  )}
                >
                  {task.title}
                </span>
              </button>
              <Badge
                variant={CATEGORY_VARIANT[task.category] ?? 'default'}
                className="shrink-0"
              >
                {task.category}
              </Badge>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/app/tasks"
        className="flex w-full items-center gap-2 rounded-control border border-dashed border-glass-border px-3 py-2 text-sm text-ink-secondary transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Add new task
      </Link>
    </GlassCard>
  )
}

export { TodaysFocusCard }

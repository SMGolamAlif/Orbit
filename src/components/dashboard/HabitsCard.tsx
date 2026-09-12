import { Flame, Target, CheckCircle2, XCircle, Plus, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlassCard } from '@/components/ui/glass-card'
import { useHabits } from '@/hooks/useHabits'
import { cn } from '@/lib/utils'

function HabitsCard() {
  const { habits, habitStats, isLoading, toggleHabitToday, isHabitCompletedToday } =
    useHabits()

  const activeHabits = habits.filter((h) => !h.archived)
  const habitsToShow = activeHabits.slice(0, 5)

  const completedToday = habitsToShow.filter((h) => isHabitCompletedToday(h.$id)).length
  const totalToday = habitsToShow.length

  return (
    <GlassCard className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-ink">Today's Habits</h2>
        <span className="font-mono text-xs text-ink-secondary">
          {completedToday} / {totalToday} done
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-control bg-tint/10" />
          ))}
        </div>
      ) : habitsToShow.length === 0 ? (
        <div className="text-center py-4">
          <Target
            className="mx-auto mb-2 h-8 w-8 text-ink-secondary/40"
            strokeWidth={1.5}
          />
          <p className="text-sm text-ink-secondary">No habits yet</p>
          <Link
            to="/habits"
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Create your first habit <ChevronRight className="h-3 w-3" strokeWidth={2} />
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {habitsToShow.map((habit) => {
            const stats = habitStats.get(habit.$id)
            const completed = isHabitCompletedToday(habit.$id)

            return (
              <li
                key={habit.$id}
                className="flex items-center gap-3 rounded-control px-1 py-1.5"
              >
                <div
                  className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: habit.color }}
                />
                <button
                  type="button"
                  onClick={() => toggleHabitToday(habit)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-glass-border transition-colors',
                      completed && 'border-primary bg-primary/20 text-primary',
                    )}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        'truncate text-sm font-medium',
                        completed ? 'text-ink line-through' : 'text-ink-secondary',
                      )}
                    >
                      {habit.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {stats && stats.streak.current > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600">
                          <Flame className="h-2.5 w-2.5" strokeWidth={2} />
                          {stats.streak.current}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <Link
        to="/habits"
        className="flex w-full items-center gap-2 rounded-control border border-dashed border-glass-border px-3 py-2 text-sm text-ink-secondary transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Manage habits
      </Link>
    </GlassCard>
  )
}

export { HabitsCard }

import { useMemo, useState } from 'react'
import { useHabits } from '@/hooks/useHabits'
import type { Habit, HabitInput } from '@/types/habit'
import { shouldTrackHabitOnDate, sortHabits, filterActiveHabits } from '@/lib/habit-utils'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Target,
  Flame,
  CheckCircle2,
  XCircle,
  GripVertical,
  MoreHorizontal,
  Archive,
  X,
} from 'lucide-react'
import { cn, formatDateLabel, isFuture } from '@/lib/utils'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'

function HabitsPage() {
  const {
    habits,
    logsByHabit,
    habitStats,
    isLoading,
    createHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    upsertHabitLog,
    isHabitCompletedOnDate,
    getHabitCountOnDate,
  } = useHabits()

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [selectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [dragActive, setDragActive] = useState<string | null>(null)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formFrequency, setFormFrequency] = useState<'daily' | 'weekly' | 'custom'>(
    'daily',
  )
  const [formCustomDays, setFormCustomDays] = useState<number[]>([])
  const [formTargetCount, setFormTargetCount] = useState(1)
  const [formColor, setFormColor] = useState('#6366f1')
  const [formError, setFormError] = useState('')

  const today = new Date().toISOString().slice(0, 10)
  const activeHabits = useMemo(() => filterActiveHabits(sortHabits(habits)), [habits])

  // Drag and drop for reordering
  const { dragProps, dropProps } = useDragAndDrop({
    items: activeHabits,
    onReorder: async (newOrder) => {
      await reorderHabits(newOrder)
    },
    getItemId: (item) => item.$id,
  })

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormFrequency('daily')
    setFormCustomDays([])
    setFormTargetCount(1)
    setFormColor('#6366f1')
    setFormError('')
  }

  const openAddForm = () => {
    setEditingHabit(null)
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (habit: Habit) => {
    setEditingHabit(habit)
    setFormTitle(habit.title)
    setFormDescription(habit.description || '')
    setFormFrequency(habit.frequency)
    setFormCustomDays(habit.customDays || [])
    setFormTargetCount(habit.targetCount)
    setFormColor(habit.color)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingHabit(null)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) {
      setFormError('Title is required')
      return
    }
    if (formFrequency === 'custom' && formCustomDays.length === 0) {
      setFormError('Select at least one day for custom frequency')
      return
    }

    const input: HabitInput = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      frequency: formFrequency,
      customDays: formFrequency === 'custom' ? formCustomDays : undefined,
      targetCount: formTargetCount,
      color: formColor,
      order: activeHabits.length,
    }

    try {
      if (editingHabit) {
        await updateHabit({ id: editingHabit.$id, input })
      } else {
        await createHabit(input)
      }
      closeForm()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save habit. Please try again.'
      setFormError(message)
    }
  }

  const handleDelete = async (habitId: string) => {
    if (!confirm('Delete this habit? This cannot be undone.')) return
    try {
      await deleteHabit(habitId)
    } catch {
      alert('Failed to delete habit')
    }
  }

  const handleArchive = async (habitId: string, archived: boolean) => {
    try {
      await updateHabit({ id: habitId, input: { archived } })
    } catch {
      alert('Failed to update habit')
    }
  }

  const handleToggleComplete = async (habit: Habit, date: string) => {
    const completed = isHabitCompletedOnDate(habit.$id, date)
    const newCount = completed ? 0 : habit.targetCount
    try {
      await upsertHabitLog({ habitId: habit.$id, date, count: newCount, targetCount: habit.targetCount })
    } catch {
      alert('Failed to update habit')
    }
  }

  const handleIncrementCount = async (habit: Habit, date: string) => {
    const currentCount = getHabitCountOnDate(habit.$id, date)
    const newCount = currentCount + 1
    try {
      await upsertHabitLog({ habitId: habit.$id, date, count: newCount, targetCount: habit.targetCount })
    } catch {
      alert('Failed to update habit')
    }
  }

  const handleDecrementCount = async (habit: Habit, date: string) => {
    const currentCount = getHabitCountOnDate(habit.$id, date)
    const newCount = Math.max(0, currentCount - 1)
    try {
      await upsertHabitLog({ habitId: habit.$id, date, count: newCount, targetCount: habit.targetCount })
    } catch {
      alert('Failed to update habit')
    }
  }

  const renderHabitList = () => (
    <div className="space-y-3">
      {activeHabits.map((habit) => {
        const stats = habitStats.get(habit.$id)
        const completed = isHabitCompletedOnDate(habit.$id, today)
        const todayCount = getHabitCountOnDate(habit.$id, today)

        return (
          <GlassCard
            key={habit.$id}
            className={cn(
              'flex items-center gap-4 p-4 transition-all',
              dragActive === habit.$id && 'opacity-50 ring-2 ring-primary',
            )}
            {...dropProps(habit.$id)}
          >
            <div
              className="shrink-0 cursor-grab active:cursor-grabbing select-none p-1"
              {...dragProps}
              onDragStart={() => setDragActive(habit.$id)}
              onDragEnd={() => setDragActive(null)}
            >
              <GripVertical className="h-5 w-5 text-ink-tertiary hover:text-ink" />
            </div>

            {/* Color indicator */}
            <div
              className="shrink-0 h-10 w-10 rounded-lg"
              style={{ backgroundColor: habit.color }}
            />

            {/* Habit info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-ink">{habit.title}</h3>
                {habit.frequency === 'daily' && (
                  <Badge variant="default" className="text-xs">
                    Daily
                  </Badge>
                )}
                {habit.frequency === 'weekly' && (
                  <Badge variant="default" className="text-xs">
                    Weekly
                  </Badge>
                )}
                {habit.frequency === 'custom' && (
                  <Badge variant="default" className="text-xs">
                    Custom
                  </Badge>
                )}
              </div>
              {habit.description && (
                <p className="truncate text-sm text-ink-secondary mt-1">
                  {habit.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-ink-secondary">
                <div className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-amber-500" />
                  <span>{stats?.streak.current ?? 0} day streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  <span>
                    {todayCount}/{habit.targetCount}
                  </span>
                </div>
                {stats?.completionRate && (
                  <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(100, stats.completionRate.rate * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {habit.targetCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => handleDecrementCount(habit, today)}
                    disabled={todayCount <= 0}
                    className="rounded-full p-1.5 text-ink-secondary hover:text-ink hover:bg-surface-2 transition-colors disabled:opacity-50"
                    aria-label="Decrease count"
                  >
                    <XCircle className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <span className="w-8 text-center font-mono text-ink">{todayCount}</span>
                  <button
                    type="button"
                    onClick={() => handleIncrementCount(habit, today)}
                    disabled={todayCount >= habit.targetCount}
                    className="rounded-full p-1.5 text-ink-secondary hover:text-ink hover:bg-surface-2 transition-colors disabled:opacity-50"
                    aria-label="Increase count"
                  >
                    <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => handleToggleComplete(habit, today)}
                className={cn(
                  'rounded-full p-2 transition-all',
                  completed
                    ? 'bg-green-500/20 text-green-500'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface-2',
                )}
                aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {completed ? (
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                ) : (
                  <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
                )}
              </button>

              <div className="relative">
                <button
                  type="button"
                  className="rounded-full p-2 text-ink-secondary hover:text-ink hover:bg-surface-2 transition-colors"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-36 glass-card rounded-lg shadow-lg py-1 z-10">
                  <button
                    type="button"
                    onClick={() => openEditForm(habit)}
                    className="w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-2"
                  >
                    <Pencil className="h-4 w-4 inline mr-2" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleArchive(habit.$id, !habit.archived)}
                    className="w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-2"
                  >
                    <Archive className="h-4 w-4 inline mr-2" />
                    {habit.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(habit.$id)}
                    className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4 inline mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        )
      })}
    </div>
  )

  const renderCalendarView = () => {
    const todayDate = new Date()
    const monthStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
    const monthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0)
    const daysInMonth = monthEnd.getDate()
    const startDay = monthStart.getDay()

    const weeks: (string | null)[][] = []
    let week: (string | null)[] = Array(startDay).fill(null)

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      week.push(dateStr)
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }
    if (week.length > 0) {
      weeks.push([...week, ...Array(7 - week.length).fill(null)])
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">
            {todayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-ink-secondary hover:text-ink hover:bg-surface-2"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-ink-secondary hover:text-ink hover:bg-surface-2"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm text-ink-secondary">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2 font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) =>
            week.map((dateStr, dayIndex) => {
              if (!dateStr)
                return <div key={`${weekIndex}-${dayIndex}`} className="h-10" />
              const isToday = dateStr === today
              const isFutureDate = new Date(dateStr) > new Date(today)

              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={cn(
                    'relative h-10 rounded-lg transition-colors',
                    isToday && 'ring-2 ring-primary',
                    isFutureDate && 'opacity-50',
                  )}
                >
                  <span className={cn('text-sm', isToday && 'font-bold text-primary')}>
                    {new Date(dateStr).getDate()}
                  </span>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {activeHabits
                      .filter((h) => shouldTrackHabitOnDate(h, new Date(dateStr)))
                      .slice(0, 4)
                      .map((habit) => {
                        const logs = logsByHabit.get(habit.$id) || []
                        const log = logs.find((l) => l.date === dateStr)
                        const completed = log?.completed ?? false
                        return (
                          <div
                            key={habit.$id}
                            className={cn(
                              'h-2 w-2 rounded-full',
                              completed ? `bg-[${habit.color}]` : 'bg-surface-2',
                            )}
                            title={habit.title}
                          />
                        )
                      })}
                    {activeHabits.filter((h) =>
                      shouldTrackHabitOnDate(h, new Date(dateStr)),
                    ).length > 4 && (
                      <div className="h-2 w-2 rounded-full bg-surface-2 text-[8px] flex items-center justify-center text-ink-tertiary">
                        +
                        {activeHabits.filter((h) =>
                          shouldTrackHabitOnDate(h, new Date(dateStr)),
                        ).length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )
            }),
          )}
        </div>

        {/* Selected date detail */}
        {selectedDate && (
          <GlassCard className="p-4">
            <h3 className="font-semibold text-ink mb-3">
              {formatDateLabel(selectedDate)}
            </h3>
            <div className="space-y-2">
              {activeHabits
                .filter((h) => shouldTrackHabitOnDate(h, new Date(selectedDate)))
                .map((habit) => {
                  const completed = isHabitCompletedOnDate(habit.$id, selectedDate)
                  const count = getHabitCountOnDate(habit.$id, selectedDate)

                  return (
                    <GlassCard key={habit.$id} className="flex items-center gap-4 p-4">
                      <div
                        className="shrink-0 h-10 w-10 rounded-lg"
                        style={{ backgroundColor: habit.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-ink">{habit.title}</h4>
                        <p className="text-sm text-ink-secondary">
                          Target: {habit.targetCount}{' '}
                          {habit.targetCount === 1 ? 'time' : 'times'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {habit.targetCount > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDecrementCount(habit, selectedDate)}
                              disabled={count <= 0 || isFuture(selectedDate)}
                              className="rounded-full p-2 text-ink-secondary hover:text-ink hover:bg-surface-2 transition-colors disabled:opacity-50"
                              aria-label="Decrease count"
                            >
                              <XCircle className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                            <span className="w-8 text-center font-mono text-ink">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncrementCount(habit, selectedDate)}
                              disabled={
                                count >= habit.targetCount || isFuture(selectedDate)
                              }
                              className="rounded-full p-2 text-ink-secondary hover:text-ink hover:bg-surface-2 transition-colors disabled:opacity-50"
                              aria-label="Increase count"
                            >
                              <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                            <span className="text-ink-secondary font-mono">
                              /{habit.targetCount}
                            </span>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleComplete(habit, selectedDate)}
                          disabled={isFuture(selectedDate)}
                          className={cn(
                            'rounded-full p-2 transition-all',
                            completed
                              ? 'bg-green-500/20 text-green-500'
                              : 'text-ink-secondary hover:text-ink hover:bg-surface-2',
                            isFuture(selectedDate) && 'opacity-50 cursor-not-allowed',
                          )}
                          aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                          ) : (
                            <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
                          )}
                        </button>
                      </div>
                    </GlassCard>
                  )
                })}
              {activeHabits.filter((h) =>
                shouldTrackHabitOnDate(h, new Date(selectedDate)),
              ).length === 0 && (
                <p className="text-center text-ink-secondary py-4">
                  No habits scheduled for this day
                </p>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Habits</h1>
          <p className="text-ink-secondary mt-1">
            Build consistent habits and track your progress
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          New Habit
        </Button>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 bg-surface-2 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
            viewMode === 'list'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-ink-secondary hover:text-ink',
          )}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => setViewMode('calendar')}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
            viewMode === 'calendar'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-ink-secondary hover:text-ink',
          )}
        >
          Calendar
        </button>
      </div>

      {viewMode === 'list' ? renderHabitList() : renderCalendarView()}

      {/* Add/Edit Habit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <GlassCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-ink">
                {editingHabit ? 'Edit Habit' : 'New Habit'}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full p-2 text-ink-secondary hover:text-ink hover:bg-surface-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-xs text-ink-secondary">Title *</label>
                <Input
                  value={formTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormTitle(e.target.value)
                  }
                  placeholder="Enter habit title"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-ink-secondary">Description</label>
                <Textarea
                  value={formDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormDescription(e.target.value)
                  }
                  placeholder="Optional description"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-ink-secondary">Frequency *</label>
                <Select
                  value={formFrequency}
                  onValueChange={(value) =>
                    setFormFrequency(value as 'daily' | 'weekly' | 'custom')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formFrequency === 'custom' && (
                <div>
                  <label className="text-xs text-ink-secondary">Days *</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                      (day, index) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setFormCustomDays((prev) =>
                              prev.includes(index)
                                ? prev.filter((d) => d !== index)
                                : [...prev, index],
                            )
                          }}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                            formCustomDays.includes(index)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-surface-2 text-ink-secondary hover:bg-surface-3',
                          )}
                        >
                          {day}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-ink-secondary">Target Count *</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={formTargetCount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormTargetCount(Number(e.target.value))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-ink-secondary">Color</label>
                <div className="flex gap-2 mt-1">
                  {[
                    '#6366f1',
                    '#ec4899',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#06b6d4',
                    '#f97316',
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormColor(color)}
                      className={cn(
                        'h-8 w-8 rounded-lg border-2 transition-all',
                        formColor === color
                          ? 'border-ink scale-110'
                          : 'border-transparent hover:scale-105',
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeForm}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

export default HabitsPage

import { useMemo, useState, type FormEvent } from 'react'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { useWorkbook } from '@/hooks/useWorkbook'
import { cn } from '@/lib/utils'

// ─── Date helpers ───────────────────────────────────────────────

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function getWeekDates(reference: Date): string[] {
  const day = reference.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day // Monday-start
  const monday = new Date(reference)
  monday.setDate(reference.getDate() + mondayOffset)
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function getMonthDays(year: number, month: number): string[] {
  const days: string[] = []
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(
      `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    )
  }
  // Pad start so first day aligns with correct weekday (Monday-start)
  const firstDay = first.getDay()
  const padStart = firstDay === 0 ? 6 : firstDay - 1
  for (let i = 0; i < padStart; i++) {
    days.unshift('')
  }
  return days
}

function shiftWeek(dateStr: string, direction: -1 | 1): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + direction * 7)
  return d.toISOString().slice(0, 10)
}

function shiftMonth(year: number, month: number, direction: -1 | 1): [number, number] {
  let m = month + direction
  let y = year
  if (m < 0) {
    m = 11
    y--
  } else if (m > 11) {
    m = 0
    y++
  }
  return [y, m]
}

// ─── Component ────────────────────────────────────────────────

type ViewMode = 'week' | 'month'

function Workbook() {
  const {
    entries,
    entriesByDate,
    datesWithEntries,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
  } = useWorkbook()

  const today = todayKey()
  const [selectedDate, setSelectedDate] = useState(today)
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [weekAnchor, setWeekAnchor] = useState(today)
  const [monthYear, setMonthYear] = useState<[number, number]>([
    new Date().getFullYear(),
    new Date().getMonth(),
  ])

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formStart, setFormStart] = useState('')
  const [formEnd, setFormEnd] = useState('')
  const [formProductive, setFormProductive] = useState(true)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const weekDays = useMemo(
    () => getWeekDates(new Date(weekAnchor + 'T00:00:00')),
    [weekAnchor],
  )
  const monthDays = useMemo(() => getMonthDays(monthYear[0], monthYear[1]), [monthYear])
  const selectedEntries = entriesByDate.get(selectedDate) ?? []

  const isFuture = (dateStr: string) => dateStr > today

  function openAddForm() {
    setEditingId(null)
    setFormTitle('')
    setFormDescription('')
    setFormStart('')
    setFormEnd('')
    setFormProductive(true)
    setFormError(null)
    setShowForm(true)
  }

  function openEditForm(entry: (typeof entries)[number]) {
    setEditingId(entry.$id)
    setFormTitle(entry.title)
    setFormDescription(entry.description)
    setFormStart(entry.startTime)
    setFormEnd(entry.endTime)
    setFormProductive(entry.productive)
    setFormError(null)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setFormError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!formTitle.trim() || !formStart || !formEnd) return

    const input = {
      date: selectedDate,
      title: formTitle.trim(),
      description: formDescription.trim(),
      startTime: formStart,
      endTime: formEnd,
      productive: formProductive,
    }

    setFormError(null)
    setIsSaving(true)
    try {
      if (editingId) {
        await updateEntry({ id: editingId, input })
      } else {
        await createEntry(input)
      }
      closeForm()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setFormError(message)
    } finally {
      setIsSaving(false)
    }
  }

  const monthLabel = new Date(monthYear[0], monthYear[1]).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-ink">Workbook</h1>
          <p className="text-sm text-ink-secondary">
            {entries.length} session{entries.length !== 1 ? 's' : ''} logged
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-control border border-glass-border bg-tint/5 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={cn(
                'rounded-[11px] px-3 py-1.5 text-xs font-medium transition-colors',
                viewMode === 'week'
                  ? 'bg-primary/20 text-primary'
                  : 'text-ink-secondary hover:text-ink',
              )}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={cn(
                'rounded-[11px] px-3 py-1.5 text-xs font-medium transition-colors',
                viewMode === 'month'
                  ? 'bg-primary/20 text-primary'
                  : 'text-ink-secondary hover:text-ink',
              )}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Date Navigator */}
      <GlassCard className="space-y-3 p-4">
        {viewMode === 'week' ? (
          <>
            {/* Week strip */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setWeekAnchor((prev) => shiftWeek(prev, -1))}
                className="rounded-full p-1 text-ink-secondary transition-colors hover:text-ink"
                aria-label="Previous week"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </button>
              <span className="text-xs font-medium text-ink-secondary">
                {formatDateShort(weekDays[0])} – {formatDateShort(weekDays[6])}
              </span>
              <button
                type="button"
                onClick={() => setWeekAnchor((prev) => shiftWeek(prev, 1))}
                className="rounded-full p-1 text-ink-secondary transition-colors hover:text-ink"
                aria-label="Next week"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {/* Day pills */}
            <div className="flex gap-1">
              {weekDays.map((dateStr) => {
                const future = isFuture(dateStr)
                const isToday = dateStr === today
                const isSelected = dateStr === selectedDate
                const hasEntries = datesWithEntries.has(dateStr)
                const d = new Date(dateStr + 'T00:00:00')
                const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' })
                const dayNum = d.getDate()

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={future}
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      'relative flex flex-1 flex-col items-center gap-0.5 rounded-control py-2 text-xs transition-all duration-200',
                      future && 'cursor-not-allowed opacity-30',
                      isSelected && 'bg-primary/15 text-primary shadow-glow',
                      !isSelected &&
                        !future &&
                        'text-ink-secondary hover:bg-tint/5 hover:text-ink',
                    )}
                  >
                    <span className="text-[10px] uppercase tracking-wider opacity-70">
                      {dayLabel}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        isToday && !isSelected && 'text-primary',
                      )}
                    >
                      {dayNum}
                    </span>
                    {hasEntries && (
                      <span
                        className={cn(
                          'mt-0.5 h-1 w-1 rounded-full',
                          isSelected ? 'bg-primary' : 'bg-primary/50',
                        )}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <>
            {/* Month navigator */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMonthYear(([y, m]) => shiftMonth(y, m, -1))}
                className="rounded-full p-1 text-ink-secondary hover:text-ink"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </button>
              <span className="text-xs font-medium text-ink-secondary">{monthLabel}</span>
              <button
                type="button"
                onClick={() => setMonthYear(([y, m]) => shiftMonth(y, m, 1))}
                className="rounded-full p-1 text-ink-secondary hover:text-ink"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span
                  key={d}
                  className="text-[10px] font-medium uppercase tracking-wider text-ink-secondary/60"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((dateStr, i) => {
                if (!dateStr) return <div key={`empty-${i}`} />
                const future = isFuture(dateStr)
                const isToday = dateStr === today
                const isSelected = dateStr === selectedDate
                const hasEntries = datesWithEntries.has(dateStr)
                const dayNum = Number(dateStr.slice(8))

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={future}
                    onClick={() => {
                      setSelectedDate(dateStr)
                      setViewMode('week')
                      setWeekAnchor(dateStr)
                    }}
                    className={cn(
                      'relative flex aspect-square items-center justify-center rounded-cell text-xs font-medium transition-all duration-200',
                      future && 'cursor-not-allowed opacity-25',
                      isSelected && 'bg-primary/15 text-primary shadow-glow',
                      isToday && !isSelected && 'text-primary',
                      !isSelected &&
                        !future &&
                        !isToday &&
                        'text-ink-secondary hover:bg-tint/5 hover:text-ink',
                    )}
                  >
                    {dayNum}
                    {hasEntries && (
                      <span
                        className={cn(
                          'absolute bottom-0.5 h-1 w-1 rounded-full',
                          isSelected ? 'bg-primary' : 'bg-primary/50',
                        )}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </GlassCard>

      {/* Selected day header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-ink">
            {selectedDate === today ? 'Today' : formatDateLabel(selectedDate)}
          </h2>
          <p className="text-sm text-ink-secondary">
            {selectedEntries.length} session{selectedEntries.length !== 1 ? 's' : ''}
          </p>
        </div>
        {!isFuture(selectedDate) && (
          <Button size="sm" onClick={openAddForm}>
            <Plus className="h-4 w-4" strokeWidth={2} />
            Log Session
          </Button>
        )}
      </div>

      {/* Entry form */}
      {showForm && (
        <GlassCard className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-ink">
              {editingId ? 'Edit Session' : 'New Session'}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-md p-1 text-ink-secondary/60 transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-ink-secondary">Start</label>
                <input
                  type="time"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                  className="w-full rounded-control border border-glass-border bg-tint/5 px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-ink-secondary">End</label>
                <input
                  type="time"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                  className="w-full rounded-control border border-glass-border bg-tint/5 px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                />
              </div>
            </div>
            {/* Productive toggle */}
            <div className="flex items-center justify-between rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5">
              <span className="text-sm text-ink">Productive session</span>
              <button
                type="button"
                role="switch"
                aria-checked={formProductive}
                onClick={() => setFormProductive((prev) => !prev)}
                className={cn(
                  'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                  formProductive ? 'bg-primary' : 'bg-tint/20',
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out',
                    formProductive ? 'translate-x-4' : 'translate-x-0',
                  )}
                />
              </button>
            </div>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="What did you work on?"
              className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary placeholder:text-ink-secondary/50"
            />
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Notes, reflections, what you learned... (optional)"
              rows={3}
              className="w-full resize-none rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary placeholder:text-ink-secondary/50"
            />
            {formError && (
              <p className="rounded-control bg-danger/10 px-3 py-2 text-xs text-danger">
                {formError}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 justify-center"
                onClick={closeForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 justify-center"
                disabled={!formTitle.trim() || !formStart || !formEnd || isSaving}
              >
                {isSaving ? 'Saving...' : editingId ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Entries list */}
      {isLoading ? (
        <p className="py-8 text-center text-sm text-ink-secondary">Loading sessions...</p>
      ) : selectedEntries.length === 0 ? (
        <GlassCard className="py-10 text-center">
          <BookOpen
            className="mx-auto mb-3 h-8 w-8 text-ink-secondary/40"
            strokeWidth={1.5}
          />
          <p className="text-sm text-ink-secondary">
            {isFuture(selectedDate)
              ? 'You cannot log sessions for future dates.'
              : 'No sessions logged for this day.'}
          </p>
          {!isFuture(selectedDate) && (
            <Button size="sm" variant="secondary" className="mt-3" onClick={openAddForm}>
              <Plus className="h-4 w-4" strokeWidth={2} />
              Log your first session
            </Button>
          )}
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {selectedEntries.map((entry) => (
            <GlassCard
              key={entry.$id}
              className="group flex items-start gap-4 p-4 transition-shadow hover:shadow-glass"
            >
              {/* Time badge */}
              <div className="shrink-0 rounded-control border border-glass-border bg-tint/5 px-3 py-2 text-center">
                <p className="font-mono text-xs font-semibold text-primary">
                  {entry.startTime}
                </p>
                <p className="font-mono text-[10px] text-ink-secondary">to</p>
                <p className="font-mono text-xs font-semibold text-ink">
                  {entry.endTime}
                </p>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-semibold text-ink">
                    {entry.title}
                  </h4>
                  {entry.productive && (
                    <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Productive
                    </span>
                  )}
                </div>
                {entry.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-ink-secondary">
                    {entry.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEditForm(entry)}
                  className="rounded-md p-1.5 text-ink-secondary/60 transition-colors hover:text-ink"
                  aria-label="Edit session"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteEntry(entry.$id)}
                  className="rounded-md p-1.5 text-ink-secondary/60 transition-colors hover:text-danger"
                  aria-label="Delete session"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default Workbook

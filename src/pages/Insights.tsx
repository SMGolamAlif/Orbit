import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useWorkbook } from '@/hooks/useWorkbook'
import {
  FOCUS_SESSION_EVENT,
  getFocusMinutesInRange,
  getMonthlyFocusData,
  getWeeklyFocusData,
} from '@/lib/focus-sessions'
import { getLifeCalendarStats } from '@/lib/life-calendar'
import { CATEGORY_VARIANT } from '@/lib/task-constants'
import {
  getMonthlyProductiveData,
  getProductiveMinutesInRange,
  getWeeklyProductiveData,
} from '@/lib/weekly-productive'
import { cn } from '@/lib/utils'

type Range = 'week' | 'month'

// ─── Helpers ────────────────────────────────────────────────────

function formatDuration(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function formatDateLabel(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// ─── Component ──────────────────────────────────────────────────

function Insights() {
  const { user, profile } = useAuth()
  const { tasks } = useTasks()
  const { entries: workbookEntries } = useWorkbook()
  const [range, setRange] = useState<Range>('week')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    function handleUpdate() {
      setRefreshKey((current) => current + 1)
    }
    window.addEventListener(FOCUS_SESSION_EVENT, handleUpdate)
    return () => window.removeEventListener(FOCUS_SESSION_EVENT, handleUpdate)
  }, [])

  // ── Focus + Productive merged data ──────────────────────────

  const weeklyData = useMemo(() => {
    if (!user) return []
    const focusData = getWeeklyFocusData(user.$id)
    const productiveData = getWeeklyProductiveData(workbookEntries)
    return focusData.map((focusDay) => {
      const productiveDay = productiveData.find((p) => p.day === focusDay.day)
      return { day: focusDay.day, hours: focusDay.hours + (productiveDay?.hours ?? 0) }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey, workbookEntries])

  const monthlyData = useMemo(() => {
    if (!user) return []
    const focusMonthly = getMonthlyFocusData(user.$id)
    const productiveMonthly = getMonthlyProductiveData(workbookEntries)
    return focusMonthly.map((focusBucket) => {
      const productiveBucket = productiveMonthly.find(
        (p) => p.label === focusBucket.label,
      )
      return {
        label: focusBucket.label,
        hours: focusBucket.hours + (productiveBucket?.hours ?? 0),
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey, workbookEntries])

  const chartData =
    range === 'week'
      ? weeklyData.map((d) => ({ label: d.day, hours: d.hours }))
      : monthlyData.map((d) => ({ label: d.label, hours: d.hours }))

  const maxHours = Math.max(...chartData.map((d) => d.hours), 1)
  const totalChartHours = chartData.reduce((sum, d) => sum + d.hours, 0)

  const focusMinutes7d = useMemo(() => {
    const timerMinutes = user ? getFocusMinutesInRange(user.$id, 7) : 0
    const workbookMinutes = getProductiveMinutesInRange(workbookEntries, 7)
    return timerMinutes + workbookMinutes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey, workbookEntries])

  const focusMinutes30d = useMemo(() => {
    const timerMinutes = user ? getFocusMinutesInRange(user.$id, 30) : 0
    const workbookMinutes = getProductiveMinutesInRange(workbookEntries, 30)
    return timerMinutes + workbookMinutes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey, workbookEntries])

  // ── Tasks ────────────────────────────────────────────────────

  const completedTasks = tasks.filter((task) => task.status === 'done')
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    completedTasks.forEach((task) => {
      map.set(task.category, (map.get(task.category) ?? 0) + 1)
    })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [completedTasks])

  const maxCategoryCount = Math.max(...categoryBreakdown.map(([, c]) => c), 1)

  // ── Life ─────────────────────────────────────────────────────

  const lifeStats = useMemo(() => {
    if (!profile) return null
    return getLifeCalendarStats(new Date(profile.birthDate), profile.lifeExpectancyYears)
  }, [profile])

  // ── Recent sessions ──────────────────────────────────────────

  const recentSessions = useMemo(
    () =>
      [...workbookEntries]
        .sort((a, b) => b.$createdAt.localeCompare(a.$createdAt))
        .slice(0, 5),
    [workbookEntries],
  )

  // ── Render ───────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-control bg-primary/15">
          <BarChart3 className="h-4 w-4 text-primary" strokeWidth={2} />
        </div>
        <div>
          <h1 className="font-heading text-xl font-semibold text-ink">Insights</h1>
          <p className="text-sm text-ink-secondary">Your productivity at a glance</p>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard className="relative overflow-hidden p-5">
          <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-primary/10" />
          <div className="relative space-y-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/15 p-1.5">
                <Timer className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                7 days
              </span>
            </div>
            <p className="font-mono text-3xl font-semibold text-ink">
              {formatDuration(focusMinutes7d)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
              <TrendingUp className="h-3 w-3" strokeWidth={2} />
              <span>Total focus time</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden p-5">
          <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-secondary/10" />
          <div className="relative space-y-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-secondary/15 p-1.5">
                <Clock className="h-3.5 w-3.5 text-secondary" strokeWidth={2} />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                30 days
              </span>
            </div>
            <p className="font-mono text-3xl font-semibold text-ink">
              {formatDuration(focusMinutes30d)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
              <Flame className="h-3 w-3" strokeWidth={2} />
              <span>Monthly total</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden p-5">
          <div className="absolute inset-y-3 right-3">
            <ProgressRing progress={completionRate} size={56} strokeWidth={5}>
              <span className="font-mono text-[11px] font-semibold text-ink">
                {completionRate}%
              </span>
            </ProgressRing>
          </div>
          <div className="relative space-y-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-success/15 p-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" strokeWidth={2} />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                Tasks
              </span>
            </div>
            <p className="font-mono text-3xl font-semibold text-ink">
              {completedTasks.length}
              <span className="text-lg text-ink-secondary">/{tasks.length}</span>
            </p>
            <p className="text-xs text-ink-secondary">Completed tasks</p>
          </div>
        </GlassCard>
      </div>

      {/* Main content: chart + recent sessions side by side */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Focus Time chart */}
        <GlassCard className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-semibold text-ink">
                Focus Time
              </h2>
              <p className="mt-0.5 text-xs text-ink-secondary">
                {range === 'week' ? 'Daily breakdown' : 'Weekly breakdown'}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-control border border-glass-border bg-tint/5 p-1">
              <button
                type="button"
                onClick={() => setRange('week')}
                className={cn(
                  'rounded-[10px] px-3 py-1.5 text-xs font-medium transition-colors',
                  range === 'week'
                    ? 'bg-primary/20 text-primary'
                    : 'text-ink-secondary hover:text-ink',
                )}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setRange('month')}
                className={cn(
                  'rounded-[10px] px-3 py-1.5 text-xs font-medium transition-colors',
                  range === 'month'
                    ? 'bg-primary/20 text-primary'
                    : 'text-ink-secondary hover:text-ink',
                )}
              >
                Month
              </button>
            </div>
          </div>

          {chartData.every((entry) => entry.hours === 0) ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-3 rounded-full bg-tint/5 p-3">
                <BarChart3 className="h-6 w-6 text-ink-secondary/40" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-ink-secondary">
                No focus data yet. Use the Focus Timer or log a productive session.
              </p>
            </div>
          ) : (
            <>
              <div className="flex h-48 items-end justify-center gap-5">
                {chartData.map((entry, index) => {
                  const heightPct = Math.max(
                    (entry.hours / maxHours) * 100,
                    entry.hours > 0 ? 6 : 2,
                  )
                  const isPeak = entry.hours === maxHours && entry.hours > 0
                  return (
                    <div
                      key={`${entry.label}-${index}`}
                      className="group relative flex flex-col items-center gap-2"
                    >
                      {/* Tooltip */}
                      <div className="invisible absolute -top-9 z-10 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-surface opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                        {entry.hours.toFixed(1)}h
                      </div>
                      {/* Bar */}
                      <div className="flex h-40 w-8 items-end overflow-hidden rounded-full bg-tint/5">
                        <div
                          className={cn(
                            'w-full rounded-full transition-all duration-500',
                            isPeak
                              ? 'bg-gradient-to-t from-secondary to-highlight'
                              : 'bg-gradient-to-t from-primary/60 to-primary',
                          )}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-ink-secondary">
                        {entry.label}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-5 flex items-center justify-center gap-6 border-t border-glass-border pt-4">
                <div className="text-center">
                  <p className="font-mono text-lg font-semibold text-ink">
                    {totalChartHours.toFixed(1)}h
                  </p>
                  <p className="text-[11px] text-ink-secondary">Total</p>
                </div>
                <div className="h-8 w-px bg-glass-border" />
                <div className="text-center">
                  <p className="font-mono text-lg font-semibold text-ink">
                    {(totalChartHours / chartData.length).toFixed(1)}h
                  </p>
                  <p className="text-[11px] text-ink-secondary">Avg / day</p>
                </div>
                <div className="h-8 w-px bg-glass-border" />
                <div className="text-center">
                  <p className="font-mono text-lg font-semibold text-ink">
                    {maxHours.toFixed(1)}h
                  </p>
                  <p className="text-[11px] text-ink-secondary">Best day</p>
                </div>
              </div>
            </>
          )}
        </GlassCard>

        {/* Recent Sessions */}
        <GlassCard className="flex flex-col p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-warning/15 p-1.5">
              <Clock className="h-3.5 w-3.5 text-warning" strokeWidth={2} />
            </div>
            <h2 className="font-heading text-base font-semibold text-ink">
              Recent Sessions
            </h2>
          </div>

          {recentSessions.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-3 rounded-full bg-tint/5 p-3">
                <Target className="h-5 w-5 text-ink-secondary/40" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-ink-secondary">No sessions logged yet.</p>
              <p className="mt-1 text-xs text-ink-secondary/60">
                Log a session in the Workbook to see it here.
              </p>
            </div>
          ) : (
            <ul className="flex-1 space-y-2 overflow-y-auto">
              {recentSessions.map((session) => {
                const [startH, startM] = (session.startTime ?? '00:00')
                  .split(':')
                  .map(Number)
                const [endH, endM] = (session.endTime ?? '00:00').split(':').map(Number)
                const durationMin = Math.max(0, endH * 60 + endM - (startH * 60 + startM))
                return (
                  <li
                    key={session.$id}
                    className="group flex items-center gap-3 rounded-control border border-glass-border bg-tint/5 px-3.5 py-3 transition-colors hover:border-primary/30"
                  >
                    {/* Time pill */}
                    <div className="shrink-0 rounded-lg bg-tint/10 px-2.5 py-1.5 text-center">
                      <p className="font-mono text-[11px] font-semibold text-primary">
                        {session.startTime}
                      </p>
                      <p className="font-mono text-[10px] leading-tight text-ink-secondary/50">
                        {session.endTime}
                      </p>
                    </div>
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="min-w-0 truncate text-sm font-medium text-ink">
                          {session.title}
                        </p>
                        {session.productive && (
                          <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            Prod
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-ink-secondary">
                        {formatDateLabel(session.date)} · {formatDuration(durationMin)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </GlassCard>
      </div>

      {/* Bottom row: Categories + Life Progress */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Completed Tasks by Category */}
        <GlassCard className="p-6">
          <div className="mb-5 flex items-center gap-2">
            <div className="rounded-lg bg-primary/15 p-1.5">
              <Target className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            </div>
            <h2 className="font-heading text-base font-semibold text-ink">
              Tasks by Category
            </h2>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-3 rounded-full bg-tint/5 p-3">
                <CheckCircle2
                  className="h-5 w-5 text-ink-secondary/40"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-sm text-ink-secondary">
                Complete a few tasks to see the breakdown.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {categoryBreakdown.map(([category, count]) => {
                const pct = Math.round((count / maxCategoryCount) * 100)
                const variant = CATEGORY_VARIANT[category] ?? 'default'
                return (
                  <li key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Badge variant={variant} className="text-[11px]">
                        {category}
                      </Badge>
                      <span className="font-mono text-xs font-medium text-ink-secondary">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-tint/5">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-700',
                          variant === 'primary' && 'bg-primary/60',
                          variant === 'success' && 'bg-success/60',
                          variant === 'warning' && 'bg-warning/60',
                          variant === 'danger' && 'bg-danger/60',
                          variant === 'default' && 'bg-tint/40',
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </GlassCard>

        {/* Life Progress */}
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 rounded-lg bg-secondary/15 p-1.5">
            <Flame className="h-3.5 w-3.5 text-secondary" strokeWidth={2} />
          </div>
          <h2 className="font-heading text-base font-semibold text-ink">Life Progress</h2>

          {lifeStats ? (
            <>
              <ProgressRing
                progress={lifeStats.progressPercent}
                size={150}
                strokeWidth={10}
                className="my-5"
                gradient={{ from: 'primary', to: 'secondary' }}
              >
                <div className="text-center">
                  <p className="font-mono text-2xl font-semibold text-ink">
                    {lifeStats.progressPercent}%
                  </p>
                  <p className="text-[11px] text-ink-secondary">lived</p>
                </div>
              </ProgressRing>

              <div className="grid w-full max-w-xs grid-cols-2 gap-3">
                <div className="rounded-control border border-glass-border bg-tint/5 px-3 py-2.5 text-center">
                  <p className="font-mono text-sm font-semibold text-ink">
                    {lifeStats.weeksLived.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-ink-secondary">Weeks lived</p>
                </div>
                <div className="rounded-control border border-glass-border bg-tint/5 px-3 py-2.5 text-center">
                  <p className="font-mono text-sm font-semibold text-ink">
                    {lifeStats.weeksRemaining.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-ink-secondary">Weeks ahead</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="mb-3 rounded-full bg-tint/5 p-3">
                <Flame className="h-5 w-5 text-ink-secondary/40" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-ink-secondary">
                Complete onboarding to see your life progress.
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

export default Insights

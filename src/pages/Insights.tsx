import { useEffect, useMemo, useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import {
  FOCUS_SESSION_EVENT,
  getFocusMinutesInRange,
  getMonthlyFocusData,
  getWeeklyFocusData,
} from '@/lib/focus-sessions'
import { getLifeCalendarStats } from '@/lib/life-calendar'
import { CATEGORY_VARIANT } from '@/lib/task-constants'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Range = 'week' | 'month'

function Insights() {
  const { user, profile } = useAuth()
  const { tasks } = useTasks()
  const [range, setRange] = useState<Range>('week')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    function handleUpdate() {
      setRefreshKey((current) => current + 1)
    }
    window.addEventListener(FOCUS_SESSION_EVENT, handleUpdate)
    return () => window.removeEventListener(FOCUS_SESSION_EVENT, handleUpdate)
  }, [])

  const weeklyData = useMemo(
    () => (user ? getWeeklyFocusData(user.$id) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, refreshKey],
  )
  const monthlyData = useMemo(
    () => (user ? getMonthlyFocusData(user.$id) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, refreshKey],
  )
  const chartData = range === 'week' ? weeklyData.map((d) => ({ label: d.day, hours: d.hours })) : monthlyData.map((d) => ({ label: d.label, hours: d.hours }))
  const maxHours = Math.max(...chartData.map((d) => d.hours), 1)

  const focusMinutes7d = useMemo(
    () => (user ? getFocusMinutesInRange(user.$id, 7) : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, refreshKey],
  )
  const focusMinutes30d = useMemo(
    () => (user ? getFocusMinutesInRange(user.$id, 30) : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, refreshKey],
  )

  const completedTasks = tasks.filter((task) => task.status === 'done')
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    completedTasks.forEach((task) => {
      map.set(task.category, (map.get(task.category) ?? 0) + 1)
    })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [completedTasks])

  const lifeStats = useMemo(() => {
    if (!profile) return null
    return getLifeCalendarStats(new Date(profile.birthDate), profile.lifeExpectancyYears)
  }, [profile])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard className="space-y-1.5 p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Focus — 7 days</p>
          <p className="font-mono text-3xl font-semibold text-ink">
            {Math.floor(focusMinutes7d / 60)}h {focusMinutes7d % 60}m
          </p>
        </GlassCard>
        <GlassCard className="space-y-1.5 p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Focus — 30 days</p>
          <p className="font-mono text-3xl font-semibold text-ink">
            {Math.floor(focusMinutes30d / 60)}h {focusMinutes30d % 60}m
          </p>
        </GlassCard>
        <GlassCard className="space-y-1.5 p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Task completion</p>
          <p className="font-mono text-3xl font-semibold text-ink">{completionRate}%</p>
          <p className="text-xs text-ink-secondary">
            {completedTasks.length} of {tasks.length} tasks done
          </p>
        </GlassCard>
      </div>

      <GlassCard className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-ink">Focus Time</h2>
          <div className="flex items-center gap-1 rounded-control border border-glass-border bg-tint/5 p-1 text-sm">
            <button
              type="button"
              onClick={() => setRange('week')}
              className={cn('rounded-[10px] px-3 py-1.5 text-ink-secondary transition-colors', range === 'week' && 'bg-tint/10 text-ink')}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setRange('month')}
              className={cn('rounded-[10px] px-3 py-1.5 text-ink-secondary transition-colors', range === 'month' && 'bg-tint/10 text-ink')}
            >
              Monthly
            </button>
          </div>
        </div>

        {chartData.every((entry) => entry.hours === 0) ? (
          <p className="py-10 text-center text-sm text-ink-secondary">
            No focus sessions logged yet. Complete a session on the Focus Timer to see analytics here.
          </p>
        ) : (
          <div className="flex h-40 items-end justify-center gap-6">
            {chartData.map((entry, index) => (
              <div key={`${entry.label}-${index}`} className="flex flex-col items-center gap-2">
                <div className="flex h-32 w-4 items-end overflow-hidden rounded-full bg-tint/5">
                  <div
                    className="w-full rounded-full bg-gradient-to-t from-primary to-secondary transition-all duration-500"
                    style={{ height: `${Math.max((entry.hours / maxHours) * 100, entry.hours > 0 ? 8 : 2)}%` }}
                  />
                </div>
                <span className="text-[11px] text-ink-secondary">{entry.label}</span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard className="space-y-4 p-6">
          <h2 className="font-heading text-base font-semibold text-ink">Completed Tasks by Category</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-ink-secondary">Complete a few tasks to see the breakdown here.</p>
          ) : (
            <ul className="space-y-2.5">
              {categoryBreakdown.map(([category, count]) => (
                <li key={category} className="flex items-center justify-between rounded-control border border-glass-border bg-tint/5 px-3 py-2">
                  <Badge variant={CATEGORY_VARIANT[category] ?? 'default'}>{category}</Badge>
                  <span className="text-sm text-ink-secondary">{count} done</span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center gap-4 p-6 text-center">
          <h2 className="font-heading text-base font-semibold text-ink">Life Progress</h2>
          {lifeStats ? (
            <>
              <ProgressRing progress={lifeStats.progressPercent} size={140} strokeWidth={12}>
                <div className="text-center">
                  <p className="font-mono text-2xl font-semibold text-ink">{lifeStats.progressPercent}%</p>
                  <p className="text-[11px] text-ink-secondary">lived</p>
                </div>
              </ProgressRing>
              <p className="text-sm text-ink-secondary">
                {lifeStats.weeksLived.toLocaleString()} weeks lived · {lifeStats.weeksRemaining.toLocaleString()} weeks ahead
              </p>
            </>
          ) : (
            <p className="text-sm text-ink-secondary">Complete onboarding to see your life progress.</p>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

export default Insights

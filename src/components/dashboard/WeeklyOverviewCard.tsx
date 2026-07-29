import { useEffect, useMemo, useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { useAuth } from '@/hooks/useAuth'
import { useWorkbook } from '@/hooks/useWorkbook'
import { FOCUS_SESSION_EVENT, getWeeklyFocusData } from '@/lib/focus-sessions'
import { getWeeklyProductiveData } from '@/lib/weekly-productive'
import { cn } from '@/lib/utils'

function WeeklyOverviewCard() {
  const { user } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const { entries: workbookEntries } = useWorkbook()

  useEffect(() => {
    function handleUpdate() {
      setRefreshKey((current) => current + 1)
    }
    window.addEventListener(FOCUS_SESSION_EVENT, handleUpdate)
    return () => window.removeEventListener(FOCUS_SESSION_EVENT, handleUpdate)
  }, [])

  const weekData = useMemo(() => {
    if (!user) return []

    const focusData = getWeeklyFocusData(user.$id)
    const productiveData = getWeeklyProductiveData(workbookEntries)

    // Merge: sum hours from both sources per day
    return focusData.map((focusDay) => {
      const productiveDay = productiveData.find(
        (p: { day: string; hours: number }) => p.day === focusDay.day,
      )
      return {
        day: focusDay.day,
        hours: focusDay.hours + (productiveDay?.hours ?? 0),
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey, workbookEntries])

  const maxHours = Math.max(...weekData.map((entry) => entry.hours), 1)
  const totalHours = weekData.reduce((sum, entry) => sum + entry.hours, 0)
  const peakDay = weekData.reduce(
    (peak, entry) => (entry.hours > peak.hours ? entry : peak),
    weekData[0] ?? { day: '', hours: 0 },
  )

  return (
    <GlassCard className="space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-ink">Weekly Overview</h2>
        <span className="text-xs text-ink-secondary">Last 7 days</span>
      </div>

      {totalHours === 0 ? (
        <p className="py-8 text-center text-sm text-ink-secondary">
          No focus sessions or productive entries logged yet. Start the Focus Timer or log
          a productive session in the Workbook.
        </p>
      ) : (
        <div className="flex h-36 items-end justify-center gap-4">
          {weekData.map((entry, index) => (
            <div
              key={`${entry.day}-${index}`}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-28 w-2.5 items-end overflow-hidden rounded-full bg-tint/5 transition-transform duration-200 hover:scale-105">
                <div
                  className={cn(
                    'w-full rounded-full bg-gradient-to-t from-primary to-secondary transition-all duration-500',
                    entry.day === peakDay.day &&
                      entry.hours === peakDay.hours &&
                      'from-secondary to-highlight',
                  )}
                  style={{
                    height: `${Math.max((entry.hours / maxHours) * 100, entry.hours > 0 ? 10 : 2)}%`,
                  }}
                />
              </div>
              <span className="text-[11px] text-ink-secondary">{entry.day}</span>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="font-mono text-2xl font-semibold text-ink">
          {totalHours.toFixed(1)}h
        </p>
        <p className="text-xs text-ink-secondary">Total Focus Time</p>
      </div>
    </GlassCard>
  )
}

export { WeeklyOverviewCard }

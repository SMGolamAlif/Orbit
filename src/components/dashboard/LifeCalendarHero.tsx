import { useMemo, useState } from 'react'
import { Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { useAccent } from '@/hooks/useAccent'
import {
  formatWeekRange,
  getLifeCalendarStats,
  getWeekColor,
  getWeekDateRange,
  WEEKS_PER_YEAR,
  type GradientStop,
} from '@/lib/life-calendar'
import { cn } from '@/lib/utils'

interface LifeCalendarHeroProps {
  birthDate: Date
  lifeExpectancyYears: number
  compact?: boolean
  className?: string
}

const ROW_GAP = 2
const COLUMN_GAP = 2

function LifeCalendarHero({
  birthDate,
  lifeExpectancyYears,
  compact = false,
  className,
}: LifeCalendarHeroProps) {
  const navigate = useNavigate()
  const { colors } = useAccent()
  const [yearView, setYearView] = useState(false)
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)

  const stats = useMemo(
    () => getLifeCalendarStats(birthDate, lifeExpectancyYears),
    [birthDate, lifeExpectancyYears],
  )
  const totalYears = Math.ceil(stats.totalWeeks / WEEKS_PER_YEAR)

  const gradientStops = useMemo<GradientStop[]>(() => {
    function toRgb(channels: string): [number, number, number] {
      const [r, g, b] = channels.split(' ').map(Number)
      return [r, g, b]
    }
    return [
      { stop: 0, rgb: toRgb(colors.primary) },
      { stop: 0.5, rgb: toRgb(colors.secondary) },
      { stop: 1, rgb: toRgb(colors.highlight) },
    ]
  }, [colors])

  const hoveredInfo = useMemo(() => {
    if (hoveredWeek === null) return null
    const { start, end } = getWeekDateRange(birthDate, hoveredWeek)
    return {
      week: hoveredWeek + 1,
      range: formatWeekRange(start, end),
      age: (hoveredWeek / WEEKS_PER_YEAR).toFixed(1),
    }
  }, [hoveredWeek, birthDate])

  const today = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  return (
    <GlassCard
      className={cn(
        'relative flex flex-col overflow-hidden p-6 md:p-8',
        compact && 'p-4 md:p-5',
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative flex shrink-0 flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Your Life in Weeks</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-4xl font-bold text-ink md:text-5xl">
              {stats.weeksRemaining.toLocaleString()}
            </span>
            <span className="font-heading text-xl text-ink-secondary md:text-2xl">weeks remaining</span>
          </div>
          <p className="mt-2 max-w-md text-sm italic text-ink-secondary">
            Live intentionally. You don&apos;t get this time back.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-control border border-glass-border bg-tint/5 px-4 py-2.5 text-right text-xs text-ink-secondary">
            <p className="font-mono text-sm font-semibold text-ink">
              Week {stats.weeksLived.toLocaleString()}
            </p>
            <p>
              Age {stats.ageYears.toFixed(1)} · {today}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setYearView((current) => !current)}>
            {yearView ? 'Grid view' : 'Year view'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Life Calendar settings"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      </div>

      <div className="relative mt-6 flex min-h-0 flex-1 gap-2">
        {yearView ? (
          <div
            className="grid shrink-0 text-right font-mono text-[9px] leading-none text-muted"
            style={{ gridTemplateRows: `repeat(${totalYears}, minmax(0, 1fr))`, rowGap: `${ROW_GAP}px` }}
          >
            {Array.from({ length: totalYears }, (_, rowIndex) => (
              <span key={rowIndex} className="flex items-center justify-end">
                {rowIndex % 10 === 0 ? rowIndex : ''}
              </span>
            ))}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-hidden pr-1">
          <div
            className="grid h-full"
            style={{
              gridTemplateColumns: `repeat(${WEEKS_PER_YEAR}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${totalYears}, minmax(0, 1fr))`,
              columnGap: `${COLUMN_GAP}px`,
              rowGap: `${ROW_GAP}px`,
            }}
          >
            {Array.from({ length: stats.totalWeeks }, (_, weekIndex) => {
              const isLived = weekIndex < stats.weeksLived
              const isCurrent = weekIndex === stats.currentWeekIndex
              const color = isLived ? getWeekColor(weekIndex / Math.max(stats.weeksLived, 1), gradientStops) : undefined

              return (
                <div
                  key={weekIndex}
                  onMouseEnter={() => setHoveredWeek(weekIndex)}
                  onMouseLeave={() => setHoveredWeek((current) => (current === weekIndex ? null : current))}
                  className={cn(
                    'relative rounded-[1px] border border-tint/5 transition-colors duration-100 hover:z-20 hover:border-primary hover:shadow-[0_0_0_1px_rgb(var(--color-primary)/0.8)]',
                    !isLived && 'bg-tint/[0.04]',
                    isCurrent && 'animate-pulse ring-2 ring-primary ring-offset-1 ring-offset-surface',
                  )}
                  style={{ backgroundColor: color }}
                />
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex shrink-0 flex-wrap items-center justify-between gap-3 text-xs text-ink-secondary">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
            Weeks lived
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-primary bg-primary/30" />
            Current week
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border border-tint/10" />
            Weeks remaining
          </span>
        </div>
        <span>
          {hoveredInfo
            ? `Week ${hoveredInfo.week} · ${hoveredInfo.range} · Age ${hoveredInfo.age}`
            : '1 square = 1 week'}
        </span>
      </div>
    </GlassCard>
  )
}

export { LifeCalendarHero }

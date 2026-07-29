import { ArrowUpRight, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { ProgressRing } from '@/components/ui/progress-ring'
import type { LifeCalendarStats } from '@/lib/life-calendar'

interface LifeOverviewCardProps {
  stats: LifeCalendarStats
  onOpenInsights: () => void
}

function LifeOverviewCard({ stats, onOpenInsights }: LifeOverviewCardProps) {
  return (
    <GlassCard className="space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-ink">Life Overview</h2>
        <Crown className="h-4 w-4 text-warning" strokeWidth={2} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-control border border-glass-border bg-tint/5 px-3 py-2.5">
          <span className="text-xs text-ink-secondary">Current Age</span>
          <span className="font-mono text-sm font-semibold text-ink">
            {stats.ageYears.toFixed(1)} years
          </span>
        </div>
        <div className="flex items-center justify-between rounded-control border border-glass-border bg-tint/5 px-3 py-2.5">
          <span className="text-xs text-ink-secondary">Weeks Lived</span>
          <span className="font-mono text-sm font-semibold text-ink">
            {stats.weeksLived.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-control border border-glass-border bg-tint/5 px-3 py-2.5">
          <span className="text-xs text-ink-secondary">Life Progress</span>
          <ProgressRing progress={stats.progressPercent} size={40} strokeWidth={5}>
            <span className="font-mono text-[10px] font-semibold text-ink">{stats.progressPercent}%</span>
          </ProgressRing>
        </div>
      </div>

      <Button variant="secondary" className="w-full justify-center" onClick={onOpenInsights}>
        Open Life Insights
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
      </Button>
    </GlassCard>
  )
}

export { LifeOverviewCard }

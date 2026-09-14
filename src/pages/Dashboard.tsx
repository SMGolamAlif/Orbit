import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FocusTimerCard } from '@/components/dashboard/FocusTimerCard'
import { HabitsCard } from '@/components/dashboard/HabitsCard'
import { LifeCalendarHero } from '@/components/dashboard/LifeCalendarHero'
import { LifeOverviewCard } from '@/components/dashboard/LifeOverviewCard'
import { QuickNotesCard } from '@/components/dashboard/QuickNotesCard'
import { QuoteCard } from '@/components/dashboard/QuoteCard'
import { TodaysFocusCard } from '@/components/dashboard/TodaysFocusCard'
import { WeeklyOverviewCard } from '@/components/dashboard/WeeklyOverviewCard'
import { useAuth } from '@/hooks/useAuth'
import { getLifeCalendarStats } from '@/lib/life-calendar'
import { DEFAULT_LIFE_EXPECTANCY } from '@/lib/life-expectancy'

function Dashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const birthDate = useMemo(
    () => (profile ? new Date(profile.birthDate) : new Date()),
    [profile],
  )
  const lifeExpectancyYears = profile?.lifeExpectancyYears ?? DEFAULT_LIFE_EXPECTANCY
  const stats = useMemo(
    () => getLifeCalendarStats(birthDate, lifeExpectancyYears),
    [birthDate, lifeExpectancyYears],
  )

  return (
    <div className="grid h-full gap-6 xl:grid-cols-[1fr_340px]">
      <div className="flex h-full min-h-0 flex-col gap-6">
        <LifeCalendarHero
          className="min-h-0 flex-1"
          birthDate={birthDate}
          lifeExpectancyYears={lifeExpectancyYears}
        />

        <div className="grid shrink-0 gap-6 md:grid-cols-3">
          <FocusTimerCard />
          <WeeklyOverviewCard />
          <QuickNotesCard />
        </div>
      </div>

      <div className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto pr-1">
        <LifeOverviewCard
          stats={stats}
          onOpenInsights={() => navigate('/app/insights')}
        />
        <TodaysFocusCard />
        <HabitsCard />
        <QuoteCard />
      </div>
    </div>
  )
}

export default Dashboard

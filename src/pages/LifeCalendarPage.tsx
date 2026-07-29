import { useMemo } from 'react'
import { LifeCalendarHero } from '@/components/dashboard/LifeCalendarHero'
import { useAuth } from '@/hooks/useAuth'
import { DEFAULT_LIFE_EXPECTANCY } from '@/lib/life-expectancy'

function LifeCalendarPage() {
  const { profile } = useAuth()
  const birthDate = useMemo(() => (profile ? new Date(profile.birthDate) : new Date()), [profile])

  return (
    <div className="flex h-full flex-col gap-6">
      <LifeCalendarHero
        className="flex-1"
        birthDate={birthDate}
        lifeExpectancyYears={profile?.lifeExpectancyYears ?? DEFAULT_LIFE_EXPECTANCY}
      />
    </div>
  )
}

export default LifeCalendarPage

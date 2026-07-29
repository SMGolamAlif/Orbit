import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { FooterBar } from '@/components/layout/FooterBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { FocusTimerProvider } from '@/context/FocusTimerContext'
import { useAuth } from '@/hooks/useAuth'
import { useSeedStarterContent } from '@/hooks/useSeedStarterContent'
import { getLifeCalendarStats } from '@/lib/life-calendar'

function AppShell() {
  const { profile } = useAuth()
  useSeedStarterContent()

  const stats = useMemo(() => {
    if (!profile) return null
    return getLifeCalendarStats(new Date(profile.birthDate), profile.lifeExpectancyYears)
  }, [profile])

  return (
    <FocusTimerProvider>
      <div className="flex min-h-screen bg-bg text-ink">
        <Sidebar progressPercent={stats?.progressPercent ?? 0} weeksLived={stats?.weeksLived ?? 0} />
        <div className="flex flex-1 flex-col">
          <Topbar />
          <main className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <Outlet />
          </main>
          <FooterBar />
        </div>
      </div>
    </FocusTimerProvider>
  )
}

export { AppShell }

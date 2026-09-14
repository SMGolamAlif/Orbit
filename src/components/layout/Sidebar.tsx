import {
  BookOpen,
  CalendarRange,
  CheckSquare,
  Clock,
  Kanban,
  LayoutDashboard,
  LineChart,
  ListChecks,
  NotebookPen,
  Settings,
  Timer,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { GlassCard } from '@/components/ui/glass-card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/life-calendar', label: 'Life Calendar', icon: CalendarRange, end: false },
  { to: '/app/tasks', label: 'Tasks', icon: CheckSquare, end: false },
  { to: '/app/kanban', label: 'Kanban', icon: Kanban, end: false },
  { to: '/app/notes', label: 'Notes', icon: NotebookPen, end: false },
  { to: '/app/workbook', label: 'Workbook', icon: BookOpen, end: false },
  { to: '/app/focus-timer', label: 'Focus Timer', icon: Timer, end: false },
  { to: '/app/clock', label: 'Clock', icon: Clock, end: false },
  { to: '/app/insights', label: 'Insights', icon: LineChart, end: false },
  { to: '/app/habits', label: 'Habits', icon: ListChecks, end: false },
  { to: '/app/settings', label: 'Settings', icon: Settings, end: false },
]

interface SidebarProps {
  progressPercent: number
  weeksLived: number
}

function Sidebar({ progressPercent, weeksLived }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-glass-border bg-glass p-5 backdrop-blur-glass lg:flex">
      <div className="flex items-center gap-2 px-2 pt-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-heading text-sm font-semibold text-white">
          O
        </div>
        <span className="font-heading text-lg font-semibold text-ink">Orbit</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-ink-secondary transition-all duration-200 hover:bg-tint/5 hover:text-ink',
                isActive && 'bg-tint/10 text-ink shadow-glow',
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <GlassCard className="space-y-3 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-secondary">
          Life Progress
        </p>
        <div className="flex items-center gap-3">
          <ProgressRing progress={progressPercent} size={56} strokeWidth={6}>
            <span className="font-mono text-sm font-semibold text-ink">
              {progressPercent}%
            </span>
          </ProgressRing>
          <div className="text-xs text-ink-secondary">
            <p className="font-mono text-sm font-semibold text-ink">
              {weeksLived.toLocaleString()}
            </p>
            <p>weeks lived</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="space-y-2 p-4">
        <p className="font-heading text-sm italic leading-relaxed text-ink-secondary">
          &ldquo;The days are long, but the years are short.&rdquo;
        </p>
        <p className="text-xs text-muted">— Gretchen Rubin</p>
      </GlassCard>
    </aside>
  )
}

export { Sidebar }

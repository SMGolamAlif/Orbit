import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  AlarmClock,
  Bell,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useAlarm } from '@/hooks/useAlarm'
import { useTasks } from '@/hooks/useTasks'

function getGreeting(date: Date) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function isOverdue(dueDate: string | null) {
  if (!dueDate) return false
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

function isDueToday(dueDate: string | null) {
  if (!dueDate) return false
  return new Date(dueDate).toDateString() === new Date().toDateString()
}

function Topbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { tasks } = useTasks()
  const { ringingId, ringingAlarm, dismiss } = useAlarm()
  const navigate = useNavigate()
  const greeting = getGreeting(new Date())
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const [openMenu, setOpenMenu] = useState<'notifications' | 'profile' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const incompleteTasks = tasks.filter((task) => task.status !== 'done')
  const overdueTasks = incompleteTasks.filter((task) => isOverdue(task.dueDate))
  const dueTodayTasks = incompleteTasks.filter((task) => isDueToday(task.dueDate))
  const notificationCount =
    overdueTasks.length + dueTodayTasks.length + (ringingId ? 1 : 0)

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="relative z-30 flex items-center justify-between gap-4 border-b border-glass-border bg-glass px-6 py-4 backdrop-blur-glass">
      <div>
        <h1 className="font-heading text-lg font-semibold text-ink">
          {greeting}, {firstName}.
        </h1>
        <p className="text-sm text-ink-secondary">Make every moment count.</p>
      </div>

      <div className="hidden max-w-md flex-1 items-center gap-2 rounded-control border border-glass-border bg-tint/5 px-4 py-2.5 text-sm text-ink-secondary md:flex">
        <span className="flex-1">Search anything...</span>
      </div>

      <div ref={containerRef} className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-tint/5 text-ink-secondary transition-colors hover:text-primary"
        >
          {theme === 'dark' ? (
            <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
          ) : (
            <Moon className="h-[18px] w-[18px]" strokeWidth={2} />
          )}
        </button>

        <Link
          to="/app/insights"
          aria-label="Insights"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-tint/5 text-ink-secondary transition-colors hover:text-primary"
        >
          <Activity className="h-[18px] w-[18px]" strokeWidth={2} />
        </Link>

        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() =>
              setOpenMenu((current) =>
                current === 'notifications' ? null : 'notifications',
              )
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-tint/5 text-ink-secondary transition-colors hover:text-primary"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
            {notificationCount > 0 ? (
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-danger" />
            ) : null}
          </button>

          {openMenu === 'notifications' ? (
            <div className="absolute right-0 top-12 z-20 w-72 rounded-card border border-glass-border bg-surface p-3 shadow-glass">
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Notifications
              </p>
              {notificationCount === 0 ? (
                <p className="px-1 py-2 text-sm text-ink-secondary">
                  You&apos;re all caught up. Nothing needs attention.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {ringingId && ringingAlarm && (
                    <li className="rounded-control bg-primary/10 px-2.5 py-2 text-sm text-ink">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigate('/app/clock')
                            setOpenMenu(null)
                          }}
                          className="flex flex-1 items-center gap-2 transition-opacity hover:opacity-80"
                        >
                          <AlarmClock
                            className="h-4 w-4 animate-pulse text-primary shrink-0"
                            strokeWidth={2}
                          />
                          <span className="text-left">
                            <span className="font-medium text-primary">
                              Alarm ringing:
                            </span>{' '}
                            {ringingAlarm.title || ringingAlarm.time}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            dismiss()
                          }}
                          className="rounded p-1 text-primary/60 transition-colors hover:text-primary shrink-0"
                          aria-label="Dismiss alarm"
                        >
                          <X className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </div>
                    </li>
                  )}
                  {overdueTasks.slice(0, 3).map((task) => (
                    <li
                      key={task.$id}
                      className="rounded-control bg-danger/10 px-2.5 py-2 text-sm text-ink"
                    >
                      <span className="font-medium text-danger">Overdue:</span>{' '}
                      {task.title}
                    </li>
                  ))}
                  {dueTodayTasks.slice(0, 3).map((task) => (
                    <li
                      key={task.$id}
                      className="rounded-control bg-warning/10 px-2.5 py-2 text-sm text-ink"
                    >
                      <span className="font-medium text-warning">Due today:</span>{' '}
                      {task.title}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to="/app/tasks"
                onClick={() => setOpenMenu(null)}
                className="mt-2 block rounded-control px-2.5 py-2 text-center text-sm text-primary hover:bg-tint/10"
              >
                View all tasks
              </Link>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenMenu((current) => (current === 'profile' ? null : 'profile'))
            }
            className="flex items-center gap-2 rounded-full border border-glass-border bg-tint/5 py-1.5 pl-1.5 pr-3"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-semibold text-white">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-ink">
              {user?.name ?? 'Account'}
            </span>
          </button>

          {openMenu === 'profile' ? (
            <div className="absolute right-0 top-12 z-20 w-56 rounded-card border border-glass-border bg-surface p-2 shadow-glass">
              <p className="truncate px-2.5 py-1.5 text-xs text-muted">{user?.email}</p>
              <Link
                to="/app/settings"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-2 rounded-control px-2.5 py-2 text-sm text-ink-secondary transition-colors hover:bg-tint/10 hover:text-ink"
              >
                <Settings className="h-4 w-4" strokeWidth={2} />
                Settings
              </Link>
              <Link
                to="/app/settings"
                onClick={() => setOpenMenu(null)}
                className="flex items-center gap-2 rounded-control px-2.5 py-2 text-sm text-ink-secondary transition-colors hover:bg-tint/10 hover:text-ink"
              >
                <User className="h-4 w-4" strokeWidth={2} />
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-control px-2.5 py-2 text-left text-sm text-danger transition-colors hover:bg-danger/10"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export { Topbar }

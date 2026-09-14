import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Compass,
  Menu,
  Moon,
  RotateCw,
  Sparkles,
  Users,
  Zap,
  X,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import orbitMark from '@/assets/Orbit.png'
import dashboardPreview from '@/assets/Screenshot.png'
import heroAccent from '@/assets/hero.png'
import lifeCalendarImg from '@/assets/feature/life calender.png'
import focusTimerImg from '@/assets/feature/focus timer.png'
import tasksImg from '@/assets/feature/tasks.png'
import notesImg from '@/assets/feature/notes.png'
import habitsImg from '@/assets/feature/habits.png'
import insightsImg from '@/assets/feature/insights.png'
import { buttonVariants } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { ThreeBackground } from '@/components/ThreeBackground'
import { FeatureSlidingCards } from '@/components/FeatureSlidingCards'
import PublicFooter from '@/components/layout/PublicFooter'

const FEATURE_CARDS = [
  {
    id: 'life-calendar',
    title: 'Life in weeks',
    tag: 'Perspective',
    description:
      'See the span of your life at a glance and make the weeks ahead deliberate.',
    image: lifeCalendarImg,
  },
  {
    id: 'focus-timer',
    title: 'Focus rituals',
    tag: 'Attention',
    description:
      'Turn intentions into protected focus sessions with a timer built for momentum.',
    image: focusTimerImg,
  },
  {
    id: 'tasks',
    title: 'Clear priorities',
    tag: 'Clarity',
    description: 'Keep tasks, notes, habits, and reflection in one quiet workspace.',
    image: tasksImg,
  },
  {
    id: 'notes',
    title: 'Notes & Workbook',
    tag: 'Reflection',
    description:
      'Capture passing thoughts and return to them beside the work they inform.',
    image: notesImg,
  },
  {
    id: 'habits',
    title: 'Habits with rhythm',
    tag: 'Practice',
    description:
      'Track the small promises that become your rhythm, one check-in at a time.',
    image: habitsImg,
  },
  {
    id: 'insights',
    title: 'Patterns & insights',
    tag: 'Awareness',
    description: 'Notice what is working with an honest view of your time and progress.',
    image: insightsImg,
  },
]

const BENEFITS = [
  { label: 'Private by default', icon: Sparkles },
  { label: 'Made for return visits', icon: Compass },
  { label: 'Zero distraction design', icon: Zap },
  { label: 'Sync across devices', icon: CheckCircle2 },
]

function Landing() {
  const { loading, profile, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()
  const workspaceHref = profile ? '/app' : '/onboarding'
  const workspaceLabel = profile ? 'Open dashboard' : 'Complete setup'

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 24)

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-ink">
      <ThreeBackground />
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled ? 'px-4 py-2 sm:px-6' : 'px-4 py-4 sm:px-6',
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-12 max-w-7xl items-center justify-between rounded-full px-6 transition-all duration-300 sm:h-14',
            scrolled
              ? 'border border-primary/15 bg-bg/60 shadow-xl shadow-primary/5 backdrop-blur-xl'
              : 'border border-transparent bg-transparent',
          )}
        >
          <Link to="/" className="flex items-center gap-2" aria-label="Orbit home">
            <img src={orbitMark} alt="" className="h-7 w-7 object-contain" />
            <span className="font-heading text-base font-bold text-ink">Orbit</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <a
              href="#features"
              className="px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:text-primary"
            >
              Features
            </a>
            <a
              href="#method"
              className="px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:text-primary"
            >
              How it works
            </a>
            <a
              href="#start"
              className="px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:text-primary"
            >
              Start
            </a>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <Moon
                className={cn('h-4 w-4', theme === 'light' && 'fill-current')}
                strokeWidth={1.8}
              />
            </button>
            {!loading && user ? (
              <Link
                to={workspaceHref}
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'hidden sm:inline-flex ml-2',
                )}
              >
                {workspaceLabel}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:text-primary sm:block"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    buttonVariants({ size: 'sm' }),
                    'hidden sm:inline-flex ml-1',
                  )}
                >
                  Get started
                </Link>
              </>
            )}
            <button
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-primary/10 hover:text-primary md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mt-2 max-w-7xl rounded-2xl border border-primary/15 bg-bg/80 p-4 shadow-xl shadow-primary/5 backdrop-blur-xl md:hidden"
            >
              {['Features', 'How it works', 'Start'].map((label, index) => (
                <a
                  key={label}
                  href={['#features', '#method', '#start'][index]}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:text-primary"
                >
                  {label}
                </a>
              ))}
              <Link
                to={user ? workspaceHref : '/register'}
                className={cn(buttonVariants({ size: 'sm' }), 'mt-3 flex w-full')}
              >
                {user ? workspaceLabel : 'Start planning'}
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main>
        <section className="relative isolate overflow-hidden pt-24 sm:pt-40 pb-12 sm:pb-20">
          <div className="absolute inset-0 -z-10 h-full bg-[radial-gradient(ellipse_at_72%_6%,rgb(var(--color-primary)/0.12),transparent_35%),radial-gradient(ellipse_at_8%_65%,rgb(var(--color-secondary)/0.08),transparent_42%)]" />
          <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-24 lg:py-28">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' }}
              className="relative space-y-10 max-w-2xl"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-bold tracking-wider text-primary">
                  <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                  Your time, in orbit
                </div>
                <h1 className="font-heading text-5xl font-bold leading-[1.15] text-ink sm:text-6xl lg:text-7xl">
                  Make room for the life you mean to live.
                </h1>
              </div>
              <p className="max-w-lg text-base leading-relaxed text-ink-secondary sm:text-lg">
                Orbit brings your weeks, focus, priorities, and small daily promises into
                one calm, considered view. Designed for return visits, not performative
                productivity.
              </p>
              <div className="grid grid-cols-2 gap-5 pt-4">
                {BENEFITS.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 text-xs text-ink-secondary"
                  >
                    <Icon className="h-4 w-4 text-primary/80 flex-shrink-0" />
                    <span className="leading-snug">{label}</span>
                  </div>
                ))}
              </div>
              <div className="!mt-12 flex flex-wrap gap-3">
                {!loading && user ? (
                  <Link to={workspaceHref} className={buttonVariants({ size: 'lg' })}>
                    {workspaceLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className={buttonVariants({ size: 'lg' })}>
                      Start planning
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/login"
                      className={buttonVariants({ variant: 'secondary', size: 'lg' })}
                    >
                      I have an account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 36 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.75,
                delay: reduceMotion ? 0 : 0.25,
                ease: 'easeOut',
              }}
              className="relative mx-auto w-full max-w-3xl lg:max-w-none"
            >
              <div className="absolute -inset-6 bg-gradient-to-t from-primary/8 via-transparent to-transparent opacity-60 blur-3xl" />
              <img
                src={heroAccent}
                alt=""
                className="pointer-events-none absolute -right-16 -top-20 hidden h-72 opacity-40 lg:block"
              />
              <div className="relative rounded-2xl border border-primary/20 bg-surface/40 p-2 shadow-2xl shadow-primary/10 backdrop-blur-sm">
                <img
                  src={dashboardPreview}
                  alt="Orbit dashboard showing life progress, tasks, focus timer, and habits"
                  className="block w-full rounded-xl object-cover"
                />
              </div>
              <motion.div
                animate={reduceMotion ? {} : { y: [0, -8, 0], rotateZ: [0, 1.5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-8 left-6 sm:left-12 z-10"
              >
                <div className="rounded-full border border-primary/30 bg-bg/70 px-5 py-2.5 text-sm font-medium shadow-lg shadow-primary/10 backdrop-blur-md">
                  <span className="font-mono font-bold text-primary">1,482</span>
                  <span className="ml-2.5 text-ink-secondary">weeks in view</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <FeatureSlidingCards features={FEATURE_CARDS} />

        {/* Stats Section */}
        <section className="relative isolate py-20 sm:py-32 lg:py-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgb(var(--color-primary)/0.08),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center sm:mb-20 lg:mb-24"
            >
              <h2 className="font-heading text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
                Built for the intentional few
              </h2>
              <p className="mt-4 text-lg text-ink-secondary">
                By the numbers, we're changing how people see their time
              </p>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: '10k+', label: 'Active Users', Icon: Users },
                { value: '2.1M', label: 'Weeks Tracked', Icon: Calendar },
                { value: '15h', label: 'Avg. Focus Time/Week', Icon: Clock3 },
                { value: '94%', label: 'Return Frequency', Icon: RotateCw },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-surface/40 to-secondary/5 p-8 text-center backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-surface/50"
                >
                  <stat.Icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <div className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm font-medium text-ink-secondary">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative isolate border-y border-primary/10 bg-bg py-20 sm:py-32 lg:py-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgb(var(--color-secondary)/0.06),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center sm:mb-20 lg:mb-24"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary">
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                Trusted by builders
              </div>
              <h2 className="font-heading text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
                People love Orbit
              </h2>
              <p className="mt-4 text-lg text-ink-secondary">
                See what our users are saying about their time experience
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    'Finally a tool that understands my time is precious, not something to optimize to death.',
                  author: 'Sarah Chen',
                  role: 'Product Designer',
                },
                {
                  quote:
                    'The way Orbit shows my weeks has completely changed how I plan. No more endless scrolling.',
                  author: 'Marcus J.',
                  role: 'Founder',
                },
                {
                  quote:
                    "I return every single day. It's the first tool that feels like it was made for me.",
                  author: 'Elena Rodriguez',
                  role: 'Author',
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-primary/15 bg-surface/30 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-surface/50 sm:p-8"
                >
                  <p className="text-sm leading-relaxed text-ink-secondary sm:text-base">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-primary/10 pt-6">
                    <div>
                      <p className="font-heading font-semibold text-ink">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-ink-secondary">{testimonial.role}</p>
                    </div>
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="method"
          className="relative isolate border-y border-primary/10 py-20 sm:py-32"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_20%,rgb(var(--color-secondary)/0.08),transparent_45%)]" />
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid items-center gap-12 lg:gap-20 lg:grid-cols-[1.1fr_0.9fr]">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: reduceMotion ? 0 : 0.55 }}
              >
                <GlassCard className="relative p-8 sm:p-10">
                  <div className="flex items-center justify-between border-b border-primary/15 pb-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-control bg-warning/10 border border-warning/20">
                        <Clock3 className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-ink">
                          Today, in focus
                        </div>
                        <div className="text-xs text-ink-secondary">Session timer</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold text-ink">
                        09:42
                      </div>
                      <div className="text-xs text-ink-secondary">remaining</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Write without distractions',
                      'Finish the small important thing',
                      'Take the long walk',
                    ].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: reduceMotion ? 0 : (index + 1) * 0.08 }}
                        className="group/item flex items-center gap-3 rounded-control border border-primary/10 bg-primary/3 px-4 py-3 transition-all hover:border-primary/25 hover:bg-primary/8"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold bg-primary/20 text-primary">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium text-ink group-hover/item:text-ink">
                          {item}
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-primary/60 opacity-0 transition-opacity group-hover/item:opacity-100" />
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  delay: reduceMotion ? 0 : 0.1,
                }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wider text-primary">
                    <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    How it works
                  </div>
                  <h2 className="font-heading text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                    Useful in five minutes.
                    <br />
                    Meaningful over years.
                  </h2>
                </div>
                <p className="text-base leading-relaxed text-ink-secondary">
                  Orbit doesn't ask you to perform productivity. It gives your attention a
                  home, then helps you return to what matters—without the pressure.
                </p>
                <div className="space-y-3">
                  {[
                    'Start with today, not a perfect plan',
                    'Let progress stay visible without pressure',
                    'Return to what works, every day',
                  ].map((point) => (
                    <div key={point} className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary/70 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-ink-secondary leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  to={user ? workspaceHref : '/register'}
                  className={buttonVariants({ size: 'lg' })}
                >
                  {user ? workspaceLabel : 'Create your Orbit'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="start"
          className="relative isolate border-t border-primary/10 bg-bg py-20 sm:py-32"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgb(var(--color-primary)/0.08),transparent_45%)]" />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduceMotion ? 0 : 0.55 }}
            className="mx-auto max-w-4xl px-5 sm:px-8"
          >
            <GlassCard className="relative overflow-hidden px-6 py-14 text-center sm:px-14 sm:py-20">
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              <div className="relative space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wider text-primary mx-auto">
                  <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                  Begin today
                </div>
                <div className="space-y-3">
                  <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold leading-tight text-ink sm:text-5xl">
                    Your time deserves a clearer view.
                  </h2>
                  <p className="mx-auto max-w-xl text-base leading-relaxed text-ink-secondary">
                    Build a gentler rhythm for the work, rituals, and weeks that are
                    already yours.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row items-center justify-center pt-4">
                  <Link
                    to={user ? workspaceHref : '/register'}
                    className={buttonVariants({ size: 'lg' })}
                  >
                    {user ? workspaceLabel : 'Create your Orbit'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  {!user && (
                    <Link
                      to="/login"
                      className={buttonVariants({ variant: 'secondary', size: 'lg' })}
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

export default Landing

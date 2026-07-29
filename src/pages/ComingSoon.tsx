import { GlassCard } from '@/components/ui/glass-card'

interface ComingSoonProps {
  title: string
}

function ComingSoon({ title }: ComingSoonProps) {
  return (
    <GlassCard className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-10 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-primary">Coming soon</p>
      <h1 className="font-heading text-2xl font-semibold text-ink">{title}</h1>
      <p className="max-w-sm text-sm text-ink-secondary">
        This module is on the roadmap and will arrive in an upcoming update.
      </p>
    </GlassCard>
  )
}

export default ComingSoon

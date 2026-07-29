import { Pause, Play } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { useFocusTimer } from '@/hooks/useFocusTimer'
import { cn } from '@/lib/utils'

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function FocusTimerCard() {
  const { mode, secondsLeft, running, totalSeconds, toggleRunning, switchMode } = useFocusTimer()

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100

  return (
    <GlassCard className="flex flex-col items-center gap-5 p-6">
      <div className="flex items-center gap-1 rounded-control border border-glass-border bg-tint/5 p-1 text-sm">
        <button
          type="button"
          onClick={() => switchMode('focus')}
          className={cn(
            'rounded-[10px] px-4 py-1.5 text-ink-secondary transition-colors',
            mode === 'focus' && 'bg-tint/10 text-ink',
          )}
        >
          Focus
        </button>
        <button
          type="button"
          onClick={() => switchMode('break')}
          className={cn(
            'rounded-[10px] px-4 py-1.5 text-ink-secondary transition-colors',
            mode === 'break' && 'bg-tint/10 text-ink',
          )}
        >
          Break
        </button>
      </div>

      <ProgressRing progress={progress} size={180} strokeWidth={10}>
        <div className="text-center">
          <p className="font-mono text-4xl font-semibold text-ink">{formatTime(secondsLeft)}</p>
          <p className="text-xs text-ink-secondary">{running ? 'Focusing...' : 'Start focusing'}</p>
        </div>
      </ProgressRing>

      <button
        type="button"
        onClick={toggleRunning}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-glow transition-transform hover:scale-105"
        aria-label={running ? 'Pause focus timer' : 'Start focus timer'}
      >
        {running ? (
          <Pause className="h-6 w-6" strokeWidth={2} />
        ) : (
          <Play className="h-6 w-6 translate-x-0.5" strokeWidth={2} />
        )}
      </button>
    </GlassCard>
  )
}

export { FocusTimerCard }

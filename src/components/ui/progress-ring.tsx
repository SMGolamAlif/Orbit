import { useMemo, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  trackClassName?: string
  progressClassName?: string
  /** Use a gradient instead of solid color. Provide two Tailwind CSS color classes. */
  gradient?: { from: string; to: string }
  children?: ReactNode
}

function ProgressRing({
  progress,
  size = 96,
  strokeWidth = 8,
  className,
  trackClassName,
  progressClassName,
  gradient,
  children,
}: ProgressRingProps) {
  const gradientId = useMemo(() => `prg-${crypto.randomUUID().slice(0, 8)}`, [])
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const clamped = Math.min(100, Math.max(0, progress))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={`rgb(var(--color-${gradient.from}))`} />
              <stop offset="100%" stopColor={`rgb(var(--color-${gradient.to}))`} />
            </linearGradient>
          </defs>
        )}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={cn('stroke-tint/10', trackClassName)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={gradient ? `url(#${gradientId})` : undefined}
          className={cn(
            !gradient && 'stroke-primary',
            'transition-[stroke-dashoffset] duration-500 ease-out',
            progressClassName,
          )}
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  )
}

export { ProgressRing }

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-card border border-glass-border bg-glass shadow-glass backdrop-blur-glass',
        className,
      )}
      {...props}
    />
  ),
)
GlassCard.displayName = 'GlassCard'

export { GlassCard }

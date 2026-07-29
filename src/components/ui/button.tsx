import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-control text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:brightness-110 hover:-translate-y-0.5',
        secondary:
          'border border-glass-border bg-glass text-ink backdrop-blur-glass hover:-translate-y-0.5 hover:bg-tint/10',
        ghost: 'text-ink-secondary hover:bg-tint/5 hover:text-ink',
        danger: 'bg-danger/90 text-white hover:bg-danger',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }

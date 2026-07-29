import { Quote } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { cn } from '@/lib/utils'

interface QuoteEntry {
  text: string
  author: string
}

const QUOTES: QuoteEntry[] = [
  { text: 'The trouble is, you think you have time.', author: 'Buddha' },
  { text: 'Time is the most valuable thing a man can spend.', author: 'Theophrastus' },
  { text: 'How we spend our days is, of course, how we spend our lives.', author: 'Annie Dillard' },
  { text: "Yesterday's the past, tomorrow's the future, but today is a gift.", author: 'Bil Keane' },
  { text: 'Time you enjoy wasting is not wasted time.', author: 'Marthe Troly-Curtin' },
  { text: 'The two most powerful warriors are patience and time.', author: 'Leo Tolstoy' },
  { text: 'Lost time is never found again.', author: 'Benjamin Franklin' },
  { text: 'Your time is limited, so don\u2019t waste it living someone else\u2019s life.', author: 'Steve Jobs' },
  { text: 'Life is really simple, but we insist on making it complicated.', author: 'Confucius' },
  { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
]

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}

interface QuoteCardProps {
  className?: string
}

function QuoteCard({ className }: QuoteCardProps) {
  const quote = QUOTES[getDayOfYear(new Date()) % QUOTES.length]

  return (
    <GlassCard
      className={cn(
        'relative flex min-h-[200px] flex-1 flex-col justify-center overflow-hidden p-6',
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <Quote className="relative mb-3 h-7 w-7 text-primary/70" strokeWidth={2} fill="currentColor" />

      <p className="relative font-heading text-lg font-medium italic leading-snug text-ink">
        &ldquo;{quote.text}&rdquo;
      </p>

      <p className="relative mt-4 text-xs tracking-wide text-ink-secondary">— {quote.author}</p>
    </GlassCard>
  )
}

export { QuoteCard }

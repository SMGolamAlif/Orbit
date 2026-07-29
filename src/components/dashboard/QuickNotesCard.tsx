import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { useNotes } from '@/hooks/useNotes'

function formatNoteDate(iso: string) {
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function QuickNotesCard() {
  const { notes, isLoading } = useNotes()

  const preview = [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned)).slice(0, 3)

  return (
    <GlassCard className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-ink">Quick Notes</h2>
        <Link
          to="/notes"
          aria-label="Add note"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-glass-border text-ink-secondary transition-colors hover:text-primary"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-secondary">Loading notes...</p>
      ) : preview.length === 0 ? (
        <Link
          to="/notes"
          className="block rounded-control border border-dashed border-glass-border p-3 text-center text-sm text-ink-secondary transition-colors hover:border-primary hover:text-primary"
        >
          No notes yet — add your first one
        </Link>
      ) : (
        <ul className="space-y-3">
          {preview.map((note) => (
            <li key={note.$id}>
              <Link
                to="/notes"
                className="block rounded-control border border-glass-border bg-tint/5 p-3 transition-colors hover:border-primary"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-ink">{note.title}</p>
                  <span className="shrink-0 text-[11px] text-muted">{formatNoteDate(note.$createdAt)}</span>
                </div>
                <p className="mt-1 truncate text-xs text-ink-secondary">{note.content || 'No content yet'}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  )
}

export { QuickNotesCard }

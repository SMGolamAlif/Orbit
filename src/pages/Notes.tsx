import { useMemo, useState, type FormEvent } from 'react'
import { Pin, PinOff, Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { useNotes } from '@/hooks/useNotes'
import { cn } from '@/lib/utils'

function Notes() {
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes()
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [showForm, setShowForm] = useState(false)

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    const sorted = [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned))
    if (!query) return sorted
    return sorted.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.toLowerCase().includes(query),
    )
  }, [notes, search])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return
    await createNote({
      title: title.trim(),
      content: content.trim(),
      tags: tags.trim(),
      pinned: false,
    })
    setTitle('')
    setContent('')
    setTags('')
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-ink">Notes</h1>
          <p className="text-sm text-ink-secondary">{notes.length} notes</p>
        </div>
        <Button type="button" onClick={() => setShowForm((current) => !current)}>
          <Plus className="h-4 w-4" strokeWidth={2} />
          New Note
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-control border border-glass-border bg-tint/5 px-4 py-2.5 text-sm text-ink-secondary">
        <Search className="h-4 w-4" strokeWidth={2} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notes and tags..."
          className="flex-1 bg-transparent text-ink outline-none placeholder:text-ink-secondary"
        />
      </div>

      {showForm ? (
        <GlassCard className="space-y-3 p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Note title"
              className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary"
            />
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write your note..."
              rows={5}
              className="w-full resize-none rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary"
            />
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full rounded-control border border-glass-border bg-tint/5 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary"
            />
            <Button type="submit" className="w-full justify-center">
              Save Note
            </Button>
          </form>
        </GlassCard>
      ) : null}

      {isLoading ? (
        <p className="text-center text-sm text-ink-secondary">Loading notes...</p>
      ) : filteredNotes.length === 0 ? (
        <p className="text-center text-sm text-ink-secondary">No notes yet. Create your first one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <GlassCard key={note.$id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-sm font-semibold text-ink">{note.title}</h3>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateNote({ id: note.$id, input: { pinned: !note.pinned } })}
                    aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-ink-secondary transition-colors hover:text-primary',
                      note.pinned && 'text-primary',
                    )}
                  >
                    {note.pinned ? (
                      <Pin className="h-3.5 w-3.5" strokeWidth={2} fill="currentColor" />
                    ) : (
                      <PinOff className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNote(note.$id)}
                    aria-label="Delete note"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-ink-secondary transition-colors hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm text-ink-secondary">{note.content}</p>
              {note.tags.trim() ? (
                <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                  {note.tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <span key={tag} className="rounded-full bg-tint/10 px-2 py-0.5 text-[11px] text-ink-secondary">
                        #{tag}
                      </span>
                    ))}
                </div>
              ) : null}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notes

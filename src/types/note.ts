interface Note {
  $id: string
  $createdAt: string
  $updatedAt: string
  title: string
  content: string
  tags: string
  pinned: boolean
}

interface NoteInput {
  title: string
  content: string
  tags: string
  pinned: boolean
}

export type { Note, NoteInput }

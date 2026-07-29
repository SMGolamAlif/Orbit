import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { APPWRITE_DATABASE_ID, APPWRITE_NOTES_COLLECTION_ID, client } from '@/config/appwrite'
import { useAuth } from '@/hooks/useAuth'
import { noteService } from '@/services/notes'
import type { NoteInput } from '@/types/note'

const NOTES_QUERY_KEY = ['notes']

function useNotes() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: NOTES_QUERY_KEY,
    queryFn: noteService.listNotes,
    enabled: Boolean(user),
  })

  useEffect(() => {
    if (!user || !APPWRITE_DATABASE_ID || !APPWRITE_NOTES_COLLECTION_ID) return

    const channel = `databases.${APPWRITE_DATABASE_ID}.collections.${APPWRITE_NOTES_COLLECTION_ID}.documents`
    const unsubscribe = client.subscribe(channel, () => {
      queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY })
    })

    return () => unsubscribe()
  }, [user, queryClient])

  const createNote = useMutation({
    mutationFn: (input: NoteInput) => noteService.createNote(user!.$id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
  })

  const updateNote = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<NoteInput> }) => noteService.updateNote(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
  })

  const deleteNote = useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
  })

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    createNote: createNote.mutateAsync,
    updateNote: updateNote.mutateAsync,
    deleteNote: deleteNote.mutateAsync,
  }
}

export { useNotes }

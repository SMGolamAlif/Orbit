import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_NOTES_COLLECTION_ID,
  client,
} from '@/config/appwrite'
import { useAuth } from '@/hooks/useAuth'
import { noteService } from '@/services/notes'
import {
  addItemToCache,
  removeItemFromCache,
  updateItemInCache,
} from '@/lib/optimistic-mutations'
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
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: NOTES_QUERY_KEY })
      const previousData = queryClient.getQueryData(NOTES_QUERY_KEY)

      const optimisticNote = {
        $id: `temp-${Date.now()}`,
        ...input,
        $createdAt: new Date().toISOString(),
      }
      addItemToCache(queryClient, NOTES_QUERY_KEY, optimisticNote)

      return { previousData }
    },
    onSuccess: (newNote) => {
      updateItemInCache(queryClient, NOTES_QUERY_KEY, (notes) =>
        (notes as any[]).map((n) => (n.$id?.startsWith('temp-') ? newNote : n)),
      )
    },
    onError: (error, _input, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(NOTES_QUERY_KEY, context.previousData)
      }
      console.error('Error creating note:', error)
    },
  })

  const updateNote = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<NoteInput> }) =>
      noteService.updateNote(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: NOTES_QUERY_KEY })
      const previousData = queryClient.getQueryData(NOTES_QUERY_KEY)

      updateItemInCache(queryClient, NOTES_QUERY_KEY, (notes) =>
        (notes as any[]).map((n) => (n.$id === id ? { ...n, ...input } : n)),
      )

      return { previousData }
    },
    onError: (error, _input, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(NOTES_QUERY_KEY, context.previousData)
      }
      console.error('Error updating note:', error)
    },
  })

  const deleteNote = useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTES_QUERY_KEY })
      const previousData = queryClient.getQueryData(NOTES_QUERY_KEY)

      removeItemFromCache(queryClient, NOTES_QUERY_KEY, id)

      return { previousData }
    },
    onError: (error, _input, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(NOTES_QUERY_KEY, context.previousData)
      }
      console.error('Error deleting note:', error)
    },
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

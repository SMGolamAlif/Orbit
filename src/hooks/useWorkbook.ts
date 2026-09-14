import { useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_WORKBOOK_COLLECTION_ID,
  client,
} from '@/config/appwrite'
import { useAuth } from '@/hooks/useAuth'
import { workbookService } from '@/services/workbook'
import {
  addItemToCache,
  removeItemFromCache,
  updateItemInCache,
} from '@/lib/optimistic-mutations'
import type { WorkbookEntryInput } from '@/types/workbook'

const WORKBOOK_QUERY_KEY = ['workbook']

function useWorkbook() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: WORKBOOK_QUERY_KEY,
    queryFn: workbookService.listEntries,
    enabled: Boolean(user),
  })

  // Real-time subscription
  useEffect(() => {
    if (!user || !APPWRITE_DATABASE_ID || !APPWRITE_WORKBOOK_COLLECTION_ID) return
    const channel = `databases.${APPWRITE_DATABASE_ID}.collections.${APPWRITE_WORKBOOK_COLLECTION_ID}.documents`
    const unsubscribe = client.subscribe(channel, () => {
      queryClient.invalidateQueries({ queryKey: WORKBOOK_QUERY_KEY })
    })
    return () => unsubscribe()
  }, [user, queryClient])

  // Group entries by date for quick lookup
  const entriesByDate = useMemo(() => {
    const map = new Map<string, typeof query.data>()
    if (!query.data) return map
    for (const entry of query.data) {
      const raw = entry.date ?? ''
      const dateKey = raw.slice(0, 10)
      if (!dateKey) continue
      const list = map.get(dateKey) ?? []
      list.push(entry)
      map.set(dateKey, list)
    }
    return map
  }, [query.data])

  // Set of dates that have entries (for calendar dots)
  const datesWithEntries = useMemo(() => {
    return new Set(entriesByDate.keys())
  }, [entriesByDate])

  const createEntry = useMutation({
    mutationFn: (input: WorkbookEntryInput) =>
      workbookService.createEntry(user!.$id, input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: WORKBOOK_QUERY_KEY })
      const previousData = queryClient.getQueryData(WORKBOOK_QUERY_KEY)

      const optimisticEntry = {
        $id: `temp-${Date.now()}`,
        ...input,
        $createdAt: new Date().toISOString(),
      }
      addItemToCache(queryClient, WORKBOOK_QUERY_KEY, optimisticEntry)

      return { previousData }
    },
    onSuccess: (newEntry) => {
      updateItemInCache(queryClient, WORKBOOK_QUERY_KEY, (entries) =>
        (entries as any[]).map((e) => (e.$id?.startsWith('temp-') ? newEntry : e)),
      )
    },
    onError: (error, _input, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(WORKBOOK_QUERY_KEY, context.previousData)
      }
      console.error('Error creating workbook entry:', error)
    },
  })

  const updateEntry = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<WorkbookEntryInput> }) =>
      workbookService.updateEntry(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: WORKBOOK_QUERY_KEY })
      const previousData = queryClient.getQueryData(WORKBOOK_QUERY_KEY)

      updateItemInCache(queryClient, WORKBOOK_QUERY_KEY, (entries) =>
        (entries as any[]).map((e) => (e.$id === id ? { ...e, ...input } : e)),
      )

      return { previousData }
    },
    onError: (error, _input, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(WORKBOOK_QUERY_KEY, context.previousData)
      }
      console.error('Error updating workbook entry:', error)
    },
  })

  const deleteEntry = useMutation({
    mutationFn: (id: string) => workbookService.deleteEntry(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: WORKBOOK_QUERY_KEY })
      const previousData = queryClient.getQueryData(WORKBOOK_QUERY_KEY)

      removeItemFromCache(queryClient, WORKBOOK_QUERY_KEY, id)

      return { previousData }
    },
    onError: (error, _input, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(WORKBOOK_QUERY_KEY, context.previousData)
      }
      console.error('Error deleting workbook entry:', error)
    },
  })

  return {
    entries: query.data ?? [],
    entriesByDate,
    datesWithEntries,
    isLoading: query.isLoading,
    createEntry: createEntry.mutateAsync,
    updateEntry: updateEntry.mutateAsync,
    deleteEntry: deleteEntry.mutateAsync,
  }
}

export { useWorkbook }

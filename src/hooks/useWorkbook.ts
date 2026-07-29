import { useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_WORKBOOK_COLLECTION_ID,
  client,
} from '@/config/appwrite'
import { useAuth } from '@/hooks/useAuth'
import { workbookService } from '@/services/workbook'
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
      // Normalize date to YYYY-MM-DD in case Appwrite stores it differently
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WORKBOOK_QUERY_KEY }),
  })

  const updateEntry = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<WorkbookEntryInput> }) =>
      workbookService.updateEntry(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WORKBOOK_QUERY_KEY }),
  })

  const deleteEntry = useMutation({
    mutationFn: (id: string) => workbookService.deleteEntry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WORKBOOK_QUERY_KEY }),
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

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useNotes } from '@/hooks/useNotes'
import { seedStarterNotes, seedStarterTasks } from '@/lib/seed-starter-content'

function seedFlagKey(kind: 'tasks' | 'notes', userId: string) {
  return `orbit-seeded-${kind}-${userId}`
}

function useSeedStarterContent() {
  const { user } = useAuth()
  const { tasks, isLoading: tasksLoading } = useTasks()
  const { notes, isLoading: notesLoading } = useNotes()
  const queryClient = useQueryClient()
  const seedingTasks = useRef(false)
  const seedingNotes = useRef(false)

  useEffect(() => {
    if (!user || tasksLoading || seedingTasks.current) return
    if (tasks.length > 0) return

    const flag = seedFlagKey('tasks', user.$id)
    if (localStorage.getItem(flag)) return

    seedingTasks.current = true
    localStorage.setItem(flag, '1')

    seedStarterTasks(user.$id)
      .then(() => queryClient.invalidateQueries({ queryKey: ['tasks'] }))
      .catch((error) => {
        console.error('Failed to seed starter tasks.', error)
        localStorage.removeItem(flag)
        seedingTasks.current = false
      })
  }, [user, tasks, tasksLoading, queryClient])

  useEffect(() => {
    if (!user || notesLoading || seedingNotes.current) return
    if (notes.length > 0) return

    const flag = seedFlagKey('notes', user.$id)
    if (localStorage.getItem(flag)) return

    seedingNotes.current = true
    localStorage.setItem(flag, '1')

    seedStarterNotes(user.$id)
      .then(() => queryClient.invalidateQueries({ queryKey: ['notes'] }))
      .catch((error) => {
        console.error('Failed to seed starter notes.', error)
        localStorage.removeItem(flag)
        seedingNotes.current = false
      })
  }, [user, notes, notesLoading, queryClient])
}

export { useSeedStarterContent }

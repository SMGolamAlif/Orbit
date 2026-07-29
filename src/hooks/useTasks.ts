import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { APPWRITE_DATABASE_ID, APPWRITE_TASKS_COLLECTION_ID, client } from '@/config/appwrite'
import { useAuth } from '@/hooks/useAuth'
import { taskService } from '@/services/tasks'
import type { TaskInput } from '@/types/task'

const TASKS_QUERY_KEY = ['tasks']

function useTasks() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: taskService.listTasks,
    enabled: Boolean(user),
  })

  useEffect(() => {
    if (!user || !APPWRITE_DATABASE_ID || !APPWRITE_TASKS_COLLECTION_ID) return

    const channel = `databases.${APPWRITE_DATABASE_ID}.collections.${APPWRITE_TASKS_COLLECTION_ID}.documents`
    const unsubscribe = client.subscribe(channel, () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    })

    return () => unsubscribe()
  }, [user, queryClient])

  const createTask = useMutation({
    mutationFn: (input: TaskInput) => taskService.createTask(user!.$id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
  })

  const updateTask = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TaskInput> }) => taskService.updateTask(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
  })

  const deleteTask = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
  })

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    createTask: createTask.mutateAsync,
    updateTask: updateTask.mutateAsync,
    deleteTask: deleteTask.mutateAsync,
  }
}

export { useTasks }

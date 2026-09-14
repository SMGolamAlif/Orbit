import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_TASKS_COLLECTION_ID,
  client,
} from '@/config/appwrite'
import { useAuth } from '@/hooks/useAuth'
import { taskService } from '@/services/tasks'
import {
  addItemToCache,
  removeItemFromCache,
  updateItemInCache,
} from '@/lib/optimistic-mutations'
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
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })

      // Snapshot current data
      const previousData = queryClient.getQueryData(TASKS_QUERY_KEY)

      // Optimistically add new task with temporary ID
      const optimisticTask = {
        $id: `temp-${Date.now()}`,
        ...input,
        order: 0,
      }
      addItemToCache(queryClient, TASKS_QUERY_KEY, optimisticTask)

      return { previousData }
    },
    onSuccess: (newTask) => {
      // Replace temporary optimistic task with real server response
      updateItemInCache(queryClient, TASKS_QUERY_KEY, (tasks) =>
        (tasks as any[]).map((t) => (t.$id?.startsWith('temp-') ? newTask : t)),
      )
    },
    onError: (error, _input, context: any) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousData)
      }
      console.error('Error creating task:', error)
    },
  })

  const updateTask = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TaskInput> }) =>
      taskService.updateTask(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previousData = queryClient.getQueryData(TASKS_QUERY_KEY)

      // Optimistically update task
      updateItemInCache(queryClient, TASKS_QUERY_KEY, (tasks) =>
        (tasks as any[]).map((t) => (t.$id === id ? { ...t, ...input } : t)),
      )

      return { previousData }
    },
    onError: (error, _input, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousData)
      }
      console.error('Error updating task:', error)
    },
  })

  const deleteTask = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previousData = queryClient.getQueryData(TASKS_QUERY_KEY)

      // Optimistically remove task
      removeItemFromCache(queryClient, TASKS_QUERY_KEY, id)

      return { previousData }
    },
    onError: (error, _input, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousData)
      }
      console.error('Error deleting task:', error)
    },
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

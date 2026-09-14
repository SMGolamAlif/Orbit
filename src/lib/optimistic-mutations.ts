import type { QueryClient } from '@tanstack/react-query'

/**
 * Utility to handle optimistic mutations with automatic rollback on error.
 * Provides immediate UI feedback while request is in flight.
 */

interface OptimisticMutationOptions<TData, TInput, TContext> {
  // Query key to update
  queryKey: unknown[]

  // Input data for the mutation
  input: TInput

  // Optimistic update function: mutate cached data immediately
  onMutate: (
    oldData: TData | undefined,
    input: TInput,
  ) => { newData: TData; oldData: TData | undefined }

  // The actual API call
  mutationFn: (input: TInput) => Promise<TData>

  // Success callback after server confirms
  onSuccess?: (data: TData, input: TInput) => void

  // Error callback if mutation fails
  onError?: (error: Error, context: TContext) => void
}

/**
 * Execute a mutation with optimistic updates
 * @example
 * const result = await executeOptimisticMutation({
 *   queryKey: ['tasks'],
 *   input: { title: 'New Task' },
 *   onMutate: (oldTasks, input) => ({
 *     newData: [...(oldTasks ?? []), { $id: 'temp', ...input }],
 *     oldData: oldTasks,
 *   }),
 *   mutationFn: (input) => taskService.createTask(userId, input),
 * })
 */
export async function executeOptimisticMutation<
  TData extends { $id?: string },
  TInput,
  TContext = unknown,
>(
  queryClient: QueryClient,
  options: OptimisticMutationOptions<TData, TInput, TContext>,
): Promise<TData> {
  const { queryKey, input, onMutate, mutationFn, onSuccess, onError } = options

  // Step 1: Get current cached data
  const previousData = queryClient.getQueryData<TData>(queryKey)

  // Step 2: Optimistically update cache immediately
  const { newData, oldData } = onMutate(previousData, input)
  queryClient.setQueryData(queryKey, newData)

  try {
    // Step 3: Send request to server
    const result = await mutationFn(input)

    // Step 4: Update cache with server response (has real $id, timestamps, etc)
    queryClient.setQueryData(queryKey, result)

    // Step 5: Call success callback
    onSuccess?.(result, input)

    return result
  } catch (error) {
    // Step 6: Rollback cache on error
    queryClient.setQueryData(queryKey, oldData)

    // Step 7: Call error callback
    if (error instanceof Error) {
      onError?.(error, {} as TContext)
    }

    throw error
  }
}

/**
 * Update a single item in a list query cache
 * @example
 * updateItemInCache(queryClient, ['tasks'], (tasks) =>
 *   tasks.map(t => t.$id === taskId ? { ...t, title: 'Updated' } : t)
 * )
 */
export function updateItemInCache<TData>(
  queryClient: QueryClient,
  queryKey: unknown[],
  updateFn: (data: TData | undefined) => TData | undefined,
): void {
  queryClient.setQueryData(queryKey, updateFn)
}

/**
 * Add item to list cache
 * @example
 * addItemToCache(queryClient, ['tasks'], newTask, (tasks) =>
 *   [...tasks, newTask]
 * )
 */
export function addItemToCache<TItem>(
  queryClient: QueryClient,
  queryKey: unknown[],
  item: TItem,
  updateFn?: (data: TItem[], newItem: TItem) => TItem[],
): void {
  queryClient.setQueryData(queryKey, (oldData: TItem[] | undefined) => {
    if (!oldData) return [item]
    if (updateFn) return updateFn(oldData, item)
    return [...oldData, item]
  })
}

/**
 * Remove item from list cache
 * @example
 * removeItemFromCache(queryClient, ['tasks'], taskId, (tasks) =>
 *   tasks.filter(t => t.$id !== taskId)
 * )
 */
export function removeItemFromCache<TItem extends { $id?: string }>(
  queryClient: QueryClient,
  queryKey: unknown[],
  itemId: string,
  updateFn?: (data: TItem[], id: string) => TItem[],
): void {
  queryClient.setQueryData(queryKey, (oldData: TItem[] | undefined) => {
    if (!oldData) return oldData
    if (updateFn) return updateFn(oldData, itemId)
    return oldData.filter((item) => item.$id !== itemId)
  })
}

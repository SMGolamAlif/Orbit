import { useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_HABITS_COLLECTION_ID,
  APPWRITE_HABIT_LOGS_COLLECTION_ID,
  client,
} from '@/config/appwrite'
import { useAuth } from '@/hooks/useAuth'
import { habitService } from '@/services/habits'
import type { Habit, HabitInput, HabitLog } from '@/types/habit'
import {
  calculateStreak,
  calculateCompletionRate,
  generateWeeklyHeatmap,
  type HabitStats,
} from '@/lib/habit-utils'

const HABITS_QUERY_KEY = ['habits']
const HABIT_LOGS_QUERY_KEY = ['habitLogs']

function useHabits() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch habits
  const habitsQuery = useQuery({
    queryKey: HABITS_QUERY_KEY,
    queryFn: () => habitService.listHabits(user!.$id),
    enabled: Boolean(user),
  })

  // Fetch habit logs
  const logsQuery = useQuery({
    queryKey: HABIT_LOGS_QUERY_KEY,
    queryFn: () => habitService.listHabitLogs(user!.$id),
    enabled: Boolean(user),
  })

  // Real-time subscription for habits
  useEffect(() => {
    if (!user || !APPWRITE_DATABASE_ID || !APPWRITE_HABITS_COLLECTION_ID) return
    const channel = `databases.${APPWRITE_DATABASE_ID}.collections.${APPWRITE_HABITS_COLLECTION_ID}.documents`
    const unsubscribe = client.subscribe(channel, () => {
      queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY })
    })
    return () => unsubscribe()
  }, [user, queryClient])

  // Real-time subscription for habit logs
  useEffect(() => {
    if (!user || !APPWRITE_DATABASE_ID || !APPWRITE_HABIT_LOGS_COLLECTION_ID) return
    const channel = `databases.${APPWRITE_DATABASE_ID}.collections.${APPWRITE_HABIT_LOGS_COLLECTION_ID}.documents`
    const unsubscribe = client.subscribe(channel, () => {
      queryClient.invalidateQueries({ queryKey: HABIT_LOGS_QUERY_KEY })
    })
    return () => unsubscribe()
  }, [user, queryClient])

  // Group logs by habitId for quick lookup
  const logsByHabit = useMemo(() => {
    const map = new Map<string, HabitLog[]>()
    if (!logsQuery.data) return map
    for (const log of logsQuery.data) {
      const list = map.get(log.habitId) ?? []
      list.push(log)
      map.set(log.habitId, list)
    }
    return map
  }, [logsQuery.data])

  // Compute stats for each habit
  const habitStats = useMemo(() => {
    const map = new Map<string, HabitStats>()
    if (!habitsQuery.data) return map
    for (const habit of habitsQuery.data) {
      const logs = logsByHabit.get(habit.$id) ?? []
      const streak = calculateStreak(habit, logs)
      const completionRate = calculateCompletionRate(habit, logs)
      const weeklyHeatmap = generateWeeklyHeatmap(habit, logs)
      const totalCompletions = logs.filter((l) => l.completed).length
      const totalTarget = habit.targetCount * Math.max(1, Math.ceil(logs.length / 7)) // rough estimate
      map.set(habit.$id, {
        streak,
        completionRate,
        weeklyHeatmap,
        totalCompletions,
        totalTarget,
      })
    }
    return map
  }, [habitsQuery.data, logsByHabit])

  // Get logs for a specific date across all habits
  const logsByDate = useMemo(() => {
    const map = new Map<string, HabitLog[]>()
    if (!logsQuery.data) return map
    for (const log of logsQuery.data) {
      const list = map.get(log.date) ?? []
      list.push(log)
      map.set(log.date, list)
    }
    return map
  }, [logsQuery.data])

  // Get today's habit logs
  const today = new Date().toISOString().slice(0, 10)
  const todayLogs = logsByDate.get(today) ?? []

  // Mutations
  const createHabit = useMutation({
    mutationFn: (input: HabitInput) => {
      if (!user) throw new Error('You must be logged in to create a habit')
      return habitService.createHabit(user.$id, input)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY }),
  })

  const updateHabit = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<HabitInput> }) =>
      habitService.updateHabit(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY }),
  })

  const deleteHabit = useMutation({
    mutationFn: (id: string) => habitService.deleteHabit(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY }),
  })

  const reorderHabits = useMutation({
    mutationFn: (habits: Habit[]) => habitService.reorderHabits(habits),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY }),
  })

  const upsertHabitLog = useMutation({
    mutationFn: ({
      habitId,
      date,
      count,
      targetCount,
    }: {
      habitId: string
      date: string
      count: number
      targetCount: number
    }) => {
      if (!user) throw new Error('You must be logged in to update a habit')
      return habitService.upsertHabitLog(user.$id, habitId, date, count, targetCount)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABIT_LOGS_QUERY_KEY }),
  })

  const deleteHabitLog = useMutation({
    mutationFn: (id: string) => habitService.deleteHabitLog(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: HABIT_LOGS_QUERY_KEY }),
  })

  // Helper to check if habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: string) =>
    logsByDate.get(date)?.some((l) => l.habitId === habitId && l.completed) ?? false

  // Helper to get count for a habit on a specific date
  const getHabitCountOnDate = (habitId: string, date: string) =>
    logsByDate.get(date)?.find((l) => l.habitId === habitId)?.completed
      ? (habitsQuery.data?.find((habit) => habit.$id === habitId)?.targetCount ?? 1)
      : 0

  // Helper to toggle habit completion for today
  const toggleHabitToday = async (habit: Habit) => {
    const existingLog = todayLogs.find((l) => l.habitId === habit.$id)
    const newCount = existingLog?.completed ? 0 : habit.targetCount
    await upsertHabitLog.mutateAsync({
      habitId: habit.$id,
      date: today,
      count: newCount,
      targetCount: habit.targetCount,
    })
  }

  // Helper to get habit stats
  const getHabitStats = (habitId: string) => habitStats.get(habitId)

  // Helper to check if habit is completed today
  const isHabitCompletedToday = (habitId: string) =>
    todayLogs.some((l) => l.habitId === habitId && l.completed)

  // Helper to get today's count for a habit
  const getHabitTodayCount = (habitId: string) =>
    todayLogs.find((l) => l.habitId === habitId)?.count ?? 0

  return {
    habits: habitsQuery.data ?? [],
    habitLogs: logsQuery.data ?? [],
    logsByHabit,
    logsByDate,
    habitStats,
    todayLogs,
    isLoading: habitsQuery.isLoading || logsQuery.isLoading,
    isError: habitsQuery.isError || logsQuery.isError,
    error: habitsQuery.error ?? logsQuery.error,
    createHabit: createHabit.mutateAsync,
    updateHabit: updateHabit.mutateAsync,
    deleteHabit: deleteHabit.mutateAsync,
    reorderHabits: reorderHabits.mutateAsync,
    upsertHabitLog: upsertHabitLog.mutateAsync,
    deleteHabitLog: deleteHabitLog.mutateAsync,
    toggleHabitToday,
    getHabitStats,
    isHabitCompletedToday,
    getHabitTodayCount,
    isHabitCompletedOnDate,
    getHabitCountOnDate,
  }
}

export { useHabits }

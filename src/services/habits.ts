import { ID, Permission, Query, Role } from 'appwrite'
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_HABITS_COLLECTION_ID,
  APPWRITE_HABIT_LOGS_COLLECTION_ID,
  databases,
} from '../config/appwrite'
import type { Habit, HabitInput, HabitLog, HabitLogInput } from '../types/habit'

function assertConfigured() {
  if (
    !APPWRITE_DATABASE_ID ||
    !APPWRITE_HABITS_COLLECTION_ID ||
    !APPWRITE_HABIT_LOGS_COLLECTION_ID
  ) {
    throw new Error(
      'Missing VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_HABITS_COLLECTION_ID, or VITE_APPWRITE_HABIT_LOGS_COLLECTION_ID in environment variables.',
    )
  }
}

const userPermissions = (userId: string) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId)),
]

const habitService = {
  async listHabits(userId: string): Promise<Habit[]> {
    assertConfigured()

    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABITS_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.orderAsc('order'),
        Query.orderAsc('$createdAt'),
        Query.limit(200),
      ],
    )
    return response.documents as unknown as Habit[]
  },

  async createHabit(userId: string, input: HabitInput): Promise<Habit> {
    assertConfigured()

    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABITS_COLLECTION_ID,
      ID.unique(),
      { ...input, userId },
      userPermissions(userId),
    )
    return doc as unknown as Habit
  },

  async updateHabit(habitId: string, input: Partial<HabitInput>): Promise<Habit> {
    assertConfigured()

    const doc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABITS_COLLECTION_ID,
      habitId,
      input,
    )
    return doc as unknown as Habit
  },

  async deleteHabit(habitId: string): Promise<void> {
    assertConfigured()

    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABITS_COLLECTION_ID,
      habitId,
    )
  },

  async reorderHabits(habits: Habit[]): Promise<void> {
    assertConfigured()

    // Batch update order for all habits
    await Promise.all(
      habits.map((habit, index) =>
        databases.updateDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_HABITS_COLLECTION_ID,
          habit.$id,
          {
            order: index,
          },
        ),
      ),
    )
  },

  // Habit Logs
  async listHabitLogs(userId: string, habitId?: string): Promise<HabitLog[]> {
    assertConfigured()

    const queries = [
      Query.equal('userId', userId),
      Query.orderDesc('date'),
      Query.limit(500),
    ]
    if (habitId) {
      queries.push(Query.equal('habitId', habitId))
    }

    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABIT_LOGS_COLLECTION_ID,
      queries,
    )
    return response.documents as unknown as HabitLog[]
  },

  async createHabitLog(userId: string, input: HabitLogInput): Promise<HabitLog> {
    assertConfigured()

    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABIT_LOGS_COLLECTION_ID,
      ID.unique(),
      { ...input, userId },
      userPermissions(userId),
    )
    return doc as unknown as HabitLog
  },

  async updateHabitLog(logId: string, input: Partial<HabitLogInput>): Promise<HabitLog> {
    assertConfigured()

    const doc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABIT_LOGS_COLLECTION_ID,
      logId,
      input,
    )
    return doc as unknown as HabitLog
  },

  async upsertHabitLog(
    userId: string,
    habitId: string,
    date: string,
    count: number,
  ): Promise<HabitLog> {
    assertConfigured()

    // Check if log exists for this habit on this date
    const existing = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABIT_LOGS_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('habitId', habitId),
        Query.equal('date', date),
        Query.limit(1),
      ],
    )

    const completed = count > 0 // Will be updated with actual target check in hook

    if (existing.documents.length > 0) {
      const doc = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_HABIT_LOGS_COLLECTION_ID,
        existing.documents[0].$id,
        { count, completed },
      )
      return doc as unknown as HabitLog
    } else {
      const doc = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_HABIT_LOGS_COLLECTION_ID,
        ID.unique(),
        { userId, habitId, date, count, completed },
        userPermissions(userId),
      )
      return doc as unknown as HabitLog
    }
  },

  async deleteHabitLog(logId: string): Promise<void> {
    assertConfigured()

    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABIT_LOGS_COLLECTION_ID,
      logId,
    )
  },
}

export { habitService }

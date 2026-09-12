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

function toHabit(document: Record<string, unknown>): Habit {
  const { targetDays, ...data } = document
  return {
    ...data,
    targetCount: Number(targetDays),
    order: 0,
  } as Habit
}

function toHabitLog(document: Record<string, unknown>): HabitLog {
  return {
    ...document,
    date: String(document.date).slice(0, 10),
    count: document.completed ? 1 : 0,
  } as HabitLog
}

function toAppwriteDate(date: string) {
  return `${date}T00:00:00.000Z`
}

const habitService = {
  async listHabits(userId: string): Promise<Habit[]> {
    assertConfigured()

    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABITS_COLLECTION_ID,
      [Query.equal('userId', userId), Query.orderAsc('$createdAt'), Query.limit(200)],
    )
    return response.documents.map((document) =>
      toHabit(document as unknown as Record<string, unknown>),
    )
  },

  async createHabit(userId: string, input: HabitInput): Promise<Habit> {
    assertConfigured()

    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABITS_COLLECTION_ID,
      ID.unique(),
      {
        title: input.title,
        description: input.description,
        color: input.color,
        icon: 'Target',
        frequency: input.frequency,
        targetDays: input.targetCount,
        archived: input.archived ?? false,
        userId,
        customDays: input.customDays,
        reminderTime: input.reminderTime,
      },
      userPermissions(userId),
    )
    return toHabit(doc as unknown as Record<string, unknown>)
  },

  async updateHabit(habitId: string, input: Partial<HabitInput>): Promise<Habit> {
    assertConfigured()

    const { targetCount, order, ...data } = input
    const doc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABITS_COLLECTION_ID,
      habitId,
      {
        ...data,
        ...(targetCount === undefined ? {} : { targetDays: targetCount }),
      },
    )
    return toHabit(doc as unknown as Record<string, unknown>)
  },

  async deleteHabit(habitId: string): Promise<void> {
    assertConfigured()

    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABITS_COLLECTION_ID,
      habitId,
    )
  },

  async reorderHabits(_habits: Habit[]): Promise<void> {
    // The deployed collection has no order attribute; creation time is the stable order.
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
    return response.documents.map((document) =>
      toHabitLog(document as unknown as Record<string, unknown>),
    )
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
    return toHabitLog(doc as unknown as Record<string, unknown>)
  },

  async updateHabitLog(logId: string, input: Partial<HabitLogInput>): Promise<HabitLog> {
    assertConfigured()

    const doc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABIT_LOGS_COLLECTION_ID,
      logId,
      input,
    )
    return toHabitLog(doc as unknown as Record<string, unknown>)
  },

  async upsertHabitLog(
    userId: string,
    habitId: string,
    date: string,
<<<<<<< HEAD
    count: number,
    targetCount: number,
=======
    completed: boolean,
>>>>>>> 6a438a6243141d4af6fa7731d7ef53159cc9ce64
  ): Promise<HabitLog> {
    assertConfigured()

    const completed = count >= targetCount

    // Check if log exists for this habit on this date
    const existing = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_HABIT_LOGS_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('habitId', habitId),
        Query.equal('date', toAppwriteDate(date)),
        Query.limit(1),
      ],
    )

    if (existing.documents.length > 0) {
      const doc = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_HABIT_LOGS_COLLECTION_ID,
        existing.documents[0].$id,
        { completed },
      )
      return toHabitLog(doc as unknown as Record<string, unknown>)
    } else {
      const doc = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_HABIT_LOGS_COLLECTION_ID,
        ID.unique(),
        { userId, habitId, date: toAppwriteDate(date), completed },
        userPermissions(userId),
      )
      return toHabitLog(doc as unknown as Record<string, unknown>)
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

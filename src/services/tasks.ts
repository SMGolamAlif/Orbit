import { ID, Permission, Query, Role } from 'appwrite'
import { APPWRITE_DATABASE_ID, APPWRITE_TASKS_COLLECTION_ID, databases } from '../config/appwrite'
import type { Task, TaskInput } from '../types/task'

function assertConfigured() {
  if (!APPWRITE_DATABASE_ID || !APPWRITE_TASKS_COLLECTION_ID) {
    throw new Error(
      'Missing VITE_APPWRITE_DATABASE_ID or VITE_APPWRITE_TASKS_COLLECTION_ID in environment variables.',
    )
  }
}

const taskService = {
  async listTasks(): Promise<Task[]> {
    assertConfigured()

    const response = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_TASKS_COLLECTION_ID, [
      Query.orderAsc('order'),
      Query.limit(200),
    ])
    return response.documents as unknown as Task[]
  },

  async createTask(userId: string, input: TaskInput): Promise<Task> {
    assertConfigured()

    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_TASKS_COLLECTION_ID,
      ID.unique(),
      input,
      [Permission.read(Role.user(userId)), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))],
    )
    return doc as unknown as Task
  },

  async updateTask(taskId: string, input: Partial<TaskInput>): Promise<Task> {
    assertConfigured()

    const doc = await databases.updateDocument(APPWRITE_DATABASE_ID, APPWRITE_TASKS_COLLECTION_ID, taskId, input)
    return doc as unknown as Task
  },

  async deleteTask(taskId: string): Promise<void> {
    assertConfigured()

    await databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_TASKS_COLLECTION_ID, taskId)
  },
}

export { taskService }

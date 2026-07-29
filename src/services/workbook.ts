import { ID, Permission, Query, Role } from 'appwrite'
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_WORKBOOK_COLLECTION_ID,
  databases,
} from '../config/appwrite'
import type { WorkbookEntry, WorkbookEntryInput } from '../types/workbook'

function assertConfigured() {
  if (!APPWRITE_DATABASE_ID || !APPWRITE_WORKBOOK_COLLECTION_ID) {
    throw new Error(
      'Missing VITE_APPWRITE_DATABASE_ID or VITE_APPWRITE_WORKBOOK_COLLECTION_ID in environment variables.',
    )
  }
}

const workbookService = {
  async listEntries(): Promise<WorkbookEntry[]> {
    assertConfigured()
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_WORKBOOK_COLLECTION_ID,
      [Query.orderDesc('$createdAt'), Query.limit(500)],
    )
    return response.documents as unknown as WorkbookEntry[]
  },

  async listByDate(date: string): Promise<WorkbookEntry[]> {
    assertConfigured()
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_WORKBOOK_COLLECTION_ID,
      [Query.equal('date', date), Query.orderAsc('$createdAt'), Query.limit(100)],
    )
    return response.documents as unknown as WorkbookEntry[]
  },

  async listByDateRange(startDate: string, endDate: string): Promise<WorkbookEntry[]> {
    assertConfigured()
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_WORKBOOK_COLLECTION_ID,
      [
        Query.greaterThanEqual('date', startDate),
        Query.lessThanEqual('date', endDate),
        Query.orderAsc('$createdAt'),
        Query.limit(500),
      ],
    )
    return response.documents as unknown as WorkbookEntry[]
  },

  async createEntry(userId: string, input: WorkbookEntryInput): Promise<WorkbookEntry> {
    assertConfigured()
    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_WORKBOOK_COLLECTION_ID,
      ID.unique(),
      input,
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    )
    return doc as unknown as WorkbookEntry
  },

  async updateEntry(
    entryId: string,
    input: Partial<WorkbookEntryInput>,
  ): Promise<WorkbookEntry> {
    assertConfigured()
    const doc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_WORKBOOK_COLLECTION_ID,
      entryId,
      input,
    )
    return doc as unknown as WorkbookEntry
  },

  async deleteEntry(entryId: string): Promise<void> {
    assertConfigured()
    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_WORKBOOK_COLLECTION_ID,
      entryId,
    )
  },
}

export { workbookService }

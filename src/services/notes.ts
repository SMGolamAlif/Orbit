import { ID, Permission, Query, Role } from 'appwrite'
import { APPWRITE_DATABASE_ID, APPWRITE_NOTES_COLLECTION_ID, databases } from '../config/appwrite'
import type { Note, NoteInput } from '../types/note'

function assertConfigured() {
  if (!APPWRITE_DATABASE_ID || !APPWRITE_NOTES_COLLECTION_ID) {
    throw new Error(
      'Missing VITE_APPWRITE_DATABASE_ID or VITE_APPWRITE_NOTES_COLLECTION_ID in environment variables.',
    )
  }
}

const noteService = {
  async listNotes(): Promise<Note[]> {
    assertConfigured()

    const response = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_NOTES_COLLECTION_ID, [
      Query.orderDesc('$createdAt'),
      Query.limit(200),
    ])
    return response.documents as unknown as Note[]
  },

  async createNote(userId: string, input: NoteInput): Promise<Note> {
    assertConfigured()

    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_NOTES_COLLECTION_ID,
      ID.unique(),
      input,
      [Permission.read(Role.user(userId)), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))],
    )
    return doc as unknown as Note
  },

  async updateNote(noteId: string, input: Partial<NoteInput>): Promise<Note> {
    assertConfigured()

    const doc = await databases.updateDocument(APPWRITE_DATABASE_ID, APPWRITE_NOTES_COLLECTION_ID, noteId, input)
    return doc as unknown as Note
  },

  async deleteNote(noteId: string): Promise<void> {
    assertConfigured()

    await databases.deleteDocument(APPWRITE_DATABASE_ID, APPWRITE_NOTES_COLLECTION_ID, noteId)
  },
}

export { noteService }

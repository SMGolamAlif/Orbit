import { ID, Permission, Query, Role } from 'appwrite'
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_CATEGORIES_COLLECTION_ID,
  databases,
} from '../config/appwrite'
import type { Category, CategoryInput } from '../types/category'

function assertConfigured() {
  if (!APPWRITE_DATABASE_ID || !APPWRITE_CATEGORIES_COLLECTION_ID) {
    throw new Error(
      'Missing VITE_APPWRITE_DATABASE_ID or VITE_APPWRITE_CATEGORIES_COLLECTION_ID in environment variables.',
    )
  }
}

const categoryService = {
  async listCategories(userId: string): Promise<Category[]> {
    assertConfigured()

    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_CATEGORIES_COLLECTION_ID,
      [Query.equal('userId', userId), Query.limit(100)],
    )
    return response.documents as unknown as Category[]
  },

  async createCategory(userId: string, input: CategoryInput): Promise<Category> {
    assertConfigured()

    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_CATEGORIES_COLLECTION_ID,
      ID.unique(),
      {
        ...input,
        userId,
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    )
    return doc as unknown as Category
  },

  async updateCategory(
    categoryId: string,
    input: Partial<CategoryInput>,
  ): Promise<Category> {
    assertConfigured()

    const doc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_CATEGORIES_COLLECTION_ID,
      categoryId,
      input,
    )
    return doc as unknown as Category
  },

  async deleteCategory(categoryId: string): Promise<void> {
    assertConfigured()

    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_CATEGORIES_COLLECTION_ID,
      categoryId,
    )
  },
}

export { categoryService }

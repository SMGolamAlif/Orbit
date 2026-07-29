import { Permission, Role } from 'appwrite'
import { APPWRITE_DATABASE_ID, APPWRITE_PROFILES_COLLECTION_ID, databases } from '../config/appwrite'
import type { UserProfile } from '../types/profile'

function assertConfigured() {
  if (!APPWRITE_DATABASE_ID || !APPWRITE_PROFILES_COLLECTION_ID) {
    throw new Error(
      'Missing VITE_APPWRITE_DATABASE_ID or VITE_APPWRITE_PROFILES_COLLECTION_ID in environment variables.',
    )
  }
}

const profileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    assertConfigured()

    try {
      const doc = await databases.getDocument(APPWRITE_DATABASE_ID, APPWRITE_PROFILES_COLLECTION_ID, userId)
      return doc as unknown as UserProfile
    } catch {
      return null
    }
  },

  async saveProfile(userId: string, profile: UserProfile): Promise<UserProfile> {
    assertConfigured()

    const existing = await profileService.getProfile(userId)

    if (existing) {
      const doc = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_PROFILES_COLLECTION_ID,
        userId,
        profile,
      )
      return doc as unknown as UserProfile
    }

    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_PROFILES_COLLECTION_ID,
      userId,
      profile,
      [Permission.read(Role.user(userId)), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))],
    )
    return doc as unknown as UserProfile
  },
}

export { profileService }

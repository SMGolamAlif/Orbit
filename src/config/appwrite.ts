import { Account, Client, Databases, Storage } from 'appwrite'

const APPWRITE_ENDPOINT = 'https://sgp.cloud.appwrite.io/v1'
const APPWRITE_PROJECT_ID = '6a68d53f00395def992f'

const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const APPWRITE_PROFILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID
const APPWRITE_TASKS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TASKS_COLLECTION_ID
const APPWRITE_NOTES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_NOTES_COLLECTION_ID

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID)

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)

export {
  account,
  APPWRITE_DATABASE_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_NOTES_COLLECTION_ID,
  APPWRITE_PROFILES_COLLECTION_ID,
  APPWRITE_PROJECT_ID,
  APPWRITE_TASKS_COLLECTION_ID,
  client,
  databases,
  storage,
}


#!/usr/bin/env node

/**
 * Script to create the categories collection in Appwrite
 * Run: node scripts/create-categories-collection.js
 */

import { Client, Databases } from 'appwrite'

const apiKey = process.env.APPWRITE_API_KEY

if (!apiKey) {
  console.error('Error: APPWRITE_API_KEY environment variable not set')
  console.log('Get your API key from: https://cloud.appwrite.io/console/settings/keys')
  process.exit(1)
}

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('6a68d53f00395def992f')
  .setKey(apiKey)

const databases = new Databases(client)

const DATABASE_ID = '6a6a063d000f5fa92c3f'
const COLLECTION_ID = 'categories'

async function createCategoriesCollection() {
  try {
    console.log('Creating categories collection...')

    // Create collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'categories',
    )

    console.log('✓ Collection created:', collection.$id)

    // Add userId attribute (String, Required)
    const userIdAttr = await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'userId',
      255,
      true, // required
    )
    console.log('✓ userId attribute created')

    // Add name attribute (String, Required)
    const nameAttr = await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'name',
      255,
      true, // required
    )
    console.log('✓ name attribute created')

    // Add color attribute (String, Required)
    const colorAttr = await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'color',
      50,
      true, // required
    )
    console.log('✓ color attribute created')

    // Add isCustom attribute (Boolean, Required, Default: false)
    const isCustomAttr = await databases.createBooleanAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'isCustom',
      true, // required
      false, // default value
    )
    console.log('✓ isCustom attribute created')

    console.log('\n✅ Categories collection created successfully!')
    console.log('Collection ID:', COLLECTION_ID)
    console.log('Database ID:', DATABASE_ID)
    console.log('\nYour .env file already has:')
    console.log('VITE_APPWRITE_CATEGORIES_COLLECTION_ID=categories')
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ Collection already exists:', COLLECTION_ID)
    } else {
      console.error('Error creating collection:', error.message)
      console.error('Full error:', error)
    }
    process.exit(1)
  }
}

createCategoriesCollection()

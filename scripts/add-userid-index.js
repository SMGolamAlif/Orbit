#!/usr/bin/env node

/**
 * Add index to userId attribute in categories collection
 */

const apiKey = process.env.APPWRITE_API_KEY

if (!apiKey) {
  console.error('Error: APPWRITE_API_KEY environment variable not set')
  process.exit(1)
}

const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1'
const PROJECT_ID = '6a68d53f00395def992f'
const DATABASE_ID = '6a6a063d000f5fa92c3f'
const COLLECTION_ID = 'categories'

async function addIndexToUserId() {
  try {
    console.log('Adding index to userId attribute...')

    // Create an index on userId
    const response = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/indexes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': apiKey,
        },
        body: JSON.stringify({
          key: 'userId_index',
          type: 'key',
          attributes: ['userId'],
          orders: ['ASC'],
        }),
      },
    )

    if (!response.ok) {
      const error = await response.text()
      if (response.status === 409) {
        console.log('ℹ Index already exists')
      } else {
        throw new Error(`Failed to add index: ${response.status} ${error}`)
      }
    } else {
      console.log('✓ Index added successfully')
    }

    console.log('\n✅ userId index configured!')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

addIndexToUserId()

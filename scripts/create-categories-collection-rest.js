#!/usr/bin/env node

/**
 * Script to create the categories collection in Appwrite using REST API
 * Run: node scripts/create-categories-collection-rest.js
 */

const apiKey = process.env.APPWRITE_API_KEY

if (!apiKey) {
  console.error('Error: APPWRITE_API_KEY environment variable not set')
  console.log('Get your API key from: https://cloud.appwrite.io/console/settings/keys')
  process.exit(1)
}

const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1'
const PROJECT_ID = '6a68d53f00395def992f'
const DATABASE_ID = '6a6a063d000f5fa92c3f'
const COLLECTION_ID = 'categories'

async function createCategoriesCollection() {
  try {
    // Step 1: Create collection
    console.log('Creating categories collection...')
    let response = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': apiKey,
      },
      body: JSON.stringify({
        collectionId: COLLECTION_ID,
        name: 'categories',
        permissions: [],
      }),
    })

    if (!response.ok && response.status !== 409) {
      const error = await response.text()
      throw new Error(`Failed to create collection: ${response.status} ${error}`)
    }

    if (response.status === 409) {
      console.log('ℹ Collection already exists')
    } else {
      console.log('✓ Collection created:', COLLECTION_ID)
    }

    // Step 2: Add userId attribute
    console.log('Adding userId attribute...')
    response = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/attributes/string`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': apiKey,
        },
        body: JSON.stringify({
          key: 'userId',
          size: 255,
          required: true,
        }),
      },
    )

    if (!response.ok && response.status !== 409) {
      const error = await response.text()
      console.warn(`Warning: userId attribute issue: ${error}`)
    } else {
      console.log('✓ userId attribute created')
    }

    // Step 3: Add name attribute
    console.log('Adding name attribute...')
    response = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/attributes/string`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': apiKey,
        },
        body: JSON.stringify({
          key: 'name',
          size: 255,
          required: true,
        }),
      },
    )

    if (!response.ok && response.status !== 409) {
      const error = await response.text()
      console.warn(`Warning: name attribute issue: ${error}`)
    } else {
      console.log('✓ name attribute created')
    }

    // Step 4: Add color attribute
    console.log('Adding color attribute...')
    response = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/attributes/string`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': apiKey,
        },
        body: JSON.stringify({
          key: 'color',
          size: 50,
          required: true,
        }),
      },
    )

    if (!response.ok && response.status !== 409) {
      const error = await response.text()
      console.warn(`Warning: color attribute issue: ${error}`)
    } else {
      console.log('✓ color attribute created')
    }

    // Step 5: Add isCustom attribute
    console.log('Adding isCustom attribute...')
    response = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/attributes/boolean`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': apiKey,
        },
        body: JSON.stringify({
          key: 'isCustom',
          required: true,
          default: false,
        }),
      },
    )

    if (!response.ok && response.status !== 409) {
      const error = await response.text()
      console.warn(`Warning: isCustom attribute issue: ${error}`)
    } else {
      console.log('✓ isCustom attribute created')
    }

    console.log('\n✅ Categories collection setup complete!')
    console.log('Collection ID:', COLLECTION_ID)
    console.log('Database ID:', DATABASE_ID)
    console.log('\nYour .env file already has:')
    console.log('VITE_APPWRITE_CATEGORIES_COLLECTION_ID=categories')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

createCategoriesCollection()

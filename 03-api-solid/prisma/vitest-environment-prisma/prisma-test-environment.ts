import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest/environments'
import { prisma } from '@/lib/prisma'

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRaw`DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        await prisma.$disconnect()
      },
    }
  },
}
/**
 * This file configures a custom Vitest environment for Prisma testing.
 *
 * It creates an isolated test database by:
 * 1. Generating a random schema name using UUID
 * 2. Creating a new database URL with the random schema
 * 3. Running Prisma migrations on the test database
 *
 * After tests complete, it:
 * 1. Drops the temporary schema
 * 2. Disconnects the Prisma client
 *
 * This ensures each test run has a clean, isolated database environment
 * and properly cleans up afterwards to prevent test pollution.
 */

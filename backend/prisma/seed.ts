import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Check if users already exist
  const existingUsers = await prisma.user.count()
  if (existingUsers > 0) {
    console.log('Database already seeded. Skipping...')
    return
  }

  // Hash passwords
  const hashedPassword1 = await bcrypt.hash('Test1234!', 12)
  const hashedPassword2 = await bcrypt.hash('Dev1234!', 12)

  // Create test users
  const testUser = await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: hashedPassword1,
      birthYear: 2010,
      level: 3,
      points: 1500,
      experiencePoints: 2400,
      streakDays: 5,
      lastStreakDate: new Date(),
      lastLoginAt: new Date(),
      passwordHistory: {
        create: {
          hashedPassword: hashedPassword1
        }
      }
    }
  })

  const devUser = await prisma.user.create({
    data: {
      username: 'developer',
      email: 'dev@example.com',
      passwordHash: hashedPassword2,
      birthYear: 1995,
      parentEmail: null,
      level: 10,
      points: 15000,
      experiencePoints: 9500,
      streakDays: 30,
      lastStreakDate: new Date(),
      lastLoginAt: new Date(),
      passwordHistory: {
        create: {
          hashedPassword: hashedPassword2
        }
      }
    }
  })

  console.log('Created test users:')
  console.log(`- ${testUser.username} (${testUser.email})`)
  console.log(`- ${devUser.username} (${devUser.email})`)
  console.log('\nTest credentials:')
  console.log('User 1: test@example.com / Test1234!')
  console.log('User 2: dev@example.com / Dev1234!')
  console.log('\nDatabase seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

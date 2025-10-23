import prisma from '../utils/prisma'

interface AchievementCondition {
  type: string
  count?: number
  days?: number
  level?: number
  rate?: number
  minProblems?: number
  problemType?: string
}

/**
 * 사용자의 배지 획득 여부 확인 및 자동 부여
 */
export async function checkAndGrantAchievements(userId: string) {
  // 모든 배지 조회
  const allAchievements = await prisma.achievement.findMany()

  // 이미 획득한 배지 조회
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  })

  const unlockedAchievementIds = new Set(userAchievements.map((ua) => ua.achievementId))
  const newlyUnlocked: string[] = []

  for (const achievement of allAchievements) {
    // 이미 획득한 배지는 스킵
    if (unlockedAchievementIds.has(achievement.id)) {
      continue
    }

    const condition = achievement.condition as AchievementCondition
    const isEligible = await checkAchievementCondition(userId, condition)

    if (isEligible) {
      // 배지 부여
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      })

      // 포인트 지급
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: { increment: achievement.points },
          experiencePoints: { increment: achievement.points },
        },
      })

      newlyUnlocked.push(achievement.id)
    }
  }

  return newlyUnlocked
}

/**
 * 배지 조건 확인
 */
async function checkAchievementCondition(
  userId: string,
  condition: AchievementCondition
): Promise<boolean> {
  const { type } = condition

  switch (type) {
    case 'problem_count':
      return await checkProblemCount(userId, condition.count!)

    case 'streak_days':
      return await checkStreakDays(userId, condition.days!)

    case 'level_complete':
      return await checkLevelComplete(userId, condition.level!)

    case 'accuracy':
      return await checkAccuracy(userId, condition.rate!, condition.minProblems!)

    case 'type_count':
      return await checkTypeCount(userId, condition.problemType!, condition.count!)

    case 'daily_count':
      return await checkDailyCount(userId, condition.count!)

    case 'all_complete':
      return await checkAllComplete(userId)

    default:
      return false
  }
}

/**
 * 총 문제 수 확인
 */
async function checkProblemCount(userId: string, targetCount: number): Promise<boolean> {
  const count = await prisma.userProgress.count({
    where: {
      userId,
      isCorrect: true,
    },
  })

  return count >= targetCount
}

/**
 * 연속 학습 일수 확인
 */
async function checkStreakDays(userId: string, targetDays: number): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streakDays: true },
  })

  return user ? user.streakDays >= targetDays : false
}

/**
 * 레벨 완료 확인
 */
async function checkLevelComplete(userId: string, level: number): Promise<boolean> {
  // 해당 레벨의 전체 문제 수
  const totalProblems = await prisma.problem.count({
    where: { level },
  })

  // 사용자가 푼 문제 수 (정답만)
  const solvedProblems = await prisma.userProgress.groupBy({
    by: ['problemId'],
    where: {
      userId,
      isCorrect: true,
      problem: {
        level,
      },
    },
  })

  return solvedProblems.length >= totalProblems
}

/**
 * 정답률 확인
 */
async function checkAccuracy(
  userId: string,
  targetRate: number,
  minProblems: number
): Promise<boolean> {
  const totalAttempts = await prisma.userProgress.count({
    where: { userId },
  })

  if (totalAttempts < minProblems) {
    return false
  }

  const correctAttempts = await prisma.userProgress.count({
    where: {
      userId,
      isCorrect: true,
    },
  })

  const accuracy = (correctAttempts / totalAttempts) * 100

  return accuracy >= targetRate
}

/**
 * 유형별 문제 수 확인
 */
async function checkTypeCount(
  userId: string,
  problemType: string,
  targetCount: number
): Promise<boolean> {
  const count = await prisma.userProgress.groupBy({
    by: ['problemId'],
    where: {
      userId,
      isCorrect: true,
      problem: {
        type: problemType as any,
      },
    },
  })

  return count.length >= targetCount
}

/**
 * 하루 문제 수 확인
 */
async function checkDailyCount(userId: string, targetCount: number): Promise<boolean> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const count = await prisma.userProgress.count({
    where: {
      userId,
      isCorrect: true,
      attemptedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  })

  return count >= targetCount
}

/**
 * 전체 문제 완료 확인
 */
async function checkAllComplete(userId: string): Promise<boolean> {
  const totalProblems = await prisma.problem.count()

  const solvedProblems = await prisma.userProgress.groupBy({
    by: ['problemId'],
    where: {
      userId,
      isCorrect: true,
    },
  })

  return solvedProblems.length >= totalProblems
}

/**
 * 사용자 배지 목록 조회
 */
export async function getUserAchievements(userId: string) {
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: {
      achievement: true,
    },
    orderBy: {
      unlockedAt: 'desc',
    },
  })

  return userAchievements
}

/**
 * 모든 배지 목록 조회 (획득 여부 포함)
 */
export async function getAllAchievementsWithStatus(userId: string) {
  const allAchievements = await prisma.achievement.findMany({
    orderBy: { points: 'asc' },
  })

  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true, unlockedAt: true },
  })

  const unlockedMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt]))

  return allAchievements.map((achievement) => ({
    ...achievement,
    unlocked: unlockedMap.has(achievement.id),
    unlockedAt: unlockedMap.get(achievement.id) || null,
  }))
}

export default {
  checkAndGrantAchievements,
  getUserAchievements,
  getAllAchievementsWithStatus,
}

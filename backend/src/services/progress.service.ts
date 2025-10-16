import prisma from '../utils/prisma'

/**
 * 사용자 진도 조회
 */
export async function getUserProgress(userId: string) {
  // 전체 통계
  const totalAttempts = await prisma.userProgress.count({
    where: { userId },
  })

  const correctAttempts = await prisma.userProgress.count({
    where: { userId, isCorrect: true },
  })

  const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0

  // 레벨별 진도
  const progressByLevel = await prisma.$queryRaw`
    SELECT
      p.level,
      COUNT(DISTINCT up.problem_id) as solved_count,
      COUNT(DISTINCT p.id) as total_count
    FROM problems p
    LEFT JOIN user_progress up ON p.id = up.problem_id AND up.user_id = ${userId} AND up.is_correct = true
    GROUP BY p.level
    ORDER BY p.level
  `

  // 최근 풀이 기록
  const recentProgress = await prisma.userProgress.findMany({
    where: { userId },
    include: {
      problem: {
        select: {
          id: true,
          type: true,
          difficulty: true,
          level: true,
          question: true,
        },
      },
    },
    orderBy: { attemptedAt: 'desc' },
    take: 10,
  })

  return {
    totalAttempts,
    correctAttempts,
    accuracy: Math.round(accuracy * 10) / 10,
    progressByLevel,
    recentProgress,
  }
}

/**
 * 사용자 통계 조회
 */
export async function getUserStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      level: true,
      points: true,
      experiencePoints: true,
      streakDays: true,
      lastStreakDate: true,
    },
  })

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다')
  }

  // 카테고리별 정답률
  const statsByType = await prisma.$queryRaw`
    SELECT
      p.type,
      COUNT(*) as total_attempts,
      SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) as correct_attempts,
      ROUND(AVG(CASE WHEN up.is_correct THEN 100.0 ELSE 0.0 END), 1) as accuracy
    FROM user_progress up
    JOIN problems p ON up.problem_id = p.id
    WHERE up.user_id = ${userId}
    GROUP BY p.type
  `

  // 난이도별 정답률
  const statsByDifficulty = await prisma.$queryRaw`
    SELECT
      p.difficulty,
      COUNT(*) as total_attempts,
      SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) as correct_attempts,
      ROUND(AVG(CASE WHEN up.is_correct THEN 100.0 ELSE 0.0 END), 1) as accuracy
    FROM user_progress up
    JOIN problems p ON up.problem_id = p.id
    WHERE up.user_id = ${userId}
    GROUP BY p.difficulty
  `

  return {
    user,
    statsByType,
    statsByDifficulty,
  }
}

export default {
  getUserProgress,
  getUserStats,
}

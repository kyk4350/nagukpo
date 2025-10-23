import prisma from '../utils/prisma'

/**
 * 사용자 진도 조회
 */
export async function getUserProgress(userId: string) {
  // 전체 통계 - unique한 문제 수 계산
  const uniqueProblems = await prisma.userProgress.groupBy({
    by: ['problemId'],
    where: { userId },
  })
  const totalAttempts = uniqueProblems.length

  const correctProblems = await prisma.userProgress.groupBy({
    by: ['problemId'],
    where: { userId, isCorrect: true },
  })
  const correctAttempts = correctProblems.length

  const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0

  // 레벨별 진도
  const progressByLevelRaw: any[] = await prisma.$queryRaw`
    SELECT
      p.level,
      COUNT(DISTINCT up.problem_id) as attempted_count,
      COUNT(DISTINCT CASE WHEN up.is_correct = true THEN up.problem_id ELSE NULL END) as solved_count,
      COUNT(DISTINCT p.id) as total_count
    FROM problems p
    LEFT JOIN user_progress up ON p.id = up.problem_id AND up.user_id = ${userId}
    GROUP BY p.level
    ORDER BY p.level
  `

  // BigInt를 Number로 변환
  const progressByLevel = progressByLevelRaw.map((item) => ({
    level: item.level,
    attempted_count: Number(item.attempted_count),
    solved_count: Number(item.solved_count),
    total_count: Number(item.total_count),
  }))

  // 최근 풀이 기록 (최근 5개)
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
    take: 5,
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
  const statsByTypeRaw: any[] = await prisma.$queryRaw`
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

  // BigInt를 Number로 변환
  const statsByType = statsByTypeRaw.map((item) => ({
    type: item.type,
    total_attempts: Number(item.total_attempts),
    correct_attempts: Number(item.correct_attempts),
    accuracy: Number(item.accuracy),
  }))

  // 난이도별 정답률
  const statsByDifficultyRaw: any[] = await prisma.$queryRaw`
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

  // BigInt를 Number로 변환
  const statsByDifficulty = statsByDifficultyRaw.map((item) => ({
    difficulty: item.difficulty,
    total_attempts: Number(item.total_attempts),
    correct_attempts: Number(item.correct_attempts),
    accuracy: Number(item.accuracy),
  }))

  // 일주일간 학습 기록
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const dailyActivityRaw: any[] = await prisma.$queryRaw`
    SELECT
      DATE(attempted_at) as date,
      COUNT(*) as total_problems,
      SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_problems
    FROM user_progress
    WHERE user_id = ${userId}
      AND attempted_at >= ${sevenDaysAgo}
    GROUP BY DATE(attempted_at)
    ORDER BY date ASC
  `

  // BigInt를 Number로 변환
  const dailyActivity = dailyActivityRaw.map((item) => ({
    date: item.date,
    total_problems: Number(item.total_problems),
    correct_problems: Number(item.correct_problems),
  }))

  return {
    user,
    statsByType,
    statsByDifficulty,
    dailyActivity,
  }
}

/**
 * 오늘 학습 요약 조회
 */
export async function getTodayStudySummary(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // 오늘 푼 문제들
  const todayProgress = await prisma.userProgress.findMany({
    where: {
      userId,
      attemptedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      problem: {
        select: {
          type: true,
          difficulty: true,
          level: true,
        },
      },
    },
  })

  // 전체 통계
  const totalProblems = todayProgress.length
  const correctProblems = todayProgress.filter((p) => p.isCorrect).length
  const accuracy = totalProblems > 0 ? Math.round((correctProblems / totalProblems) * 100) : 0

  // 획득한 포인트 계산
  const pointsMap: Record<string, number> = {
    easy: 10,
    medium: 20,
    hard: 30,
  }

  const pointsEarned = todayProgress
    .filter((p) => p.isCorrect)
    .reduce((sum, p) => sum + (pointsMap[p.problem.difficulty] || 10), 0)

  // 소요 시간 (분)
  const totalTimeSpent = todayProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0)
  const avgTimePerProblem = totalProblems > 0 ? Math.round(totalTimeSpent / totalProblems) : 0

  // 유형별 통계
  const typeStats = todayProgress.reduce((acc, p) => {
    const type = p.problem.type
    if (!acc[type]) {
      acc[type] = { total: 0, correct: 0 }
    }
    acc[type].total++
    if (p.isCorrect) acc[type].correct++
    return acc
  }, {} as Record<string, { total: number; correct: number }>)

  // 난이도별 통계
  const difficultyStats = todayProgress.reduce((acc, p) => {
    const difficulty = p.problem.difficulty
    if (!acc[difficulty]) {
      acc[difficulty] = { total: 0, correct: 0 }
    }
    acc[difficulty].total++
    if (p.isCorrect) acc[difficulty].correct++
    return acc
  }, {} as Record<string, { total: number; correct: number }>)

  return {
    totalProblems,
    correctProblems,
    accuracy,
    pointsEarned,
    totalTimeSpent,
    avgTimePerProblem,
    typeStats,
    difficultyStats,
    problems: todayProgress.map((p) => ({
      isCorrect: p.isCorrect,
      type: p.problem.type,
      difficulty: p.problem.difficulty,
      level: p.problem.level,
      timeSpent: p.timeSpent,
    })),
  }
}

export default {
  getUserProgress,
  getUserStats,
  getTodayStudySummary,
}

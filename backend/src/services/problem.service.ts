import prisma from '../utils/prisma'

interface GetProblemsFilter {
  level?: number
  type?: string
  difficulty?: string
  limit?: number
  offset?: number
  excludeSolved?: boolean
  userId?: string
}

/**
 * 문제 목록 조회
 */
export async function getProblems(filter: GetProblemsFilter) {
  const { level, type, difficulty, limit = 20, offset = 0, excludeSolved = false, userId } = filter

  const where: any = {}
  if (level) where.level = level
  if (type) where.type = type
  if (difficulty) where.difficulty = difficulty

  // 이미 푼 문제 제외
  if (excludeSolved && userId) {
    where.NOT = {
      userProgress: {
        some: {
          userId,
        },
      },
    }
  }

  // 이미 푼 문제 수 계산
  let solvedCount = 0
  if (excludeSolved && userId) {
    const solvedProblems = await prisma.userProgress.groupBy({
      by: ['problemId'],
      where: {
        userId,
        problem: {
          level,
          ...(type && { type }),
          ...(difficulty && { difficulty }),
        },
      },
    })
    solvedCount = solvedProblems.length
  }

  const [problems, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.problem.count({ where }),
  ])

  return { problems, total, limit, offset, solvedCount }
}

/**
 * 문제 상세 조회
 */
export async function getProblemById(problemId: string) {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
  })

  if (!problem) {
    throw new Error('문제를 찾을 수 없습니다')
  }

  return problem
}

/**
 * 답안 제출 및 채점
 */
export async function submitAnswer(
  userId: string,
  problemId: string,
  userAnswer: string,
  timeSpent?: number
) {
  // 문제 조회
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
  })

  if (!problem) {
    throw new Error('문제를 찾을 수 없습니다')
  }

  // 정답 확인
  const isCorrect = problem.answer.trim() === userAnswer.trim()

  // 기존 제출 기록 확인
  const existingProgress = await prisma.userProgress.findFirst({
    where: {
      userId,
      problemId,
    },
  })

  // 진도 기록 저장
  const userProgress = await prisma.userProgress.create({
    data: {
      userId,
      problemId,
      isCorrect,
      userAnswer,
      timeSpent,
      attemptCount: existingProgress ? existingProgress.attemptCount + 1 : 1,
    },
  })

  // 정답일 경우 포인트 지급
  let pointsEarned = 0
  if (isCorrect) {
    // 난이도별 포인트
    const pointsMap: Record<string, number> = {
      easy: 10,
      medium: 20,
      hard: 30,
    }
    pointsEarned = pointsMap[problem.difficulty] || 10

    // 첫 정답인 경우에만 포인트 지급
    if (!existingProgress || !existingProgress.isCorrect) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: { increment: pointsEarned },
          experiencePoints: { increment: pointsEarned },
        },
      })
    }
  }

  return {
    isCorrect,
    correctAnswer: problem.answer,
    explanation: problem.explanation,
    pointsEarned,
    userProgress,
  }
}

export default {
  getProblems,
  getProblemById,
  submitAnswer,
}

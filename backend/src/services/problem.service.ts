import prisma from '../utils/prisma'

interface GetProblemsFilter {
  level?: number
  type?: string
  difficulty?: string
  limit?: number
  offset?: number
}

/**
 * 문제 목록 조회
 */
export async function getProblems(filter: GetProblemsFilter) {
  const { level, type, difficulty, limit = 20, offset = 0 } = filter

  const where: any = {}
  if (level) where.level = level
  if (type) where.type = type
  if (difficulty) where.difficulty = difficulty

  const [problems, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.problem.count({ where }),
  ])

  return { problems, total, limit, offset }
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

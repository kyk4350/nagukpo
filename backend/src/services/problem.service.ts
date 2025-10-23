import prisma from '../utils/prisma'
import { checkAndGrantAchievements } from './achievement.service'

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

  // 랜덤 정렬을 위해 먼저 모든 ID를 가져옴
  const allProblemIds = await prisma.problem.findMany({
    where,
    select: { id: true },
  })

  // ID를 랜덤으로 섞음
  const shuffledIds = allProblemIds
    .map((p) => p.id)
    .sort(() => Math.random() - 0.5)
    .slice(offset, offset + limit)

  // 섞인 순서대로 문제를 가져옴
  const problems = await prisma.problem.findMany({
    where: {
      ...where,
      id: { in: shuffledIds },
    },
  })

  // 섞인 순서 유지
  const orderedProblems = shuffledIds
    .map((id) => problems.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  const total = allProblemIds.length

  return { problems: orderedProblems, total, limit, offset, solvedCount }
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

  // 배지 획득 확인 (비동기로 실행, 결과는 기다리지 않음)
  checkAndGrantAchievements(userId).catch((err) => {
    console.error('배지 획득 확인 중 오류:', err)
  })

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

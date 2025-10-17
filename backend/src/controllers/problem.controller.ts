import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import problemService from '../services/problem.service'

/**
 * GET /api/v1/problems
 * 문제 목록 조회
 */
export async function getProblemsController(req: Request, res: Response, next: NextFunction) {
  try {
    const level = req.query.level ? parseInt(req.query.level as string) : undefined
    const type = req.query.type as string | undefined
    const difficulty = req.query.difficulty as string | undefined
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0
    const excludeSolved = req.query.excludeSolved === 'true'
    const userId = (req as any).user?.userId

    const result = await problemService.getProblems({
      level,
      type,
      difficulty,
      limit,
      offset,
      excludeSolved,
      userId,
    })

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/v1/problems/:id
 * 문제 상세 조회
 */
export async function getProblemController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params

    const problem = await problemService.getProblemById(id)

    res.status(200).json({
      success: true,
      data: { problem },
    })
  } catch (error) {
    if (error instanceof Error && error.message === '문제를 찾을 수 없습니다') {
      return res.status(404).json({
        success: false,
        error: error.message,
      })
    }
    next(error)
  }
}

/**
 * POST /api/v1/problems/:id/submit
 * 답안 제출
 */
export async function submitAnswerController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const userId = (req as any).user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다',
      })
    }

    const submitSchema = z.object({
      answer: z.string().min(1, '답안을 입력해주세요'),
      timeSpent: z.number().optional(),
    })

    const validatedData = submitSchema.parse(req.body)

    const result = await problemService.submitAnswer(
      userId,
      id,
      validatedData.answer,
      validatedData.timeSpent
    )

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: '입력 데이터가 올바르지 않습니다',
        details: error.errors,
      })
    }

    if (error instanceof Error && error.message === '문제를 찾을 수 없습니다') {
      return res.status(404).json({
        success: false,
        error: error.message,
      })
    }

    next(error)
  }
}

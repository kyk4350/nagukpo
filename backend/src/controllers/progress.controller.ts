import { Request, Response, NextFunction } from 'express'
import progressService from '../services/progress.service'

/**
 * GET /api/v1/progress
 * 사용자 진도 조회
 */
export async function getProgressController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다',
      })
    }

    const progress = await progressService.getUserProgress(userId)

    res.status(200).json({
      success: true,
      data: progress,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/v1/stats
 * 사용자 통계 조회
 */
export async function getStatsController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다',
      })
    }

    const stats = await progressService.getUserStats(userId)

    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

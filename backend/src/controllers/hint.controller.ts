import { Request, Response } from 'express'
import * as hintService from '../services/hint.service'

/**
 * POST /api/v1/problems/:problemId/hint
 * 문제에 대한 힌트 생성
 */
export async function generateHint(req: Request, res: Response) {
  try {
    const { problemId } = req.params
    const { level } = req.body

    // 레벨 검증
    if (!level || ![1, 2, 3].includes(level)) {
      return res.status(400).json({
        success: false,
        error: '힌트 레벨은 1, 2, 3 중 하나여야 합니다',
      })
    }

    const result = await hintService.generateHint(problemId, level as 1 | 2 | 3)

    return res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('힌트 생성 오류:', error)
    return res.status(500).json({
      success: false,
      error: error.message || '힌트 생성에 실패했습니다',
    })
  }
}

export default {
  generateHint,
}

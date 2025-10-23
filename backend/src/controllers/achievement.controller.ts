import { Request, Response } from 'express'
import * as achievementService from '../services/achievement.service'

/**
 * 사용자 배지 목록 조회
 */
export async function getUserAchievements(req: Request, res: Response) {
  try {
    const userId = req.user!.id

    const achievements = await achievementService.getUserAchievements(userId)

    return res.json({
      success: true,
      data: achievements,
    })
  } catch (error: any) {
    console.error('배지 조회 오류:', error)
    return res.status(500).json({
      success: false,
      error: '배지를 조회하는 중 오류가 발생했습니다',
    })
  }
}

/**
 * 모든 배지 목록 조회 (획득 여부 포함)
 */
export async function getAllAchievements(req: Request, res: Response) {
  try {
    const userId = req.user!.id

    const achievements = await achievementService.getAllAchievementsWithStatus(userId)

    return res.json({
      success: true,
      data: achievements,
    })
  } catch (error: any) {
    console.error('전체 배지 조회 오류:', error)
    return res.status(500).json({
      success: false,
      error: '배지를 조회하는 중 오류가 발생했습니다',
    })
  }
}

export default {
  getUserAchievements,
  getAllAchievements,
}

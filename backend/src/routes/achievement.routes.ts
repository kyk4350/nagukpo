import { Router } from 'express'
import * as achievementController from '../controllers/achievement.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

/**
 * GET /api/v1/achievements
 * 모든 배지 목록 조회 (획득 여부 포함)
 */
router.get('/', authMiddleware, achievementController.getAllAchievements)

/**
 * GET /api/v1/achievements/unlocked
 * 획득한 배지만 조회
 */
router.get('/unlocked', authMiddleware, achievementController.getUserAchievements)

export default router

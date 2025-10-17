import { Router } from 'express'
import * as chatController from '../controllers/chat.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// 모든 챗봇 라우트는 인증 필요
router.use(authMiddleware)

// POST /api/v1/chat - 챗봇과 대화
router.post('/', chatController.sendMessage)

// GET /api/v1/chat/history - 대화 히스토리 조회
router.get('/history', chatController.getHistory)

// DELETE /api/v1/chat/history - 대화 히스토리 삭제
router.delete('/history', chatController.clearHistory)

export default router

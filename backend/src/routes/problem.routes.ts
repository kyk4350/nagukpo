import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  getProblemsController,
  getProblemController,
  submitAnswerController,
} from '../controllers/problem.controller'
import { generateHint } from '../controllers/hint.controller'

const router = Router()

// 문제 목록 조회 (인증 필요)
router.get('/', authMiddleware, getProblemsController)

// 문제 상세 조회 (인증 필요)
router.get('/:id', authMiddleware, getProblemController)

// 답안 제출 (인증 필요)
router.post('/:id/submit', authMiddleware, submitAnswerController)

// 힌트 생성 (인증 필요)
router.post('/:problemId/hint', authMiddleware, generateHint)

export default router

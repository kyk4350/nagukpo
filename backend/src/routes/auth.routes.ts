import { Router } from 'express'
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  getCurrentUserController
} from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.middleware'

const router = Router()

// POST /api/v1/auth/register - 회원가입
router.post('/register', registerLimiter, registerController)

// POST /api/v1/auth/login - 로그인
router.post('/login', loginLimiter, loginController)

// POST /api/v1/auth/logout - 로그아웃
router.post('/logout', logoutController)

// POST /api/v1/auth/refresh - Access Token 갱신
router.post('/refresh', refreshTokenController)

// GET /api/v1/auth/me - 현재 사용자 정보 조회 (인증 필요)
router.get('/me', authMiddleware, getCurrentUserController)

export default router

import { Request, Response, NextFunction } from 'express'
import authService from '../services/auth.service'

/**
 * JWT 인증 미들웨어
 * Authorization 헤더의 토큰을 검증하고 req.user에 사용자 정보를 추가합니다.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Authorization 헤더 확인
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: '인증 토큰이 필요합니다'
      })
    }

    // Bearer 토큰 형식 확인
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: '올바르지 않은 토큰 형식입니다'
      })
    }

    const token = parts[1]

    // 토큰 검증
    const payload = authService.verifyAccessToken(token)

    // req에 사용자 정보 추가
    ;(req as any).user = payload

    next()
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({
        success: false,
        error: '유효하지 않은 토큰입니다'
      })
    }

    next(error)
  }
}

/**
 * 선택적 인증 미들웨어
 * 토큰이 있으면 검증하지만, 없어도 통과시킵니다.
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return next()
  }

  try {
    const parts = authHeader.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token = parts[1]
      const payload = authService.verifyAccessToken(token)
      ;(req as any).user = payload
    }
  } catch (error) {
    // 토큰이 유효하지 않아도 계속 진행
  }

  next()
}

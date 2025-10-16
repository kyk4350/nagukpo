import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import authService from '../services/auth.service'

// Zod 검증 스키마
const registerSchema = z.object({
  username: z.string()
    .min(2, '사용자명은 최소 2자 이상이어야 합니다')
    .max(20, '사용자명은 최대 20자까지 가능합니다')
    .regex(/^[a-zA-Z0-9가-힣_]+$/, '사용자명은 영문, 한글, 숫자, 언더스코어만 가능합니다'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/[a-z]/, '비밀번호는 소문자를 포함해야 합니다')
    .regex(/[A-Z]/, '비밀번호는 대문자를 포함해야 합니다')
    .regex(/[0-9]/, '비밀번호는 숫자를 포함해야 합니다')
    .regex(/[^a-zA-Z0-9]/, '비밀번호는 특수문자를 포함해야 합니다'),
  birthYear: z.number()
    .int('출생년도는 정수여야 합니다')
    .min(1900, '출생년도는 1900년 이상이어야 합니다')
    .max(new Date().getFullYear(), '출생년도는 현재 연도 이하여야 합니다'),
  parentEmail: z.union([
    z.string().email('올바른 이메일 형식이 아닙니다'),
    z.literal('')
  ]).optional()
})

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요')
})

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh Token이 필요합니다')
})

/**
 * POST /api/v1/auth/register
 * 회원가입
 */
export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    // 요청 데이터 검증
    const validatedData = registerSchema.parse(req.body)

    // 만 14세 미만인 경우 부모 이메일 필수
    const currentYear = new Date().getFullYear()
    const age = currentYear - validatedData.birthYear

    if (age < 14 && !validatedData.parentEmail) {
      return res.status(400).json({
        success: false,
        error: '만 14세 미만인 경우 보호자 이메일이 필요합니다'
      })
    }

    // 회원가입 처리
    const result = await authService.register(validatedData)

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        tokens: result.tokens
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: '입력 데이터가 올바르지 않습니다',
        details: error.errors
      })
    }

    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        error: error.message
      })
    }

    next(error)
  }
}

/**
 * POST /api/v1/auth/login
 * 로그인
 */
export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    // 요청 데이터 검증
    const validatedData = loginSchema.parse(req.body)

    // 로그인 처리
    const result = await authService.login(validatedData)

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        tokens: result.tokens
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: '입력 데이터가 올바르지 않습니다',
        details: error.errors
      })
    }

    if (error instanceof Error) {
      return res.status(401).json({
        success: false,
        error: error.message
      })
    }

    next(error)
  }
}

/**
 * POST /api/v1/auth/logout
 * 로그아웃
 */
export async function logoutController(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh Token이 필요합니다'
      })
    }

    await authService.logout(refreshToken)

    res.status(200).json({
      success: true,
      message: '로그아웃되었습니다'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/v1/auth/refresh
 * Access Token 갱신
 */
export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {
  try {
    // 요청 데이터 검증
    const validatedData = refreshTokenSchema.parse(req.body)

    // 토큰 갱신
    const tokens = await authService.refreshAccessToken(validatedData.refreshToken)

    res.status(200).json({
      success: true,
      data: { tokens }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: '입력 데이터가 올바르지 않습니다',
        details: error.errors
      })
    }

    if (error instanceof Error) {
      return res.status(401).json({
        success: false,
        error: error.message
      })
    }

    next(error)
  }
}

/**
 * GET /api/v1/auth/me
 * 현재 사용자 정보 조회
 */
export async function getCurrentUserController(req: Request, res: Response, next: NextFunction) {
  try {
    // authMiddleware에서 req.user에 사용자 정보를 넣어줌
    const userId = (req as any).user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다'
      })
    }

    const user = await authService.getUserById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '사용자를 찾을 수 없습니다'
      })
    }

    res.status(200).json({
      success: true,
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

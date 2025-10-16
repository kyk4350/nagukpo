import rateLimit from 'express-rate-limit'

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') // 15분
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')

/**
 * 로그인 요청 Rate Limiter
 * 5회/15분
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5,
  message: {
    success: false,
    error: '너무 많은 로그인 시도가 있었습니다. 15분 후에 다시 시도해주세요.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

/**
 * 회원가입 요청 Rate Limiter
 * 3회/1시간
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  max: 3,
  message: {
    success: false,
    error: '너무 많은 회원가입 시도가 있었습니다. 1시간 후에 다시 시도해주세요.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

/**
 * 일반 API 요청 Rate Limiter
 * 100회/15분
 */
export const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: {
    success: false,
    error: '너무 많은 요청이 있었습니다. 잠시 후에 다시 시도해주세요.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// User 타입
export interface User {
  id: string
  username: string
  email: string
  birthYear: number
  parentEmail?: string
  level: number
  points: number
  experiencePoints: number
  streakDays: number
  lastStreakDate?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

// 로그인 자격증명
export interface LoginCredentials {
  email: string
  password: string
}

// 회원가입 데이터
export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
  birthYear: number
  parentEmail?: string
}

// 인증 토큰
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// 인증 응답
export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

// API 응답 (제네릭)
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

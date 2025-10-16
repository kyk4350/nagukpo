import apiClient, { setTokens } from './client'
import { LoginCredentials, RegisterData, AuthResponse, User, ApiResponse } from '@/types'

/**
 * 회원가입
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/v1/auth/register', data)

  if (response.data.success && response.data.data) {
    // 토큰 저장
    setTokens(response.data.data.tokens)
    return response.data.data
  }

  throw new Error(response.data.error || '회원가입에 실패했습니다')
}

/**
 * 로그인
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', credentials)

  if (response.data.success && response.data.data) {
    // 토큰 저장
    setTokens(response.data.data.tokens)
    return response.data.data
  }

  throw new Error(response.data.error || '로그인에 실패했습니다')
}

/**
 * 로그아웃
 */
export async function logout(refreshToken: string): Promise<void> {
  try {
    await apiClient.post('/api/v1/auth/logout', { refreshToken })
  } finally {
    // 실패해도 로컬 토큰은 삭제
    setTokens(null)
  }
}

/**
 * Access Token 갱신
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await apiClient.post<ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>>('/api/v1/auth/refresh', {
    refreshToken
  })

  if (response.data.success && response.data.data) {
    const tokens = response.data.data.tokens
    setTokens(tokens)
    return tokens
  }

  throw new Error(response.data.error || '토큰 갱신에 실패했습니다')
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<ApiResponse<{ user: User }>>('/api/v1/auth/me')

  if (response.data.success && response.data.data) {
    return response.data.data.user
  }

  throw new Error(response.data.error || '사용자 정보를 가져오는데 실패했습니다')
}

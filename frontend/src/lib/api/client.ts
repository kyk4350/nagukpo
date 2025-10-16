import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'
import { AuthTokens } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// 토큰 저장/조회 함수
let tokens: AuthTokens | null = null

export function setTokens(newTokens: AuthTokens | null) {
  tokens = newTokens
  if (typeof window !== 'undefined') {
    if (newTokens) {
      localStorage.setItem('accessToken', newTokens.accessToken)
      localStorage.setItem('refreshToken', newTokens.refreshToken)
    } else {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }
}

export function getTokens(): AuthTokens | null {
  if (typeof window !== 'undefined' && !tokens) {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken && refreshToken) {
      tokens = { accessToken, refreshToken }
    }
  }
  return tokens
}

// 토큰 갱신 중인지 추적 (동시 요청 처리)
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request Interceptor: Authorization 헤더에 토큰 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const currentTokens = getTokens()
    if (currentTokens?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${currentTokens.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: 401 에러 시 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 401 에러이고, 재시도하지 않은 요청이며, refresh 엔드포인트가 아닌 경우
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        // 이미 갱신 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return apiClient(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const currentTokens = getTokens()
      if (!currentTokens?.refreshToken) {
        // Refresh Token이 없으면 로그인 페이지로
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
        return Promise.reject(error)
      }

      try {
        // Refresh Token으로 새 Access Token 요청
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: currentTokens.refreshToken
        })

        const newTokens = response.data.data.tokens

        // 새 토큰 저장
        setTokens(newTokens)

        // 큐에 있는 요청들 처리
        processQueue(null, newTokens.accessToken)

        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
        }
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh 실패 시 로그아웃
        processQueue(refreshError, null)
        setTokens(null)
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

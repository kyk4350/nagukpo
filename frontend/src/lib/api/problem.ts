import apiClient from './client'
import type { ApiResponse } from '@/types'
import type { Problem, SubmitAnswerRequest, SubmitAnswerResponse, UserProgress, UserStats } from '@/types/problem'

/**
 * 문제 목록 조회
 */
export async function getProblems(params?: {
  level?: number
  type?: string
  difficulty?: string
  limit?: number
  offset?: number
  excludeSolved?: boolean
}): Promise<{ problems: Problem[]; total: number; limit: number; offset: number; solvedCount: number }> {
  const queryParams = new URLSearchParams()
  if (params?.level) queryParams.append('level', params.level.toString())
  if (params?.type) queryParams.append('type', params.type)
  if (params?.difficulty) queryParams.append('difficulty', params.difficulty)
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.offset) queryParams.append('offset', params.offset.toString())
  if (params?.excludeSolved) queryParams.append('excludeSolved', 'true')

  const response = await apiClient.get<ApiResponse<{ problems: Problem[]; total: number; limit: number; offset: number; solvedCount: number }>>(
    `/problems?${queryParams.toString()}`
  )

  if (response.data.success && response.data.data) {
    return response.data.data
  }

  throw new Error('문제 목록을 불러오는데 실패했습니다')
}

/**
 * 문제 상세 조회
 */
export async function getProblem(id: string): Promise<Problem> {
  const response = await apiClient.get<ApiResponse<{ problem: Problem }>>(`/problems/${id}`)

  if (response.data.success && response.data.data) {
    return response.data.data.problem
  }

  throw new Error('문제를 불러오는데 실패했습니다')
}

/**
 * 답안 제출
 */
export async function submitAnswer(problemId: string, data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
  const response = await apiClient.post<ApiResponse<SubmitAnswerResponse>>(
    `/problems/${problemId}/submit`,
    data
  )

  if (response.data.success && response.data.data) {
    return response.data.data
  }

  throw new Error('답안 제출에 실패했습니다')
}

/**
 * 사용자 진도 조회
 */
export async function getUserProgress(): Promise<UserProgress> {
  const response = await apiClient.get<ApiResponse<UserProgress>>('/progress')

  if (response.data.success && response.data.data) {
    return response.data.data
  }

  throw new Error('진도를 불러오는데 실패했습니다')
}

/**
 * 사용자 통계 조회
 */
export async function getUserStats(): Promise<UserStats> {
  const response = await apiClient.get<ApiResponse<UserStats>>('/stats')

  if (response.data.success && response.data.data) {
    return response.data.data
  }

  throw new Error('통계를 불러오는데 실패했습니다')
}

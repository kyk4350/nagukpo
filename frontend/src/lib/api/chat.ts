import apiClient from './client'
import type { ApiResponse } from '@/types'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  createdAt?: Date
}

export interface SendMessageRequest {
  message: string
  conversationHistory?: ChatMessage[]
}

export interface SendMessageResponse {
  message: string
  conversationHistory: ChatMessage[]
}

export interface ChatHistoryResponse {
  history: Array<{
    role: 'user' | 'assistant'
    content: string
    createdAt: Date
  }>
}

/**
 * 챗봇에게 메시지 전송
 */
export async function sendChatMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
  const response = await apiClient.post<ApiResponse<SendMessageResponse>>('/chat', data)

  if (response.data.success && response.data.data) {
    return response.data.data
  }

  throw new Error(response.data.error || '메시지 전송에 실패했습니다')
}

/**
 * 대화 히스토리 조회
 */
export async function getChatHistory(limit?: number): Promise<ChatHistoryResponse> {
  const params = limit ? { limit: limit.toString() } : {}
  const response = await apiClient.get<ApiResponse<ChatHistoryResponse>>('/chat/history', { params })

  if (response.data.success && response.data.data) {
    return response.data.data
  }

  throw new Error(response.data.error || '대화 히스토리 조회에 실패했습니다')
}

/**
 * 대화 히스토리 삭제
 */
export async function clearChatHistory(): Promise<void> {
  const response = await apiClient.delete<ApiResponse<{ message: string }>>('/chat/history')

  if (!response.data.success) {
    throw new Error(response.data.error || '대화 히스토리 삭제에 실패했습니다')
  }
}

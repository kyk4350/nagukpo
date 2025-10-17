import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sendChatMessage, getChatHistory, clearChatHistory } from '@/lib/api/chat'
import type { SendMessageRequest } from '@/lib/api/chat'

// 챗봇 메시지 전송 뮤테이션 훅
export function useSendMessage() {
  return useMutation({
    mutationFn: (data: SendMessageRequest) => sendChatMessage(data),
  })
}

// 대화 히스토리 조회 쿼리 훅
export function useChatHistory(enabled: boolean = true) {
  return useQuery({
    queryKey: ['chat', 'history'],
    queryFn: () => getChatHistory(50),
    enabled,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// 대화 히스토리 삭제 뮤테이션 훅
export function useClearChatHistory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: clearChatHistory,
    onSuccess: () => {
      // 히스토리 삭제 성공 시 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['chat', 'history'] })
    },
  })
}

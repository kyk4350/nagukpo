import { useMutation } from '@tanstack/react-query'
import { submitAnswer } from '@/lib/api/problem'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/lib/queryKeys'
import type { SubmitAnswerRequest } from '@/types/problem'

// 답안 제출 뮤테이션 훅
// 문제 ID와 답안 데이터를 받아 제출
// 주의: 자동으로 쿼리를 무효화하지 않음 - 호출하는 쪽에서 필요할 때만 invalidate 해야 함
export function useSubmitAnswer(problemId: string) {
  return useMutation({
    mutationFn: (data: SubmitAnswerRequest) => submitAnswer(problemId, data),
    // onSuccess에서 자동으로 invalidate 하지 않음
    // 이유: 문제 제출 후 바로 refetch하면 excludeSolved=true 때문에
    // 방금 푼 문제가 목록에서 사라져 currentIndex가 어긋남
    // 대신 다음 문제로 넘어갈 때나 모든 문제 완료 시에만 refetch
  })
}

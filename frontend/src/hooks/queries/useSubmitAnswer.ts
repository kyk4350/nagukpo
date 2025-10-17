import { useMutation } from '@tanstack/react-query'
import { submitAnswer } from '@/lib/api/problem'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/lib/queryKeys'
import type { SubmitAnswerRequest } from '@/types/problem'

// 답안 제출 뮤테이션 훅
// 문제 ID와 답안 데이터를 받아 제출하고, 성공 시 관련 쿼리를 무효화하여 데이터 갱신
export function useSubmitAnswer(problemId: string) {
  return useMutation({
    mutationFn: (data: SubmitAnswerRequest) => submitAnswer(problemId, data),
    onSuccess: () => {
      // 성공 시 관련 쿼리 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.problems.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current })
    },
  })
}

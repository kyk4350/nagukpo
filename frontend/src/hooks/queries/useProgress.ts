import { useQuery } from '@tanstack/react-query'
import { getUserProgress } from '@/lib/api/problem'
import { queryKeys } from '@/lib/queryKeys'

// 사용자 진도 조회 쿼리 훅
// 총 문제 수, 정답 수, 정확도, 레벨별 진도 등을 조회
export function useProgress() {
  return useQuery({
    queryKey: queryKeys.progress.summary,
    queryFn: getUserProgress,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

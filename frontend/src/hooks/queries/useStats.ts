import { useQuery } from '@tanstack/react-query'
import { getUserStats } from '@/lib/api/problem'
import { queryKeys } from '@/lib/queryKeys'

// 사용자 통계 조회 쿼리 훅
// 유형별 정답률, 난이도별 정답률, 일주일간 학습 기록 등을 조회
export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats.summary,
    queryFn: getUserStats,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

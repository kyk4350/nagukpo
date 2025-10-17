import { useQuery } from '@tanstack/react-query'
import { getProblems } from '@/lib/api/problem'
import { queryKeys } from '@/lib/queryKeys'
import type { GetProblemsParams } from '@/types/problem'

// 문제 목록 조회 쿼리 훅
// params: 레벨, 타입, 난이도, 페이지네이션, 풀이 완료 문제 제외 옵션
export function useProblems(params: GetProblemsParams = {}) {
  return useQuery({
    queryKey: queryKeys.problems.list(params),
    queryFn: () => getProblems(params),
    staleTime: 5 * 60 * 1000, // 5분
  })
}

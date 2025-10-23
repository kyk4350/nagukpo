import { useQuery } from '@tanstack/react-query'
import { getTodayStudySummary } from '@/lib/api/progress'

export function useTodaySummary() {
  return useQuery({
    queryKey: ['progress', 'today'],
    queryFn: getTodayStudySummary,
    staleTime: 0, // 항상 최신 데이터 가져오기
  })
}

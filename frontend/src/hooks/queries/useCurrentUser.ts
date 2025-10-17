import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/lib/api/auth'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/stores/authStore'

// 현재 사용자 정보 조회 쿼리 훅
// 인증 상태에 따라 조건부로 실행됨
export function useCurrentUser() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return useQuery({
    queryKey: queryKeys.users.current,
    queryFn: getCurrentUser,
    enabled: isAuthenticated, // 인증된 경우에만 실행
    staleTime: 5 * 60 * 1000, // 5분
  })
}

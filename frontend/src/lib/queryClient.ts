import { QueryClient } from '@tanstack/react-query'

// QueryClient 인스턴스 생성
// staleTime: 데이터가 신선한 상태로 유지되는 시간 (5분)
// refetchOnWindowFocus: 창 포커스 시 자동 리페칭 비활성화
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

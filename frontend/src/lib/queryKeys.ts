// React Query 쿼리 키 상수 정의
// 쿼리 키는 배열 형태로 작성하며, 첫 번째 요소는 리소스명, 두 번째 요소는 파라미터 객체

import type { GetProblemsParams } from '@/types/problem'

export const queryKeys = {
  // 사용자 관련
  users: {
    current: ['users', 'current'] as const,
  },

  // 문제 관련
  problems: {
    all: ['problems'] as const,
    list: (params: GetProblemsParams) => ['problems', params] as const,
    detail: (id: number) => ['problems', id] as const,
  },

  // 진도 관련
  progress: {
    all: ['progress'] as const,
    summary: ['progress', 'summary'] as const,
    byLevel: (level: number) => ['progress', { level }] as const,
  },
}

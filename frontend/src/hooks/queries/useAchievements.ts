import { useQuery } from '@tanstack/react-query'
import { getAllAchievements, getUnlockedAchievements } from '@/lib/api/achievement'

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: getAllAchievements,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

export function useUnlockedAchievements() {
  return useQuery({
    queryKey: ['achievements', 'unlocked'],
    queryFn: getUnlockedAchievements,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

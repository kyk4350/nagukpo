import apiClient from './client'
import type { AchievementWithStatus, UserAchievement } from '@/types/achievement'

/**
 * 모든 배지 조회 (획득 여부 포함)
 */
export async function getAllAchievements(): Promise<AchievementWithStatus[]> {
  const response = await apiClient.get('/achievements')
  return response.data.data
}

/**
 * 획득한 배지만 조회
 */
export async function getUnlockedAchievements(): Promise<UserAchievement[]> {
  const response = await apiClient.get('/achievements/unlocked')
  return response.data.data
}

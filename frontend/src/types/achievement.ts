export interface Achievement {
  id: string
  code: string
  name: string
  description: string
  icon: string | null
  condition: Record<string, any>
  points: number
  createdAt: string
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  unlockedAt: string
  achievement: Achievement
}

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean
  unlockedAt: string | null
}

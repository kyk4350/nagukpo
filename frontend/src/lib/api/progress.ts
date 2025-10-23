import apiClient from './client'

export interface TodayStudySummary {
  totalProblems: number
  correctProblems: number
  accuracy: number
  pointsEarned: number
  totalTimeSpent: number
  avgTimePerProblem: number
  typeStats: Record<string, { total: number; correct: number }>
  difficultyStats: Record<string, { total: number; correct: number }>
  problems: Array<{
    isCorrect: boolean
    type: string
    difficulty: string
    level: number
    timeSpent: number | null
  }>
}

export async function getTodayStudySummary(): Promise<TodayStudySummary> {
  const response = await apiClient.get('/progress/today')
  return response.data.data
}

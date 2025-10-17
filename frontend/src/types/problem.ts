export interface Problem {
  id: string
  type: string
  category: string | null
  difficulty: 'easy' | 'medium' | 'hard'
  level: number
  subLevel: string | null
  question: string
  passage: string | null
  options: string[] | null
  answer: string
  explanation: string
  source: string | null
  curriculumMapping: string | null
  timeLimitSeconds: number | null
  difficultyRating: number | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface SubmitAnswerRequest {
  answer: string
  timeSpent?: number
}

export interface SubmitAnswerResponse {
  isCorrect: boolean
  correctAnswer: string
  explanation: string
  pointsEarned: number
  userProgress: any
}

export interface UserProgress {
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  progressByLevel: Array<{
    level: number
    attempted_count: number
    solved_count: number
    total_count: number
  }>
  recentProgress: any[]
}

export interface UserStats {
  user: {
    level: number
    points: number
    experiencePoints: number
    streakDays: number
    lastStreakDate: string | null
  }
  statsByType: any[]
  statsByDifficulty: any[]
}

export interface GetProblemsParams {
  level?: number
  type?: string
  difficulty?: string
  limit?: number
  offset?: number
  excludeSolved?: boolean
}

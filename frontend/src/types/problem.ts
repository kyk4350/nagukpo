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

export interface RecentProgressItem {
  id: string
  userId: string
  problemId: string
  isCorrect: boolean
  userAnswer: string
  attemptCount: number
  timeSpent: number | null
  attemptedAt: string
  problem: {
    id: string
    type: string
    difficulty: 'easy' | 'medium' | 'hard'
    level: number
    question: string
  }
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
  recentProgress: RecentProgressItem[]
}

export interface StatsByType {
  type: string
  total_attempts: number
  correct_attempts: number
  accuracy: number
}

export interface StatsByDifficulty {
  difficulty: string
  total_attempts: number
  correct_attempts: number
  accuracy: number
}

export interface DailyActivity {
  date: string
  total_problems: number
  correct_problems: number
}

export interface UserStats {
  user: {
    level: number
    points: number
    experiencePoints: number
    streakDays: number
    lastStreakDate: string | null
  }
  statsByType: StatsByType[]
  statsByDifficulty: StatsByDifficulty[]
  dailyActivity: DailyActivity[]
}

export interface GetProblemsParams {
  level?: number
  type?: string
  difficulty?: string
  limit?: number
  offset?: number
  excludeSolved?: boolean
}

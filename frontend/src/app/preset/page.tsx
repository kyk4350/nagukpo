'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useProgress } from '@/hooks/queries/useProgress'
import { useProblems } from '@/hooks/queries/useProblems'

export default function PresetPage() {
  const router = useRouter()

  // React Query 사용: 진도 데이터 조회
  const { data: progress, isLoading: progressLoading } = useProgress()

  // React Query 사용: 각 레벨별 문제 개수 조회
  const level1Query = useProblems({ level: 1, limit: 1 })
  const level2Query = useProblems({ level: 2, limit: 1 })
  const level3Query = useProblems({ level: 3, limit: 1 })
  const level4Query = useProblems({ level: 4, limit: 1 })

  // 레벨별 문제 개수 매핑
  const levelCounts: Record<number, number> = {
    1: level1Query.data?.total || 0,
    2: level2Query.data?.total || 0,
    3: level3Query.data?.total || 0,
    4: level4Query.data?.total || 0,
  }

  // 로딩 상태: 진도 또는 레벨1 쿼리 중 하나라도 로딩중이면 로딩 표시
  const loading = progressLoading || level1Query.isLoading

  const levels = [
    { level: 1, name: '기초 다지기', description: '초등 5-6학년 수준', color: 'bg-green-500' },
    { level: 2, name: '기본 마스터', description: '중학 1-2학년 수준', color: 'bg-blue-500' },
    { level: 3, name: '실력 향상', description: '중학 3학년 ~ 고1', color: 'bg-purple-500' },
    { level: 4, name: '수능 대비', description: '고2-3 수능 준비', color: 'bg-red-500' },
  ]

  const getLevelProgress = (level: number) => {
    if (!progress) return { attempted: 0, solved: 0, total: 0, percentage: 0 }

    const levelData = progress.progressByLevel.find((p: any) => p.level === level)
    if (!levelData) return { attempted: 0, solved: 0, total: 0, percentage: 0 }

    const attempted = parseInt(levelData.attempted_count || '0')
    const solved = parseInt(levelData.solved_count || '0')
    const total = parseInt(levelData.total_count || '0')
    const percentage = total > 0 ? Math.round((attempted / total) * 100) : 0

    return { attempted, solved, total, percentage }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
            ← 대시보드로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">프리셋 학습</h1>
          <p className="text-gray-600">체계적인 커리큘럼으로 국어 실력을 키워보세요</p>
        </div>

        {/* Stats */}
        {progress && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">총 문제 수</p>
                <p className="text-2xl font-bold text-gray-900">{progress.totalAttempts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">정답 수</p>
                <p className="text-2xl font-bold text-green-600">{progress.correctAttempts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">정답률</p>
                <p className="text-2xl font-bold text-blue-600">{progress.accuracy}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Levels */}
        <div className="space-y-4">
          {levels.map((levelInfo) => {
            const { attempted, percentage } = getLevelProgress(levelInfo.level)
            const totalProblems = levelCounts[levelInfo.level] || 0
            const isAvailable = totalProblems > 0 // 전체 문제가 있으면 활성화

            return (
              <div
                key={levelInfo.level}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${
                  !isAvailable ? 'opacity-50' : ''
                }`}
              >
                <button
                  onClick={() => isAvailable && router.push(`/preset/${levelInfo.level}`)}
                  disabled={!isAvailable}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`${levelInfo.color} w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold`}>
                        {levelInfo.level}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{levelInfo.name}</h3>
                        <p className="text-sm text-gray-600">{levelInfo.description}</p>
                        {isAvailable && (
                          <p className="text-sm text-gray-500 mt-1">
                            {attempted} / {totalProblems} 문제 완료
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {isAvailable ? (
                        <>
                          <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
                          <div className="text-sm text-gray-500">진행률</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400">준비 중</div>
                      )}
                    </div>
                  </div>
                  {isAvailable && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${levelInfo.color} h-2 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

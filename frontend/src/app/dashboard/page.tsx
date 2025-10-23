'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import Button from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card'
import Badge from '@/components/Badge'
import { useAuthStore } from '@/stores/authStore'
import { useCurrentUser } from '@/hooks/queries/useCurrentUser'
import { useProgress } from '@/hooks/queries/useProgress'
import { useStats } from '@/hooks/queries/useStats'
import { useUnlockedAchievements } from '@/hooks/queries/useAchievements'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// 문제 유형 한글 변환 함수
const getTypeLabel = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'reading': '독해',
    'vocabulary': '어휘',
    'grammar': '문법',
    'writing': '작문',
  }
  return typeMap[type] || type
}

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, logout, _hasHydrated } = useAuthStore()

  // React Query 사용: 현재 사용자 정보 조회
  const { data: user, isLoading } = useCurrentUser()
  const { data: progress } = useProgress()
  const { data: stats } = useStats()
  const { data: unlockedAchievements = [] } = useUnlockedAchievements()

  useEffect(() => {
    // Zustand persist가 rehydrate될 때까지 대기
    if (!_hasHydrated) return

    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [_hasHydrated, isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (isLoading || !user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </Container>
      </main>
    )
  }

  const currentYear = new Date().getFullYear()
  const age = currentYear - user.birthYear

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">나국포</h1>
            <Button variant="ghost" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <Container className="py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            안녕하세요, {user.username}님! 👋
          </h2>
          <p className="text-lg text-gray-600">
            오늘도 국어 실력을 키워볼까요?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">레벨</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-primary-600">
                      {user.level}
                    </span>
                    <span className="ml-2 text-gray-500">단계</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">포인트</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-secondary-600">
                      {user.points.toLocaleString()}
                    </span>
                    <span className="ml-2 text-gray-500">P</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">연속 학습</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-orange-600">
                      {user.streakDays}
                    </span>
                    <span className="ml-2 text-gray-500">일</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>학습 진행도</CardTitle>
                <CardDescription>
                  현재 레벨에서 다음 레벨까지
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">경험치</span>
                      <span className="font-semibold">
                        {user.experiencePoints} / {user.level * 1000}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((user.experiencePoints / (user.level * 1000)) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      다음 레벨까지 {user.level * 1000 - user.experiencePoints} 경험치 필요
                    </p>
                  </div>

                  {/* Level Up Requirements */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">💡 레벨업 조건</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <div>
                          <span className="text-gray-700">레벨 {user.level + 1}:</span>{' '}
                          <span className="text-gray-600">
                            경험치 {user.level * 1000}점 달성
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-green-500 mt-0.5">•</span>
                        <div className="text-gray-600">
                          문제를 풀어서 경험치를 획득하세요
                          <br />
                          <span className="text-gray-500">
                            (쉬움: 10점, 보통: 20점, 어려움: 30점)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <div className="text-gray-600">
                          배지를 획득해서 추가 경험치를 받으세요
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 시작</CardTitle>
                <CardDescription>
                  오늘의 학습을 시작해보세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => router.push('/preset')}
                  >
                    📝 프리셋 학습 시작
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => router.push('/chat')}
                  >
                    💬 AI 선생님과 대화
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => alert('학습 분석 기능은 준비 중입니다!')}
                  >
                    📊 학습 분석 보기
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => alert('랭킹 기능은 준비 중입니다!')}
                  >
                    🏆 랭킹 확인
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 최근 활동 */}
            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>
                  최근 풀이한 문제
                </CardDescription>
              </CardHeader>
              <CardContent>
                {progress?.recentProgress && progress.recentProgress.length > 0 ? (
                  <div className="space-y-3">
                    {progress.recentProgress.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.isCorrect ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <span className="text-lg">
                              {item.isCorrect ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {item.problem.question.substring(0, 50)}
                              {item.problem.question.length > 50 ? '...' : ''}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" size="sm">
                                Level {item.problem.level}
                              </Badge>
                              <Badge
                                variant={
                                  item.problem.difficulty === 'easy' ? 'success' :
                                  item.problem.difficulty === 'medium' ? 'warning' :
                                  'danger'
                                }
                                size="sm"
                              >
                                {item.problem.difficulty === 'easy' ? '쉬움' :
                                 item.problem.difficulty === 'medium' ? '보통' : '어려움'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 ml-2">
                          {new Date(item.attemptedAt).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-2">아직 풀이한 문제가 없습니다</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push('/preset')}
                    >
                      문제 풀러 가기
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 일주일간 학습 통계 */}
            {stats?.dailyActivity && stats.dailyActivity.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>일주일간 학습 기록</CardTitle>
                  <CardDescription>
                    최근 7일간 풀이한 문제 수
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getMonth() + 1}/${date.getDate()}`
                        }}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString('ko-KR')}
                        formatter={(value: number, name: string) => {
                          if (name === 'correct_problems') return [value, '정답']
                          if (name === 'total_problems') return [value, '전체']
                          return [value, name]
                        }}
                      />
                      <Bar dataKey="correct_problems" fill="#10b981" name="정답" />
                      <Bar dataKey="total_problems" fill="#3b82f6" name="전체" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* 유형별 정답률 */}
            {stats?.statsByType && stats.statsByType.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>유형별 정답률</CardTitle>
                  <CardDescription>
                    문제 유형별 성취도
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={stats.statsByType}
                          dataKey="accuracy"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          label={(entry) => `${getTypeLabel(entry.type)}: ${entry.accuracy}%`}
                        >
                          {stats.statsByType.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={['#3b82f6', '#a855f7', '#f59e0b', '#10b981'][index % 4]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {stats.statsByType.map((stat, index) => (
                        <div key={stat.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: ['#3b82f6', '#a855f7', '#f59e0b', '#10b981'][index % 4]
                              }}
                            />
                            <span className="text-sm font-medium">{getTypeLabel(stat.type)}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{stat.accuracy}%</p>
                            <p className="text-xs text-gray-500">
                              {stat.correct_attempts}/{stat.total_attempts}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - User Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>내 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">이름</p>
                  <p className="font-semibold">{user.username}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">이메일</p>
                  <p className="font-semibold">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">나이</p>
                  <p className="font-semibold">{age}세</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">회원 등급</p>
                  <Badge variant="primary" size="md">
                    {user.level < 5 ? '초급' : user.level < 10 ? '중급' : '고급'} 학습자
                  </Badge>
                </div>

                {user.parentEmail && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">학부모 이메일</p>
                    <p className="text-sm">{user.parentEmail}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-1">가입일</p>
                  <p className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => alert('프로필 수정 기능은 준비 중입니다!')}
                >
                  프로필 수정
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Card */}
            <Card>
              <CardHeader>
                <CardTitle>최근 달성</CardTitle>
                <CardDescription>
                  새롭게 획득한 배지 ({unlockedAchievements.length}개)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unlockedAchievements.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      아직 획득한 배지가 없습니다.
                      <br />
                      문제를 풀어서 배지를 획득해보세요!
                    </p>
                  ) : (
                    unlockedAchievements.slice(0, 3).map((ua) => {
                      const timeDiff = Date.now() - new Date(ua.unlockedAt).getTime()
                      const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
                      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60))
                      const timeAgo = daysAgo > 0 ? `${daysAgo}일 전` : hoursAgo > 0 ? `${hoursAgo}시간 전` : '방금'

                      return (
                        <div key={ua.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-2xl">{ua.achievement.icon || '🏅'}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{ua.achievement.name}</p>
                            <p className="text-xs text-gray-500">{timeAgo}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            +{ua.achievement.points}p
                          </Badge>
                        </div>
                      )
                    })
                  )}
                </div>

                {unlockedAchievements.length > 3 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => alert('전체 배지 페이지는 준비 중입니다!')}
                  >
                    전체 배지 보기 ({unlockedAchievements.length}개)
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  )
}

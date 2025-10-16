'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import Button from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card'
import Badge from '@/components/Badge'
import { useAuthStore } from '@/stores/authStore'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, fetchCurrentUser, isLoading } = useAuthStore()

  useEffect(() => {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // 사용자 정보가 없으면 가져오기
    if (!user) {
      fetchCurrentUser()
    }
  }, [isAuthenticated, user, router, fetchCurrentUser])

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
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">경험치</span>
                    <span className="font-semibold">
                      {user.experiencePoints} / {user.level * 1000}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-primary-600 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((user.experiencePoints / (user.level * 1000)) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    다음 레벨까지 {user.level * 1000 - user.experiencePoints} 경험치 필요
                  </p>
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
                  <Button variant="primary" size="lg" className="w-full">
                    📝 오늘의 문제 풀기
                  </Button>
                  <Button variant="secondary" size="lg" className="w-full">
                    💬 AI 선생님과 대화
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    📊 학습 분석 보기
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    🏆 랭킹 확인
                  </Button>
                </div>
              </CardContent>
            </Card>
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

                <Button variant="outline" className="w-full">
                  프로필 수정
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Card */}
            <Card>
              <CardHeader>
                <CardTitle>최근 달성</CardTitle>
                <CardDescription>
                  새롭게 획득한 배지
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏅</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">첫 문제 해결</p>
                      <p className="text-xs text-gray-500">1일 전</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">3일 연속 학습</p>
                      <p className="text-xs text-gray-500">오늘</p>
                    </div>
                  </div>
                </div>

                <Button variant="ghost" className="w-full mt-4">
                  전체 배지 보기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  )
}

import Link from 'next/link'
import Container from '@/components/Container'
import Button from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 sm:py-32">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

        <Container className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              국포자 탈출 프로젝트
              <span className="block text-primary-600 mt-2">나국포</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
              AI가 분석한 나만의 약점을 집중 공략하는
              <span className="font-semibold text-gray-900"> 맞춤형 국어 학습</span>
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              초등학생부터 고등학생까지, 학년별 맞춤 학습으로
              국어 실력을 체계적으로 향상시켜보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="primary" className="w-full sm:w-auto">
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              나국포만의 특별한 학습 방법
            </h2>
            <p className="text-xl text-gray-600">
              AI 기술로 더 효과적인 국어 학습을 경험하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card variant="elevated" className="transition-transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle>AI 맞춤 학습</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  학생의 학습 패턴과 약점을 AI가 분석하여
                  가장 필요한 문제를 자동으로 추천합니다
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card variant="elevated" className="transition-transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <CardTitle>학년별 맞춤 콘텐츠</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  초등학교부터 고등학교까지 학년별로
                  최적화된 문제와 학습 콘텐츠를 제공합니다
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card variant="elevated" className="transition-transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎮</span>
                </div>
                <CardTitle>게임처럼 재미있게</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  레벨 업, 포인트, 연속 학습 등
                  게임 요소로 학습 동기를 높입니다
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card variant="elevated" className="transition-transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <CardTitle>AI 챗봇 선생님</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  궁금한 점을 언제든 물어보세요
                  친절한 AI 선생님이 24시간 답변해드립니다
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card variant="elevated" className="transition-transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle>상세한 학습 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  학습 진도와 성취도를 한눈에 확인하고
                  부족한 부분을 집중적으로 보완할 수 있습니다
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card variant="elevated" className="transition-transform hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <CardTitle>학부모 모니터링</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  자녀의 학습 현황을 실시간으로 확인하고
                  학습 방향을 함께 설정할 수 있습니다
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              이렇게 학습해요
            </h2>
            <p className="text-xl text-gray-600">
              간단한 3단계로 효과적인 학습을 시작하세요
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                  1
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    레벨 테스트
                  </h3>
                  <p className="text-lg text-gray-600">
                    간단한 테스트로 현재 실력을 파악하고
                    학습 시작 레벨을 설정합니다
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                  2
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    맞춤 학습
                  </h3>
                  <p className="text-lg text-gray-600">
                    AI가 추천하는 문제를 풀고, 모르는 내용은
                    챗봇 선생님에게 바로 질문하세요
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                  3
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    성장 확인
                  </h3>
                  <p className="text-lg text-gray-600">
                    학습 데이터를 분석하여 실력 향상을 확인하고
                    다음 단계로 레벨 업 하세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <Container>
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl mb-8 opacity-90">
              국어 때문에 고민하는 시간을 줄이고
              <span className="font-semibold"> 즐겁게 실력을 키워보세요</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100"
                >
                  무료 회원가입
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600"
                >
                  로그인하기
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-sm opacity-75">
              회원가입 시 무료 체험 기간이 제공됩니다
            </p>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <Container>
          <div className="text-center">
            <p className="text-lg font-semibold text-white mb-2">나국포</p>
            <p className="text-sm">
              © 2025 나국포. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </main>
  )
}

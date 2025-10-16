'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error: authError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await login({ email, password })
      router.push('/dashboard')
    } catch (err) {
      // authStore에서 에러 처리
      console.error('Login failed:', err)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-primary-600 mb-2">나국포</h1>
            </Link>
            <p className="text-gray-600">계정에 로그인하세요</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>로그인</CardTitle>
              <CardDescription>
                이메일과 비밀번호를 입력하세요
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="이메일"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@email.com"
                  autoComplete="email"
                />

                <Input
                  label="비밀번호"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">로그인 상태 유지</span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    비밀번호 찾기
                  </Link>
                </div>

                {authError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{authError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  로그인
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">또는</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    계정이 없으신가요?{' '}
                    <Link href="/register" className="text-primary-600 font-semibold hover:underline">
                      회원가입
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              로그인하면 나국포의{' '}
              <Link href="/terms" className="underline hover:text-gray-700">
                이용약관
              </Link>
              과{' '}
              <Link href="/privacy" className="underline hover:text-gray-700">
                개인정보처리방침
              </Link>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </Container>
    </main>
  )
}

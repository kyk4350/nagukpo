'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card'
import { useAuthStore } from '@/stores/authStore'
import type { RegisterData } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser, isLoading, error: authError } = useAuthStore()

  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    birthYear: new Date().getFullYear() - 10,
    parentEmail: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterData | 'confirmPassword', string>>>({})
  const [confirmPassword, setConfirmPassword] = useState('')

  // 실시간 유효성 검사
  const validateField = (name: keyof RegisterData | 'confirmPassword', value: string | number) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'username':
        if (typeof value === 'string') {
          if (value.length < 2) {
            newErrors.username = '사용자명은 2자 이상이어야 합니다'
          } else if (value.length > 20) {
            newErrors.username = '사용자명은 20자 이하여야 합니다'
          } else if (!/^[a-zA-Z0-9가-힣_]+$/.test(value)) {
            newErrors.username = '사용자명은 영문, 한글, 숫자, 언더스코어만 사용 가능합니다'
          } else {
            delete newErrors.username
          }
        }
        break

      case 'email':
        if (typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다'
          } else {
            delete newErrors.email
          }
        }
        break

      case 'password':
        if (typeof value === 'string') {
          if (value.length < 8) {
            newErrors.password = '비밀번호는 8자 이상이어야 합니다'
          } else if (value.length > 50) {
            newErrors.password = '비밀번호는 50자 이하여야 합니다'
          } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            newErrors.password = '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다'
          } else {
            delete newErrors.password
          }

          // 비밀번호 확인도 함께 검사
          if (confirmPassword && value !== confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
          } else {
            delete newErrors.confirmPassword
          }
        }
        break

      case 'confirmPassword':
        if (typeof value === 'string') {
          if (value !== formData.password) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
          } else {
            delete newErrors.confirmPassword
          }
        }
        break

      case 'birthYear':
        if (typeof value === 'number') {
          const currentYear = new Date().getFullYear()
          const age = currentYear - value
          if (value < 1900 || value > currentYear) {
            newErrors.birthYear = '올바른 출생연도를 입력하세요'
          } else if (age < 6) {
            newErrors.birthYear = '6세 이상부터 가입 가능합니다'
          } else if (age > 100) {
            newErrors.birthYear = '올바른 출생연도를 입력하세요'
          } else {
            delete newErrors.birthYear
          }

          // 14세 미만이면 학부모 이메일 필수
          if (age < 14 && !formData.parentEmail) {
            newErrors.parentEmail = '14세 미만은 학부모 이메일이 필요합니다'
          } else if (age >= 14) {
            delete newErrors.parentEmail
          }
        }
        break

      case 'parentEmail':
        if (typeof value === 'string') {
          const currentYear = new Date().getFullYear()
          const age = currentYear - formData.birthYear

          if (age < 14 && !value) {
            newErrors.parentEmail = '14세 미만은 학부모 이메일이 필요합니다'
          } else if (value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
              newErrors.parentEmail = '올바른 이메일 형식이 아닙니다'
            } else {
              delete newErrors.parentEmail
            }
          } else {
            delete newErrors.parentEmail
          }
        }
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const fieldName = name as keyof RegisterData

    if (fieldName === 'birthYear') {
      const yearValue = parseInt(value) || 0
      setFormData(prev => ({ ...prev, [name]: yearValue }))
      validateField(fieldName, yearValue)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      validateField(fieldName, value)
    }
  }

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    validateField('confirmPassword', value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // 모든 필드 유효성 검사
    Object.keys(formData).forEach(key => {
      validateField(key as keyof RegisterData, formData[key as keyof RegisterData])
    })
    validateField('confirmPassword', confirmPassword)

    // 에러가 있으면 제출 중단
    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      await registerUser(formData)
      router.push('/dashboard')
    } catch (err) {
      // authStore에서 에러 처리
      console.error('Registration failed:', err)
    }
  }

  const currentYear = new Date().getFullYear()
  const age = currentYear - formData.birthYear

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-primary-600 mb-2">나국포</h1>
            </Link>
            <p className="text-gray-600">새로운 계정 만들기</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>회원가입</CardTitle>
              <CardDescription>
                정보를 입력하여 나국포 회원가입을 완료하세요
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="사용자명"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  required
                  placeholder="홍길동"
                />

                <Input
                  label="이메일"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  placeholder="example@email.com"
                />

                <Input
                  label="비밀번호"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  helperText="대문자, 소문자, 숫자 포함 8자 이상"
                  required
                />

                <Input
                  label="비밀번호 확인"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={errors.confirmPassword}
                  required
                />

                <Input
                  label="출생연도"
                  name="birthYear"
                  type="number"
                  value={formData.birthYear}
                  onChange={handleChange}
                  error={errors.birthYear}
                  helperText={`현재 나이: ${age}세`}
                  required
                  min={1900}
                  max={currentYear}
                />

                {age < 14 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-2">
                      ⚠️ 14세 미만 학생은 학부모 이메일이 필요합니다
                    </p>
                    <Input
                      label="학부모 이메일"
                      name="parentEmail"
                      type="email"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      error={errors.parentEmail}
                      required
                      placeholder="parent@email.com"
                    />
                  </div>
                )}

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
                  disabled={Object.keys(errors).length > 0}
                >
                  회원가입
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  이미 계정이 있으신가요?{' '}
                  <Link href="/login" className="text-primary-600 font-semibold hover:underline">
                    로그인
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  )
}

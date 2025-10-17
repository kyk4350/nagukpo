'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useProblems } from '@/hooks/queries/useProblems'
import { useSubmitAnswer } from '@/hooks/queries/useSubmitAnswer'
import type { SubmitAnswerResponse } from '@/types/problem'

export default function LevelPage() {
  const params = useParams()
  const router = useRouter()
  const level = parseInt(params.level as string)

  // React Query 사용: 문제 목록 조회 (풀이 완료 문제 제외)
  const { data, isLoading, refetch } = useProblems({ level, limit: 20, excludeSolved: true })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<SubmitAnswerResponse | null>(null)
  const [startTime, setStartTime] = useState<number>(Date.now())

  const problems = data?.problems || []
  const totalProblems = (data?.total || 0) + (data?.solvedCount || 0)
  const solvedCount = data?.solvedCount || 0

  // 현재 문제 ID를 기반으로 뮤테이션 훅 생성
  const currentProblem = problems[currentIndex]
  const submitMutation = useSubmitAnswer(currentProblem?.id || '')

  useEffect(() => {
    // 문제가 바뀔 때마다 시작 시간 초기화
    setStartTime(Date.now())
  }, [currentIndex])

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      alert('답을 선택해주세요')
      return
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    submitMutation.mutate(
      { answer: selectedAnswer, timeSpent },
      {
        onSuccess: (response) => {
          setResult(response)
          setSubmitted(true)
          // 답안 제출 후 문제 목록 갱신
          refetch()
        },
        onError: (error) => {
          console.error('답안 제출 실패:', error)
          alert('답안 제출에 실패했습니다.')
        },
      }
    )
  }

  const handleNext = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer('')
      setSubmitted(false)
      setResult(null)
    } else {
      // 모든 문제 완료
      router.push('/preset')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">문제를 불러오는 중...</div>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">이 레벨의 문제를 모두 풀었습니다!</p>
          <Link href="/preset" className="text-blue-600 hover:underline">
            레벨 선택으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/preset" className="text-blue-600 hover:underline mb-4 inline-block">
            ← 레벨 선택으로
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Level {level}</h1>
            <span className="text-gray-600">
              {solvedCount + currentIndex + 1} / {totalProblems}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${totalProblems > 0 ? ((solvedCount + currentIndex + 1) / totalProblems) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Problem Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Difficulty Badge */}
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                currentProblem.difficulty === 'easy'
                  ? 'bg-green-100 text-green-800'
                  : currentProblem.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {currentProblem.difficulty === 'easy' ? '쉬움' : currentProblem.difficulty === 'medium' ? '보통' : '어려움'}
            </span>
          </div>

          {/* Passage */}
          {currentProblem.passage && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {currentProblem.passage}
              </p>
            </div>
          )}

          {/* Question */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentProblem.question}
            </h2>
          </div>

          {/* Options */}
          {currentProblem.options && (
            <div className="space-y-3 mb-6">
              {currentProblem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !submitted && setSelectedAnswer(option)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    submitted
                      ? option === currentProblem.answer
                        ? 'border-green-500 bg-green-50'
                        : option === selectedAnswer
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                      : selectedAnswer === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        submitted
                          ? option === currentProblem.answer
                            ? 'border-green-500 bg-green-500'
                            : option === selectedAnswer
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                          : selectedAnswer === option
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {((submitted && option === currentProblem.answer) || selectedAnswer === option) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Result */}
          {submitted && result && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className={`font-bold mb-2 ${result.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {result.isCorrect ? '✓ 정답입니다!' : '✗ 틀렸습니다'}
              </p>
              {!result.isCorrect && (
                <p className="text-gray-700 mb-2">
                  정답: <span className="font-semibold">{result.correctAnswer}</span>
                </p>
              )}
              <p className="text-gray-700 whitespace-pre-wrap">{result.explanation}</p>
              {result.pointsEarned > 0 && (
                <p className="mt-2 text-blue-600 font-semibold">+{result.pointsEarned} 포인트 획득!</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
              >
                제출하기
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                {currentIndex < problems.length - 1 ? '다음 문제' : '완료'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

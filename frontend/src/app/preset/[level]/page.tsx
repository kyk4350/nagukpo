'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useProblems } from '@/hooks/queries/useProblems'
import { useSubmitAnswer } from '@/hooks/queries/useSubmitAnswer'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/lib/queryKeys'
import StudySummaryModal from '@/components/StudySummaryModal'
import HintPanel from '@/components/HintPanel'
import { getHint } from '@/lib/api/hint'
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
  const [showSummaryModal, setShowSummaryModal] = useState(false)

  // 힌트 패널 상태
  const [showHintPanel, setShowHintPanel] = useState(false)
  const [hints, setHints] = useState<{
    level1: string | null
    level2: string | null
    level3: string | null
  }>({ level1: null, level2: null, level3: null })
  const [hintLoading, setHintLoading] = useState(false)

  // 세션 통계 추적
  const [sessionStats, setSessionStats] = useState<Array<{
    isCorrect: boolean
    type: string
    difficulty: string
    level: number
    timeSpent: number
    points: number
  }>>([])

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

          // 세션 통계에 추가
          const pointsMap: Record<string, number> = {
            easy: 10,
            medium: 20,
            hard: 30,
          }
          const points = response.isCorrect ? (pointsMap[currentProblem.difficulty] || 10) : 0

          setSessionStats((prev) => [
            ...prev,
            {
              isCorrect: response.isCorrect,
              type: currentProblem.type,
              difficulty: currentProblem.difficulty,
              level: currentProblem.level,
              timeSpent,
              points,
            },
          ])
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
      // 다음 문제로 이동
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer('')
      setSubmitted(false)
      setResult(null)
      // 힌트 초기화
      setHints({ level1: null, level2: null, level3: null })
      setShowHintPanel(false)

      // 진도와 통계만 업데이트 (문제 목록은 그대로 유지)
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current })
    } else {
      // 모든 문제 완료 - 프리셋 페이지로 돌아가기 전 모든 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.problems.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current })
      router.push('/preset')
    }
  }

  // 세션 통계를 요약 데이터로 변환
  const getSessionSummary = () => {
    if (sessionStats.length === 0) {
      return null
    }

    const totalProblems = sessionStats.length
    const correctProblems = sessionStats.filter((s) => s.isCorrect).length
    const accuracy = totalProblems > 0 ? Math.round((correctProblems / totalProblems) * 100) : 0
    const pointsEarned = sessionStats.reduce((sum, s) => sum + s.points, 0)
    const totalTimeSpent = sessionStats.reduce((sum, s) => sum + s.timeSpent, 0)
    const avgTimePerProblem = totalProblems > 0 ? Math.round(totalTimeSpent / totalProblems) : 0

    // 유형별 통계
    const typeStats = sessionStats.reduce((acc, s) => {
      if (!acc[s.type]) {
        acc[s.type] = { total: 0, correct: 0 }
      }
      acc[s.type].total++
      if (s.isCorrect) acc[s.type].correct++
      return acc
    }, {} as Record<string, { total: number; correct: number }>)

    // 난이도별 통계
    const difficultyStats = sessionStats.reduce((acc, s) => {
      if (!acc[s.difficulty]) {
        acc[s.difficulty] = { total: 0, correct: 0 }
      }
      acc[s.difficulty].total++
      if (s.isCorrect) acc[s.difficulty].correct++
      return acc
    }, {} as Record<string, { total: number; correct: number }>)

    return {
      totalProblems,
      correctProblems,
      accuracy,
      pointsEarned,
      totalTimeSpent,
      avgTimePerProblem,
      typeStats,
      difficultyStats,
    }
  }

  const handleFinishStudy = () => {
    // 세션 통계가 없으면 경고
    if (sessionStats.length === 0) {
      alert('아직 풀이한 문제가 없습니다.')
      return
    }
    // 모달 열기
    setShowSummaryModal(true)
  }

  const handleCloseSummary = () => {
    setShowSummaryModal(false)
    // 모든 쿼리 갱신 (대시보드 데이터 업데이트)
    queryClient.invalidateQueries({ queryKey: queryKeys.progress.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.stats.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.users.current })
  }

  const handleRequestHint = async (level: 1 | 2 | 3) => {
    if (!currentProblem) return

    setHintLoading(true)
    try {
      const result = await getHint(currentProblem.id, level)
      setHints((prev) => ({
        ...prev,
        [`level${level}`]: result.hint,
      }))
    } catch (error) {
      console.error('힌트 생성 실패:', error)
      alert('힌트를 생성하는데 실패했습니다.')
    } finally {
      setHintLoading(false)
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
          <div className="flex justify-between items-center mb-4">
            <Link href="/preset" className="text-blue-600 hover:underline inline-block">
              ← 레벨 선택으로
            </Link>
            <button
              onClick={handleFinishStudy}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
            >
              📊 학습 종료
            </button>
          </div>
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
          {/* Difficulty Badge and Hint Button */}
          <div className="mb-4 flex justify-between items-center">
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
            <button
              onClick={() => setShowHintPanel(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md font-medium"
            >
              💡 힌트
            </button>
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
              <>
                {!result?.isCorrect && (
                  <button
                    onClick={() => {
                      window.open(`/chat?problemId=${currentProblem.id}`, '_blank')
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                  >
                    설명 듣기 💬
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  {currentIndex < problems.length - 1 ? '다음 문제' : '완료'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Study Summary Modal */}
        <StudySummaryModal
          isOpen={showSummaryModal}
          onClose={handleCloseSummary}
          data={getSessionSummary()}
        />

        {/* Hint Panel */}
        <HintPanel
          isOpen={showHintPanel}
          onClose={() => setShowHintPanel(false)}
          onRequestHint={handleRequestHint}
          hints={hints}
          loading={hintLoading}
        />
      </div>
    </div>
  )
}

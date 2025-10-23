'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Button from './Button'
import { Card } from './Card'

interface StudySummaryData {
  totalProblems: number
  correctProblems: number
  accuracy: number
  pointsEarned: number
  totalTimeSpent: number
  avgTimePerProblem: number
  typeStats: Record<string, { total: number; correct: number }>
  difficultyStats: Record<string, { total: number; correct: number }>
}

interface StudySummaryModalProps {
  isOpen: boolean
  onClose: () => void
  data: StudySummaryData | null
}

const getTypeLabel = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    reading: '독해',
    vocabulary: '어휘',
    grammar: '문법',
    writing: '작문',
  }
  return typeMap[type] || type
}

const getDifficultyLabel = (difficulty: string): string => {
  const difficultyMap: { [key: string]: string } = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  }
  return difficultyMap[difficulty] || difficulty
}

export default function StudySummaryModal({
  isOpen,
  onClose,
  data,
}: StudySummaryModalProps) {
  const router = useRouter()

  const handleGoToDashboard = () => {
    onClose()
    router.push('/dashboard')
  }

  if (!data) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 overflow-y-auto"
            onClick={onClose}
          >
            <div className="min-h-screen px-4 flex items-center justify-center py-8">
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="p-6 md:p-8 bg-white shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-block mb-4"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-5xl">📊</span>
                    </div>
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    학습 완료!
                  </h2>
                  <p className="text-gray-600">이번 세션 학습 결과입니다</p>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center"
                  >
                    <p className="text-sm text-gray-600 mb-1">푼 문제</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {data.totalProblems}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">문제</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center"
                  >
                    <p className="text-sm text-gray-600 mb-1">정답</p>
                    <p className="text-3xl font-bold text-green-600">
                      {data.correctProblems}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">문제</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center"
                  >
                    <p className="text-sm text-gray-600 mb-1">정답률</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {data.accuracy}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">평균</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl text-center"
                  >
                    <p className="text-sm text-gray-600 mb-1">획득 포인트</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {data.pointsEarned}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">점</p>
                  </motion.div>
                </div>

                {/* Detailed Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-6 mb-8"
                >
                  {/* Type Stats */}
                  {Object.keys(data.typeStats).length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        📚 유형별 통계
                      </p>
                      <div className="space-y-2">
                        {Object.entries(data.typeStats).map(([type, stats]) => (
                          <div key={type} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{getTypeLabel(type)}</span>
                            <span className="text-gray-900 font-medium">
                              {stats.correct}/{stats.total} (
                              {stats.total > 0
                                ? Math.round((stats.correct / stats.total) * 100)
                                : 0}
                              %)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Difficulty Stats */}
                  {Object.keys(data.difficultyStats).length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        ⭐ 난이도별 통계
                      </p>
                      <div className="space-y-2">
                        {Object.entries(data.difficultyStats).map(
                          ([difficulty, stats]) => (
                            <div
                              key={difficulty}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-gray-600">
                                {getDifficultyLabel(difficulty)}
                              </span>
                              <span className="text-gray-900 font-medium">
                                {stats.correct}/{stats.total} (
                                {stats.total > 0
                                  ? Math.round((stats.correct / stats.total) * 100)
                                  : 0}
                                %)
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Time Stats */}
                  {data.totalTimeSpent > 0 && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        ⏱️ 소요 시간
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">총 소요 시간</span>
                          <span className="text-gray-900 font-medium">
                            {Math.floor(data.totalTimeSpent / 60)}분{' '}
                            {data.totalTimeSpent % 60}초
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">문제당 평균</span>
                          <span className="text-gray-900 font-medium">
                            {data.avgTimePerProblem}초
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    onClick={handleGoToDashboard}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    size="lg"
                  >
                    대시보드로 이동
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    계속 학습하기
                  </Button>
                </motion.div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

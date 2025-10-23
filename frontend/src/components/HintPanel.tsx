'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'

interface HintPanelProps {
  isOpen: boolean
  onClose: () => void
  onRequestHint: (level: 1 | 2 | 3) => Promise<void>
  hints: {
    level1: string | null
    level2: string | null
    level3: string | null
  }
  loading: boolean
}

export default function HintPanel({
  isOpen,
  onClose,
  onRequestHint,
  hints,
  loading,
}: HintPanelProps) {
  const [unlockedLevel, setUnlockedLevel] = useState<0 | 1 | 2 | 3>(0)

  const handleRequestHint = async (level: 1 | 2 | 3) => {
    await onRequestHint(level)
    setUnlockedLevel(level)
  }

  const getHintButtonText = (level: 1 | 2 | 3) => {
    if (hints[`level${level}` as keyof typeof hints]) {
      return `힌트 ${level} 보기`
    }
    return `힌트 ${level} 받기`
  }

  const getHintDescription = (level: 1 | 2 | 3) => {
    const descriptions = {
      1: '간단한 방향 제시',
      2: '구체적인 힌트',
      3: '자세한 설명',
    }
    return descriptions[level]
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Hint Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <h3 className="text-lg font-bold">힌트</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="text-blue-900 font-medium mb-2">📌 힌트 사용 가이드</p>
                <ul className="text-blue-700 space-y-1 text-xs">
                  <li>• 총 3단계 힌트를 사용할 수 있습니다</li>
                  <li>• 순서대로 잠금 해제됩니다</li>
                  <li>• 스스로 생각한 후 힌트를 활용하세요</li>
                </ul>
              </div>

              {/* Hint Level 1 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">힌트 1단계</h4>
                    <p className="text-sm text-gray-600">{getHintDescription(1)}</p>
                  </div>
                  <span className="text-2xl">🌱</span>
                </div>

                {!hints.level1 ? (
                  <Button
                    onClick={() => handleRequestHint(1)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    size="sm"
                  >
                    {loading ? '생성 중...' : getHintButtonText(1)}
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                  >
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {hints.level1}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Hint Level 2 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">힌트 2단계</h4>
                    <p className="text-sm text-gray-600">{getHintDescription(2)}</p>
                  </div>
                  <span className="text-2xl">🌿</span>
                </div>

                {!hints.level1 ? (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">
                      🔒 힌트 1을 먼저 확인하세요
                    </p>
                  </div>
                ) : !hints.level2 ? (
                  <Button
                    onClick={() => handleRequestHint(2)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    size="sm"
                  >
                    {loading ? '생성 중...' : getHintButtonText(2)}
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {hints.level2}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Hint Level 3 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">힌트 3단계</h4>
                    <p className="text-sm text-gray-600">{getHintDescription(3)}</p>
                  </div>
                  <span className="text-2xl">🌳</span>
                </div>

                {!hints.level2 ? (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">
                      🔒 힌트 2를 먼저 확인하세요
                    </p>
                  </div>
                ) : !hints.level3 ? (
                  <Button
                    onClick={() => handleRequestHint(3)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    size="sm"
                  >
                    {loading ? '생성 중...' : getHintButtonText(3)}
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                  >
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {hints.level3}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer Note */}
              {unlockedLevel === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 text-center"
                >
                  <p className="text-sm text-gray-700">
                    🎉 모든 힌트를 확인했습니다!
                    <br />
                    <span className="text-xs text-gray-600">
                      이제 문제를 풀어보세요
                    </span>
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

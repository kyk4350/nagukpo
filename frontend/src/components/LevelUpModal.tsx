'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'
import { Card } from './Card'

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  level: number
  points: number
  experiencePoints: number
}

export default function LevelUpModal({
  isOpen,
  onClose,
  level,
  points,
  experiencePoints,
}: LevelUpModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // 3초 후 confetti 종료
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-8 max-w-md mx-auto bg-white shadow-2xl border-0">
                {/* Confetti Animation */}
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          x: '50%',
                          y: '50%',
                          scale: 0,
                        }}
                        animate={{
                          x: `${50 + (Math.random() - 0.5) * 200}%`,
                          y: `${50 + (Math.random() - 0.5) * 200}%`,
                          scale: [0, 1, 1, 0],
                          rotate: Math.random() * 360,
                        }}
                        transition={{
                          duration: 2,
                          ease: 'easeOut',
                        }}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: [
                            '#FFD700',
                            '#FF6B6B',
                            '#4ECDC4',
                            '#45B7D1',
                            '#FFA07A',
                            '#98D8C8',
                          ][i % 6],
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="text-center space-y-6">
                  {/* Trophy Icon with Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 10,
                      delay: 0.2,
                    }}
                    className="flex justify-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-5xl">🏆</span>
                    </div>
                  </motion.div>

                  {/* Level Up Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      레벨 업!
                    </h2>
                    <p className="text-gray-600">
                      축하합니다! 새로운 레벨에 도달했습니다
                    </p>
                  </motion.div>

                  {/* Level Display */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="py-6"
                  >
                    <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg">
                      <p className="text-sm font-medium mb-1">새로운 레벨</p>
                      <p className="text-5xl font-bold">{level}</p>
                    </div>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-2 gap-4 pt-4"
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">총 포인트</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {points.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">경험치</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {experiencePoints.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>

                  {/* Close Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <Button
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      size="lg"
                    >
                      계속하기
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

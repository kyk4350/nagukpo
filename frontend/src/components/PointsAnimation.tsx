'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PointsAnimationProps {
  points: number
  show: boolean
  onComplete?: () => void
}

export default function PointsAnimation({
  points,
  show,
  onComplete,
}: PointsAnimationProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: -50, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.5 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.4,
              repeat: 2,
              repeatType: 'reverse',
            }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3"
          >
            <motion.span
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="text-3xl"
            >
              ⭐
            </motion.span>
            <div className="text-center">
              <p className="text-2xl font-bold">+{points}</p>
              <p className="text-sm font-medium">포인트 획득!</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

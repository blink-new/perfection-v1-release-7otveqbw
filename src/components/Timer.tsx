import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Timer as TimerIcon } from 'lucide-react'
import { GameState } from '../types/game'

interface TimerProps {
  timeLeft: number
  gameState: GameState
}

const Timer: React.FC<TimerProps> = ({ timeLeft, gameState }) => {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isWarning = timeLeft <= 10 && gameState === 'playing'
  const isCritical = timeLeft <= 5 && gameState === 'playing'

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, '0')
  }

  const getProgressPercentage = (): number => {
    return ((60 - timeLeft) / 60) * 100
  }

  return (
    <div className="flex items-center gap-4">
      {/* Timer Display */}
      <motion.div
        className={`
          flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300
          ${isCritical 
            ? 'bg-red-500/20 border-red-400 text-red-200' 
            : isWarning 
              ? 'bg-yellow-500/20 border-yellow-400 text-yellow-200'
              : 'bg-blue-500/20 border-blue-400 text-blue-200'
          }
        `}
        animate={isCritical ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={isCritical ? {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        <motion.div
          animate={isWarning ? {
            rotate: [0, -10, 10, -10, 0]
          } : {}}
          transition={isWarning ? {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 0.5
          } : {}}
        >
          {isCritical ? (
            <TimerIcon className="w-6 h-6" />
          ) : (
            <Clock className="w-6 h-6" />
          )}
        </motion.div>
        
        <div className="font-mono text-2xl font-bold">
          {formatTime(minutes)}:{formatTime(seconds)}
        </div>
      </motion.div>

      {/* Progress Bar */}
      {gameState === 'playing' && (
        <motion.div
          className="flex-1 max-w-xs"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-white/60 text-sm mb-1">Time Progress</div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors duration-300 ${
                isCritical 
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : isWarning
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-green-400 to-blue-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Status Indicator */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className={`
          w-3 h-3 rounded-full transition-all duration-300
          ${gameState === 'waiting' ? 'bg-gray-400' : ''}
          ${gameState === 'playing' ? 'bg-green-400 animate-pulse' : ''}
          ${gameState === 'gameOver' ? 'bg-red-400' : ''}
        `} />
        <span className="text-white/70 text-sm capitalize font-medium">
          {gameState === 'waiting' && 'Ready'}
          {gameState === 'playing' && 'Playing'}
          {gameState === 'gameOver' && 'Finished'}
        </span>
      </motion.div>
    </div>
  )
}

export default Timer
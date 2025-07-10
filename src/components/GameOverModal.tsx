import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Play, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { GameResult } from '../types/game'

interface GameOverModalProps {
  result: GameResult
  onPlayAgain: () => void
  onReset: () => void
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  result,
  onPlayAgain,
  onReset
}) => {
  const isWin = result.won

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 p-8 text-center">
          {/* Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {isWin ? (
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"
              >
                <Trophy className="w-10 h-10 text-yellow-100" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ 
                  scale: [1, 0.9, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center"
              >
                <Clock className="w-10 h-10 text-red-100" />
              </motion.div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h2
            className={`text-3xl font-bold mb-4 ${
              isWin ? 'text-yellow-300' : 'text-red-300'
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isWin ? 'Perfect!' : 'Time\'s Up!'}
          </motion.h2>

          {/* Message */}
          <motion.p
            className="text-white/80 text-lg mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {result.message}
          </motion.p>

          {/* Stats */}
          {isWin && (
            <motion.div
              className="bg-white/10 rounded-2xl p-4 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">
                  Completed in {result.timeElapsed} seconds
                </span>
              </div>
              
              {result.timeElapsed <= 30 && (
                <motion.div
                  className="mt-2 text-yellow-300 text-sm font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  🌟 Lightning Fast!
                </motion.div>
              )}
              
              {result.timeElapsed <= 45 && result.timeElapsed > 30 && (
                <motion.div
                  className="mt-2 text-green-300 text-sm font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  ⚡ Great Speed!
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Failure Animation */}
          {!isWin && (
            <motion.div
              className="bg-red-500/20 rounded-2xl p-4 mb-6 border border-red-400/30"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                animate={{ 
                  x: [-2, 2, -2, 2, 0],
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: 2,
                  ease: "easeInOut"
                }}
                className="text-red-200 font-medium"
              >
                💥 The shapes exploded out of the board!
              </motion.div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex gap-3 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={onPlayAgain}
              className={`
                px-6 py-3 font-semibold transition-all duration-200
                ${isWin 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              <Play className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            
            <Button
              onClick={onReset}
              variant="outline"
              className="px-6 py-3 border-white/30 text-white hover:bg-white/10 font-semibold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </motion.div>

          {/* Encouraging message */}
          {!isWin && (
            <motion.p
              className="text-white/60 text-sm mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Don't give up! Try again and beat the clock! 🚀
            </motion.p>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default GameOverModal
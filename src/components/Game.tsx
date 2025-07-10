import React, { useState, useEffect, useRef } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import GameBoard from './GameBoard'
import ShapeTray from './ShapeTray'
import Timer from './Timer'
import GameOverModal from './GameOverModal'
import { GameState, Shape, GameResult } from '../types/game'
import { createShapes, checkWinCondition } from '../utils/gameLogic'
import { toast } from '@/hooks/use-toast'

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('waiting')
  const [timeLeft, setTimeLeft] = useState(60)
  const [shapes, setShapes] = useState<Shape[]>(createShapes())
  const [draggedShape, setDraggedShape] = useState<Shape | null>(null)
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = () => {
    setGameState('playing')
    setTimeLeft(60)
    setShapes(createShapes())
    setGameResult(null)
    setStartTime(Date.now())
    
    // Play start sound effect
    playSound('start')
    toast({
      title: "Game Started!",
      description: "Place all shapes before time runs out!",
    })
  }

  const resetGame = () => {
    setGameState('waiting')
    setTimeLeft(60)
    setShapes(createShapes())
    setGameResult(null)
    setStartTime(null)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const playSound = (type: 'start' | 'place' | 'win' | 'lose' | 'tick') => {
    // Create audio context for sound effects
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      switch (type) {
        case 'start':
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1)
          break
        case 'place':
          oscillator.frequency.setValueAtTime(660, audioContext.currentTime)
          break
        case 'win':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2)
          break
        case 'lose':
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.2)
          break
        case 'tick':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          break
      }
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch {
      // Silently fail if audio context is not available
    }
  }

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('gameOver')
            setGameResult({
              won: false,
              timeElapsed: 60,
              message: "Time's up! The shapes exploded out of the board!"
            })
            playSound('lose')
            return 0
          }
          
          // Play tick sound in last 10 seconds
          if (prev <= 10) {
            playSound('tick')
          }
          
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [gameState, timeLeft])

  // Check win condition when shapes change
  useEffect(() => {
    if (gameState === 'playing' && checkWinCondition(shapes)) {
      const timeElapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 60
      setGameState('gameOver')
      setGameResult({
        won: true,
        timeElapsed,
        message: `Perfect! You completed the puzzle in ${timeElapsed} seconds!`
      })
      playSound('win')
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [shapes, gameState, startTime])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const shape = shapes.find(s => s.id === active.id)
    if (shape) {
      setDraggedShape(shape)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggedShape(null)

    if (!over) return

    const draggedShapeId = active.id as string
    const targetSlotId = over.id as string

    // Only allow dropping on board slots
    if (!targetSlotId.startsWith('slot-')) return

    const shape = shapes.find(s => s.id === draggedShapeId)
    if (!shape) return

    // Check if this is the correct slot for this shape
    const expectedSlotId = `slot-${shape.correctPosition}`
    
    if (targetSlotId === expectedSlotId) {
      // Correct placement
      setShapes(prevShapes => 
        prevShapes.map(s => 
          s.id === draggedShapeId 
            ? { ...s, currentPosition: shape.correctPosition, isPlaced: true }
            : s
        )
      )
      playSound('place')
      toast({
        title: "Perfect!",
        description: "Shape placed correctly!",
      })
    } else {
      // Wrong placement - shape bounces back
      toast({
        title: "Wrong slot!",
        description: "That shape doesn't fit there.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Game Controls */}
        <Card className="mb-8 p-6 bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Timer timeLeft={timeLeft} gameState={gameState} />
            
            <div className="flex gap-4">
              {gameState === 'waiting' && (
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  Start Game
                </Button>
              )}
              
              {(gameState === 'playing' || gameState === 'gameOver') && (
                <Button 
                  onClick={resetGame}
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Game Area */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Shape Tray */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Shape Tray
              </h3>
              <ShapeTray shapes={shapes} gameState={gameState} />
            </Card>
          </motion.div>

          {/* Game Board */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Game Board
              </h3>
              <GameBoard shapes={shapes} gameState={gameState} />
            </Card>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">
                How to Play
              </h3>
              <div className="text-blue-100 space-y-3 text-sm">
                <p>🎯 <strong>Goal:</strong> Place all shapes in their correct slots before time runs out!</p>
                <p>🖱️ <strong>Controls:</strong> Drag shapes from the tray to the board.</p>
                <p>⏰ <strong>Time Limit:</strong> You have 60 seconds to complete the puzzle.</p>
                <p>🔊 <strong>Audio:</strong> Listen for placement sounds and timer alerts.</p>
                <p>🏆 <strong>Win:</strong> Place all shapes correctly to win!</p>
              </div>
              
              {gameState === 'waiting' && (
                <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                  <p className="text-yellow-200 text-sm font-medium">
                    💡 Tip: Each shape has only one correct position. Try different slots if a shape doesn't fit!
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {draggedShape && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              className="pointer-events-none"
            >
              <div
                className={`w-12 h-12 rounded-lg shadow-2xl ${draggedShape.color} transform rotate-3`}
                style={{
                  clipPath: draggedShape.clipPath
                }}
              />
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameState === 'gameOver' && gameResult && (
          <GameOverModal
            result={gameResult}
            onPlayAgain={startGame}
            onReset={resetGame}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Game
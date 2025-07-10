import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Shape, GameState } from '../types/game'

interface GameBoardProps {
  shapes: Shape[]
  gameState: GameState
}

interface BoardSlotProps {
  slotId: string
  shape: Shape | null
  isActive: boolean
  gameState: GameState
}

const BoardSlot: React.FC<BoardSlotProps> = ({ slotId, shape, isActive, gameState }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: slotId,
  })

  const isEmpty = !shape || !shape.isPlaced
  const isHighlighted = isOver && gameState === 'playing'

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.3,
        delay: parseInt(slotId.split('-')[1]) * 0.05
      }}
      className={`
        w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center
        transition-all duration-200 relative overflow-hidden
        ${isEmpty 
          ? `border-white/30 bg-white/5 ${isHighlighted ? 'border-white/60 bg-white/20 shadow-lg' : ''}` 
          : 'border-white/50 bg-white/10'
        }
        ${isActive ? 'cursor-pointer hover:border-white/50' : ''}
      `}
    >
      {/* Slot number */}
      <div className="absolute top-1 left-1 text-xs text-white/40 font-mono">
        {parseInt(slotId.split('-')[1]) + 1}
      </div>

      {/* Shape */}
      {shape && shape.isPlaced && (
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={`w-12 h-12 ${shape.color} rounded-lg shadow-md`}
          style={{
            clipPath: shape.clipPath
          }}
        />
      )}

      {/* Glow effect when highlighted */}
      {isHighlighted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/10 rounded-xl"
        />
      )}
    </motion.div>
  )
}

const GameBoard: React.FC<GameBoardProps> = ({ shapes, gameState }) => {
  const totalSlots = 12

  const getShapeForSlot = (slotIndex: number): Shape | null => {
    return shapes.find(shape => shape.correctPosition === slotIndex && shape.isPlaced) || null
  }

  return (
    <div className="flex flex-col items-center">
      {/* Game Board Grid */}
      <motion.div
        className="grid grid-cols-4 gap-3 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/20"
        initial={{ rotateX: -20, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {Array.from({ length: totalSlots }, (_, index) => {
          const slotId = `slot-${index}`
          const shape = getShapeForSlot(index)
          
          return (
            <BoardSlot
              key={slotId}
              slotId={slotId}
              shape={shape}
              isActive={gameState === 'playing'}
              gameState={gameState}
            />
          )
        })}
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        className="mt-4 w-full max-w-xs"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between text-white/70 text-sm mb-2">
          <span>Progress</span>
          <span>{shapes.filter(s => s.isPlaced).length}/{shapes.length}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(shapes.filter(s => s.isPlaced).length / shapes.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default GameBoard
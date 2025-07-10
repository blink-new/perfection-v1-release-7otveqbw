import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Shape, GameState } from '../types/game'
import { getAvailableShapes } from '../utils/gameLogic'

interface ShapeTrayProps {
  shapes: Shape[]
  gameState: GameState
}

interface DraggableShapeProps {
  shape: Shape
  isActive: boolean
  index: number
}

const DraggableShape: React.FC<DraggableShapeProps> = ({ shape, isActive, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: shape.id,
    disabled: !isActive
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.4,
        delay: index * 0.1,
        type: "spring",
        stiffness: 200
      }}
      whileHover={isActive ? { scale: 1.05 } : {}}
      whileTap={isActive ? { scale: 0.95 } : {}}
      className={`
        w-12 h-12 rounded-lg shadow-lg transition-all duration-200
        ${shape.color}
        ${isActive ? 'cursor-grab hover:shadow-xl' : 'cursor-not-allowed opacity-50'}
        ${isDragging ? 'opacity-50 cursor-grabbing' : ''}
      `}
      style={{
        ...style,
        clipPath: shape.clipPath
      }}
    >
      {/* Shape type tooltip */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/60 capitalize whitespace-nowrap">
        {shape.type}
      </div>
    </motion.div>
  )
}

const ShapeTray: React.FC<ShapeTrayProps> = ({ shapes, gameState }) => {
  const availableShapes = getAvailableShapes(shapes)
  const isActive = gameState === 'playing'

  return (
    <div className="flex flex-col items-center">
      {/* Tray */}
      <motion.div
        className="min-h-[200px] w-full bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl border border-white/20 p-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {availableShapes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 place-items-center">
            {availableShapes.map((shape, index) => (
              <div key={shape.id} className="relative pb-6">
                <DraggableShape
                  shape={shape}
                  isActive={isActive}
                  index={index}
                />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center py-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <div className="text-xl font-semibold text-white mb-2">
              All shapes placed!
            </div>
            <div className="text-white/70">
              Great job! All pieces are on the board.
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="mt-4 text-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-white/60 text-sm">
          {gameState === 'waiting' && "Click 'Start Game' to begin!"}
          {gameState === 'playing' && availableShapes.length > 0 && "Drag shapes to their matching slots"}
          {gameState === 'playing' && availableShapes.length === 0 && "All shapes placed! Checking..."}
          {gameState === 'gameOver' && "Game finished!"}
        </div>
        
        {gameState === 'playing' && (
          <div className="text-white/40 text-xs mt-1">
            Shapes remaining: {availableShapes.length}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ShapeTray
import { Shape } from '../types/game'

export const createShapes = (): Shape[] => {
  const shapeConfigs = [
    {
      type: 'circle',
      color: 'bg-red-500',
      clipPath: 'circle(50%)'
    },
    {
      type: 'square',
      color: 'bg-blue-500',
      clipPath: 'none'
    },
    {
      type: 'triangle',
      color: 'bg-green-500',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
    },
    {
      type: 'hexagon',
      color: 'bg-purple-500',
      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
    },
    {
      type: 'star',
      color: 'bg-yellow-500',
      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    },
    {
      type: 'diamond',
      color: 'bg-pink-500',
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
    },
    {
      type: 'heart',
      color: 'bg-red-400',
      clipPath: 'polygon(50% 85%, 85% 50%, 85% 25%, 70% 15%, 50% 25%, 30% 15%, 15% 25%, 15% 50%)'
    },
    {
      type: 'pentagon',
      color: 'bg-indigo-500',
      clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
    },
    {
      type: 'octagon',
      color: 'bg-orange-500',
      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
    },
    {
      type: 'cross',
      color: 'bg-teal-500',
      clipPath: 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)'
    },
    {
      type: 'oval',
      color: 'bg-cyan-500',
      clipPath: 'ellipse(50% 30%)'
    },
    {
      type: 'trapezoid',
      color: 'bg-lime-500',
      clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
    }
  ]

  return shapeConfigs.map((config, index) => ({
    id: `shape-${index}`,
    type: config.type,
    color: config.color,
    clipPath: config.clipPath,
    correctPosition: index,
    currentPosition: null,
    isPlaced: false
  }))
}

export const checkWinCondition = (shapes: Shape[]): boolean => {
  return shapes.every(shape => shape.isPlaced)
}

export const getAvailableShapes = (shapes: Shape[]): Shape[] => {
  return shapes.filter(shape => !shape.isPlaced)
}

export const getPlacedShapes = (shapes: Shape[]): Shape[] => {
  return shapes.filter(shape => shape.isPlaced)
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
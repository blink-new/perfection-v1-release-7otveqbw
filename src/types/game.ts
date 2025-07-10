export type GameState = 'waiting' | 'playing' | 'gameOver'

export interface Shape {
  id: string
  type: string
  color: string
  clipPath: string
  correctPosition: number
  currentPosition: number | null
  isPlaced: boolean
}

export interface GameResult {
  won: boolean
  timeElapsed: number
  message: string
}

export interface Position {
  x: number
  y: number
}
import React from 'react'
import Game from './components/Game'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-wider">
            PERFECTION
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Race against time! Place all shapes in their correct slots before the timer runs out.
          </p>
          <div className="text-lg text-blue-300 mt-4">
            v1.0.0 Release
          </div>
          <div className="mt-6">
            <a
              href="/perfection-original/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl shadow-lg text-lg transition-all duration-200"
            >
              ▶️ Play the Original Perfection Game
            </a>
          </div>
        </header>
        
        <Game />
      </div>
    </div>
  )
}

export default App
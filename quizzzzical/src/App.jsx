import React, { useState } from "react"
import Questions from "./components/Questions"
import StartingPage from "./components/StartingPage"

export default function App() {

  const [gameStarted, setGameStared] = useState(false)

  const handleStartGame = () => {
    setGameStared(true)
  } 

    return (
      <div>
        {gameStarted ? (
          <Questions />
        ) : (
          <StartingPage startGame={handleStartGame}/>
        )}
        
      </div>
    )
}


import React, { useEffect, useState } from "react"

const StartingPage = ({ startGame }) => {
  const [isPageVisible, setIsPageVisible] = useState(false)

  useEffect(() => {
    // After the component is mounted, add the active class with a slight delay
    setTimeout(() => {
      setIsPageVisible(true)
    }, 100)
  }, [])

  return (
    <div className={`start-wrap ${isPageVisible ? 'active' : ''}`}>
      <h1 className="start-title">Quizzzzical</h1>
      <p className="start-description">Project by e-saakides</p>
      <button className="start-button" onClick={startGame}>
        Start Game
      </button>
    </div>
  )
}

export default StartingPage

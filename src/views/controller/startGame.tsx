import React, { Component } from "react"
import { PETER_RIVER, EMERALD } from "../../lib/styles/colors"

interface GameQueueProps {
  startGame: () => void
}

export default class GameQueue extends Component<GameQueueProps> {
  render() {
    const { startGame } = this.props

    return (
      <main className="wrap">
        <p>It's your turn to play! Press Start when you're ready.</p>
        <button onClick={startGame}>Start playing</button>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: fixed;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            background-color: ${PETER_RIVER};
            padding: 1rem;
            flex-wrap: wrap;
            text-align: center;
          }

          p {
            width: 100%;
          }

          button {
            border: 1px solid black;
            padding: 1rem;
            border-radius: 100px;
            background: ${EMERALD};
            box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.75);
          }
        `}</style>
      </main>
    )
  }
}

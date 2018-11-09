import React, { Component } from "react"
import { colors } from "../../styles/colors"

interface StartGameProps {
  onStartGame: () => void
}

export class StartGame extends Component<StartGameProps> {
  render() {
    const { onStartGame } = this.props

    return (
      <main className="wrap">
        <p>It's your turn to play! Press Start when you're ready.</p>
        <button onClick={onStartGame}>Start playing</button>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: fixed;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            background-color: ${colors.PETER_RIVER};
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
            background: ${colors.EMERALD};
            box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.75);
          }
        `}</style>
      </main>
    )
  }
}

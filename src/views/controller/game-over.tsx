import React, { Component } from "react"
import { colors } from "../../styles/colors"

interface GameOverProps {
  onRestart: () => void
}

export class GameOver extends Component<GameOverProps> {
  render() {
    const { onRestart } = this.props

    return (
      <main className="wrap">
        <p>Game Over!</p>
        <button onClick={onRestart}>Restart</button>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            background-color: ${colors.PETER_RIVER};
            flex-wrap: wrap;
            text-align: center;
            background-color: ${colors.BLACK};
            color: ${colors.WHITE};
          }

          button {
            border: 1px solid black;
            padding: 1rem;
            border-radius: 100px;
            background: ${colors.EMERALD};
            box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.75);
          }

          p {
            width: 100%;
          }
        `}</style>
      </main>
    )
  }
}

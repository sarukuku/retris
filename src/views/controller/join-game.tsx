import React, { Component } from "react"
import { colors } from "../../styles/colors"

interface JoinGameProps {
  onJoinGame: () => void
}

export class JoinGame extends Component<JoinGameProps> {
  render() {
    const { onJoinGame } = this.props

    return (
      <div className="wrap">
        <button onClick={onJoinGame}>Join the game</button>
        <style jsx>{`
          .wrap {
            width: 100%;
            height: 100%;
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${colors.PETER_RIVER};
          }

          button {
            border: 1px solid black;
            padding: 1rem;
            border-radius: 100px;
            background: ${colors.EMERALD};
            box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.75);
          }
        `}</style>
      </div>
    )
  }
}

import React, { Component } from "react"
import css from "styled-jsx/css"
import { JoinHelpBar } from "../../components/join-help-bar"

interface GameOverProps {
  score: number
}

export class GameOver extends Component<GameOverProps> {
  render() {
    const { score } = this.props

    const { className, styles } = css.resolve`
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    `

    return (
      <div className="wrap">
        <h1>💥 Game Over 💥</h1>
        <h1>You got {score} points 😬</h1>
        <JoinHelpBar className={className} />
        {styles}
        <style jsx>{`
          .wrap {
            flex-grow: 1;
            display: flex;
            justify-content: space-around;
            align-items: center;
          }

          h1 {
            text-align: center;
          }
        `}</style>
      </div>
    )
  }
}

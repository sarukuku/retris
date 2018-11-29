import React, { Component } from "react"
import { Button } from "../../components/button/button"
import { TranslateProps, withTranslate } from "../../components/with-translate"
import { colors } from "../../styles/colors"
import { formatScore } from "../display/game-over/format-score"

interface GameOverProps extends TranslateProps {
  onRestart: () => void
  score?: number
}

class _GameOver extends Component<GameOverProps> {
  render() {
    const { onRestart, translate, score = 600 } = this.props

    return (
      <main className="wrap">
        <h1>{translate("controller.game-over.heading")}</h1>
        <span className="score-label">
          {translate("controller.game-over.score-label")}
        </span>
        <span className="score">{formatScore(score)}</span>
        <p>{translate("controller.game-over.copy")}</p>
        <a href={translate("controller.game-over.link")} target="_blank">
          {translate("controller.game-over.link-title")}
        </a>
        <Button
          onClick={onRestart}
          label={translate("controller.game-over.button-label")}
        />
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
            flex-direction: column;
            text-align: center;
            background-color: ${colors.BLACK};
            color: ${colors.WHITE};
          }

          h1 {
            font-size: 1.6rem;
            font-weight: 500;
            margin-bottom: 2rem;
          }

          .score-label {
            text-transform: uppercase;
            font-size: 1rem;
            opacity: 0.5;
            margin-bottom: 2rem;
          }

          .score {
            font-size: 4rem;
            font-weight: 600;
            margin-bottom: 1.4rem;
          }

          p {
            width: 86%;
          }

          a {
            font-weight: 600;
            color: ${colors.WHITE};
            margin-bottom: 3rem;
            text-decoration: none;
          }
        `}</style>
      </main>
    )
  }
}

export const GameOver = withTranslate(_GameOver)

import React, { Component } from "react"
import { colors } from "../../styles/colors"
import { withTranslate, TranslateProps } from "../../components/with-translate"
import { Button } from "../../components/button/button"
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
        <a href={translate("controller.game-over.link")}>
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

export const GameOver = withTranslate(_GameOver)

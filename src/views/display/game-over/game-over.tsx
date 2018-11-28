import React, { Fragment, SFC } from "react"
import {
  TranslateProps,
  withTranslate,
} from "../../../components/with-translate"
import { colors } from "../../../styles/colors"
import { formatScore } from "./format-score"

interface GameOverProps extends TranslateProps {
  score: number
}

const _GameOver: SFC<GameOverProps> = ({ score, translate }) => (
  <Fragment>
    <div className="game-over">
      <h2 style={{ color: colors.WHITE }}>
        {translate("display.game-over.your-score")}
      </h2>
      <h1 style={{ color: colors.WHITE }}>{formatScore(score)}</h1>
      <h4 style={{ color: colors.WHITE }}>
        {translate("display.game-over.about-us")}
      </h4>
      <h4 style={{ color: colors.WHITE }}>
        {translate("display.game-over.website")}
      </h4>
    </div>
    <style jsx>{`
      .game-over {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    `}</style>
  </Fragment>
)

export const GameOver = withTranslate(_GameOver)

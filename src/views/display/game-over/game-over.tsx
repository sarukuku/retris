import React, { Fragment, SFC } from "react"
import { ReaktorLogo } from "../../../components/reaktor-logo/reaktor-logo"
import {
  TranslateProps,
  withTranslate,
} from "../../../components/with-translate"
import { formatScore } from "../../../helpers"
import { colors } from "../../../styles/colors"

interface GameOverProps extends TranslateProps {
  score: number
}

const _GameOver: SFC<GameOverProps> = ({ score, translate }) => (
  <Fragment>
    <div className="game-over">
      <h1>{translate("display.game-over.your-score")}</h1>
      <p className="score">{formatScore(score)}</p>
      <p>{translate("display.game-over.about-us")}</p>
      <p>{translate("display.game-over.website")}</p>
      <div className="logo">
        <ReaktorLogo />
      </div>
    </div>
    <style jsx>{`
      .game-over {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: ${colors.WHITE};
      }

      h1 {
        margin-bottom: 0;
        text-transform: uppercase;
        font-size: 5vmax;
      }

      p {
        font-size: 3.5vmax;
        margin-bottom: 0;
      }

      .logo {
        height: 2rem;
        position: absolute;
        bottom: 2rem;
      }

      .score {
        font-size: 12vmax;
        text-transform: uppercase;
        margin: 0 2rem 2rem 2rem;
        font-weight: 600;
      }
    `}</style>
  </Fragment>
)

export const GameOver = withTranslate(_GameOver)

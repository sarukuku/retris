import React, { Fragment, SFC } from "react"
import { Tetris } from "../../../components/tetris"
import {
  TranslateProps,
  withTranslate,
} from "../../../components/with-translate"
import { TetrisMatrix } from "../../../games/tetris/shape"
import { formatSeconds } from "../../../helpers"
import { colors } from "../../../styles/colors"
import { HUDItem } from "./hud-item"

interface DisplayGameProps extends TranslateProps {
  board: TetrisMatrix
  score: number
  elapsedSeconds: number
}

export const _DisplayGame: SFC<DisplayGameProps> = ({
  translate,
  board,
  score,
  elapsedSeconds,
}) => {
  return (
    <Fragment>
      <div className="display-game">
        <div className="display-game__hud">
          <HUDItem
            name={translate("display.display-game.score")}
            value={String(score).padStart(4, "0")}
          />
          <HUDItem
            name={translate("display.display-game.time")}
            value={formatSeconds(elapsedSeconds)}
          />
        </div>
        <div className="display-game__tetris">
          <Tetris board={board} />
        </div>
      </div>
      <style jsx>{`
        .display-game {
          height: 100%;
          background-color: ${colors.DARK_GRAY};
        }

        .display-game__hud {
          position: absolute;
          width: 100%;
          height: 10%;
          display: flex;
          flex-direction: row;
          align-items: center;
          color: ${colors.WHITE};
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0) 100%
          );
        }

        .display-game__tetris {
          text-align: center;
          height: 100%;
        }
      `}</style>
    </Fragment>
  )
}

export const DisplayGame = withTranslate(_DisplayGame)

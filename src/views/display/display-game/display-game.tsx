import React, { Component, Fragment } from "react"
import { interval, Subject } from "rxjs"
import { commands } from "../../../commands"
import { Tetris } from "../../../components/tetris"
import {
  AutoUnsubscribeProps,
  withAutoUnsubscribe,
} from "../../../components/with-auto-unsubscribe"
import {
  TranslateProps,
  withTranslate,
} from "../../../components/with-translate"
import { Game } from "../../../games/tetris/game"
import { colors } from "../../../styles/colors"
import { formatSeconds } from "./format-seconds"
import { HUDItem } from "./hud-item"

interface DisplayGameProps extends TranslateProps, AutoUnsubscribeProps {
  actionCommand: Subject<string>
  gameOver: Subject<number>
}

interface DisplayGameState {
  score: number
  elapsedSeconds: number
}

const ONE_SECOND = 1000

class _DisplayGame extends Component<DisplayGameProps> {
  private game = new Game({ columnCount: 10, rowCount: 16 })
  private timeTicker = interval(ONE_SECOND)

  state: DisplayGameState = {
    score: 0,
    elapsedSeconds: 0,
  }

  async componentDidMount() {
    const { actionCommand, gameOver, unsubscribeOnUnmount } = this.props

    unsubscribeOnUnmount(
      actionCommand.subscribe(this.handleCommand),
      this.game.scoreChange.subscribe(({ current }) =>
        this.setState({ score: current }),
      ),
      this.timeTicker.subscribe(() => {
        const { elapsedSeconds } = this.state
        this.setState({ elapsedSeconds: elapsedSeconds + 1 })
      }),
    )

    await this.game.start()
    gameOver.next(this.state.score)
  }

  private handleCommand = (command: string) => {
    switch (command) {
      case commands.LEFT:
        this.game.left()
        break
      case commands.RIGHT:
        this.game.right()
        break
      case commands.DOWN:
        this.game.down()
        break
      case commands.TAP:
        this.game.rotate()
        break
    }
  }

  render() {
    const { translate } = this.props
    const { score, elapsedSeconds } = this.state

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
            <Tetris game={this.game} />
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
}

export const DisplayGame = withAutoUnsubscribe(withTranslate(_DisplayGame))

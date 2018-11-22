import React, { Component, Fragment } from "react"
import { Subject } from "rxjs"
import css from "styled-jsx/css"
import { commands } from "../../commands"
import { JoinHelpBar } from "../../components/join-help-bar"
import { Tetris } from "../../components/tetris"
import { Game } from "../../games/tetris/game"

interface DisplayGameProps {
  actionCommand: Subject<string>
  gameOver: Subject<number>
  staticPath: string
}

interface DisplayGameState {
  score: number
}

export class DisplayGame extends Component<DisplayGameProps, DisplayGameState> {
  private game = new Game({ columnCount: 10, rowCount: 16 })
  state: DisplayGameState = {
    score: 0,
  }

  async componentDidMount() {
    const { actionCommand, gameOver } = this.props
    actionCommand.subscribe(this.handleCommand)
    this.game.scoreChange.subscribe(({ current }) =>
      this.setState({ score: current }),
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
    const { className, styles } = css.resolve`{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }`

    const { score } = this.state
    const { staticPath } = this.props

    return (
      <Fragment>
        <div className="wrap">
          <div className="tetris-wrap">
            <Tetris game={this.game} staticPath={staticPath} />
            Score: {score}
          </div>
          <JoinHelpBar className={className} />
        </div>
        {styles}
        <style jsx>{`
          .wrap {
            flex-grow: 1;
          }

          .tetris-wrap {
            text-align: center;
            height: calc(100% - 80px);
          }
        `}</style>
      </Fragment>
    )
  }
}
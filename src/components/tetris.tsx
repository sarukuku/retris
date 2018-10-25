import React, { Component, Fragment } from "react"
import { Game } from "../games/tetris/game"
import { Matrix } from "../games/tetris/matrix"

interface TetrisState {
  board: Matrix
}

export class Tetris extends Component<{}, TetrisState> {
  game = new Game(10, 10, board => this.onGameCycle(board))
  state: TetrisState = { board: [] }

  private onGameCycle(board: Matrix) {
    this.setState({ board })
  }

  componentDidMount() {
    this.game.start()
  }

  render() {
    const { board } = this.state
    return (
      <Fragment>
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="row">
              {row.map((_, cellIndex) => (
                <div
                  key={`row-${rowIndex}-cell-${cellIndex}`}
                  className="cell"
                />
              ))}
            </div>
          ))}
        </div>
        <style jsx>{`
          .board {
            width: 100%;
            height: 100%;
          }

          .row {
            width: 100%;
            height: 50px;
          }

          .cell {
            width: 50px;
            height: 100%;
          }
        `}</style>
      </Fragment>
    )
  }
}

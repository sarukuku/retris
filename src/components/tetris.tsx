import React, { Component } from "react"
import { Game } from "../games/tetris/game"
import { Matrix } from "../games/tetris/matrix"

interface TetrisState {
  board: Matrix
}

export class Tetris extends Component<{}, TetrisState> {
  game = new Game(10, 10, this.onGameCycle)
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
      <>
        <div className="board">
          {board.map(row => (
            <div className="row">
              {row.map(cell => (
                <>
                  <div className="cell" />
                  <style jsx>{`
                    .cell {
                      background-color: ${cell ? cell.color : "white"};
                    }
                  `}</style>
                </>
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
      </>
    )
  }
}

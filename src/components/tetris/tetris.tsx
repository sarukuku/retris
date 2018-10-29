import React, { Component } from "react"
import { Game } from "../../games/tetris/game"
import { TetrisMatrix } from "../../games/tetris/shape"

interface TetrisState {
  isGameOver: boolean
  board: TetrisMatrix
}

export class Tetris extends Component<{}, TetrisState> {
  private game: Game
  private columnCount = 20
  private rowCount = 20

  state: TetrisState = {
    isGameOver: false,
    board: [],
  }

  async componentDidMount() {
    this.game = new Game(this.onBoardChange, this.columnCount, this.rowCount)
    await this.game.start()
    this.setState({ isGameOver: true })
  }

  private onBoardChange = (board: TetrisMatrix) => {
    this.setState({ board })
  }

  rotate() {
    this.game.rotate()
  }

  left() {
    this.game.left()
  }

  right() {
    this.game.right()
  }

  down() {
    this.game.down()
  }

  render() {
    const { board } = this.state

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          border: "2px solid black",
        }}
      >
        {board.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            style={{
              width: "100%",
              height: `${(1 / this.rowCount) * 100}%`,
              display: "flex",
              flexDirection: "row",
            }}
          >
            {row.map((cell, cellIndex) => (
              <div
                key={`row-${rowIndex}-cell-${cellIndex}`}
                style={{
                  height: "100%",
                  width: `${(1 / this.columnCount) * 100}%`,
                  backgroundColor: cell ? cell.color : "white",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }
}

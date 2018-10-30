import React, { Component } from "react"
import { OnBoardChange } from "../../games/tetris/board"
import { Game } from "../../games/tetris/game"
import { TetrisMatrix } from "../../games/tetris/shape"

interface TetrisState {
  isGameOver: boolean
  board: TetrisMatrix
}

export class Tetris extends Component<{}, TetrisState> {
  private game: Game
  private columnCount = 10
  private rowCount = 10
  private onBoardChange: OnBoardChange

  state: TetrisState = {
    isGameOver: false,
    board: [],
  }

  async componentDidMount() {
    this.onBoardChange = (board: TetrisMatrix) => this.setState({ board })
    this.game = new Game(this.onBoardChange, this.columnCount, this.rowCount)
    await this.game.start()

    this.setState({ isGameOver: true })
  }

  componentWillUnmount() {
    this.onBoardChange = () => undefined
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
    this.renderToCanvas()
    return <canvas width="500" height="500" ref="canvas" />
  }

  private renderToCanvas() {
    if (!this.refs.canvas) {
      return
    }
    const ctx = (this.refs.canvas as HTMLCanvasElement).getContext("2d")
    if (!ctx) {
      return
    }
    const { board } = this.state
    const cellSize = 50

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        ctx.fillStyle = cell ? cell.color : "white"
        ctx.fillRect(
          columnIndex * cellSize,
          rowIndex * cellSize,
          cellSize,
          cellSize,
        )
      })
    })

    ctx.strokeStyle = "black"
    ctx.strokeRect(0, 0, 500, 500)
  }
}

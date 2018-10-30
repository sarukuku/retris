import React, { Component } from "react"
import { OnBoardChange } from "../../games/tetris/board"
import { Game } from "../../games/tetris/game"
import { TetrisMatrix } from "../../games/tetris/shape"

interface TetrisState {
  isGameOver: boolean
  board: TetrisMatrix
}

type Ctx = CanvasRenderingContext2D
type Canvas = HTMLCanvasElement

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
    this.resizeCanvasToParentSize()
    window.onresize = () => this.resizeCanvasToParentSize()

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
    return <canvas ref="canvas" />
  }

  private renderToCanvas(): void {
    const canvas = this.canvas
    if (!canvas) {
      return
    }

    const ctx = this.ctx
    if (!ctx) {
      return
    }

    this.clearCanvas(canvas, ctx)
    this.drawBoard(canvas, ctx)
    this.drawBorder(canvas, ctx)
  }

  private clearCanvas(canvas: Canvas, ctx: Ctx): void {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  private drawBoard(canvas: Canvas, ctx: Ctx): void {
    const { board } = this.state

    const cellWidth = Math.ceil(canvas.width / this.columnCount)
    const cellHeight = Math.ceil(canvas.height / this.rowCount)

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        ctx.fillStyle = cell ? cell.color : "white"
        ctx.fillRect(
          columnIndex * cellWidth,
          rowIndex * cellHeight,
          cellWidth,
          cellHeight,
        )
      })
    })
  }

  private drawBorder(canvas: Canvas, ctx: Ctx): void {
    ctx.strokeStyle = "black"
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
  }

  private get ctx(): Ctx | undefined {
    const canvas = this.canvas
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }

    return ctx
  }

  private get canvas(): Canvas | undefined {
    return this.refs.canvas as Canvas | undefined
  }

  private resizeCanvasToParentSize(): void {
    const canvas = this.canvas
    if (!canvas) {
      return
    }

    const parent = canvas.parentElement
    if (!parent) {
      return
    }

    canvas.width = parent.clientWidth
    canvas.height = parent.clientHeight

    this.renderToCanvas()
  }
}

import React, { Component } from "react"
import { OnBoardChange } from "../../games/tetris/board"
import { Game, OnScoreChange } from "../../games/tetris/game"
import { TetrisMatrix } from "../../games/tetris/shape"
import { PRESS_START_2P } from "../../styles/fonts"

interface TetrisState {
  isGameOver: boolean
  board: TetrisMatrix
  totalScore: number
  gainedScore?: number
}

type Ctx = CanvasRenderingContext2D
type Canvas = HTMLCanvasElement

export class Tetris extends Component<{}, TetrisState> {
  private game: Game
  private columnCount = 10
  private rowCount = 10
  private onBoardChange: OnBoardChange
  private onScoreChange: OnScoreChange

  state: TetrisState = {
    isGameOver: false,
    board: [],
    totalScore: 0,
    gainedScore: undefined,
  }

  async componentDidMount() {
    this.resizeCanvasToParentSize()
    window.onresize = () => this.resizeCanvasToParentSize()

    this.onBoardChange = (board: TetrisMatrix) => this.setState({ board })
    this.onScoreChange = (gainedScore: number, totalScore: number) =>
      this.setState({ gainedScore, totalScore })

    this.game = new Game(
      this.onBoardChange,
      this.onScoreChange,
      this.columnCount,
      this.rowCount,
    )
    await this.game.start()

    this.setState({ isGameOver: true })
  }

  componentWillUnmount() {
    this.onBoardChange = () => undefined
    this.onScoreChange = () => undefined
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
    return (
      <>
        <PreloadFonts fontFamilies={[PRESS_START_2P]} />
        <canvas ref="canvas" />
      </>
    )
  }

  private renderToCanvas(): void {
    const canvas = this.canvas
    const ctx = this.ctx
    if (!canvas || !ctx) {
      return
    }

    const { board, gainedScore } = this.state

    this.clearCanvas(canvas, ctx)
    this.drawBoard(canvas, ctx, board)
    this.drawBorder(canvas, ctx)

    if (gainedScore) {
      this.drawGainedScore(canvas, ctx, gainedScore)
    }
  }

  private clearCanvas(canvas: Canvas, ctx: Ctx): void {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  private drawBoard(canvas: Canvas, ctx: Ctx, board: TetrisMatrix): void {
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

  private drawGainedScore(canvas: Canvas, ctx: Ctx, gainedScore: number) {
    ctx.font = `20px ${PRESS_START_2P}`
    ctx.fillStyle = "black"
    ctx.fillText(`BAM ${gainedScore}!`, canvas.width / 2, canvas.height / 2)
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

interface PreloadFontsProps {
  fontFamilies: string[]
}

const PreloadFonts: React.SFC<PreloadFontsProps> = ({ fontFamilies }) => (
  <>
    {fontFamilies.map(fontFamily => (
      <div key={fontFamily} style={{ fontFamily }}>
        &nbsp;
      </div>
    ))}
  </>
)

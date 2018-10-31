import React, { Component } from "react"
import { OnBoardChange } from "../../games/tetris/board"
import { Game, OnLevelChange, OnScoreChange } from "../../games/tetris/game"
import { TetrisMatrix } from "../../games/tetris/shape"
import { wait } from "../../helpers"
import { fonts } from "../../styles/fonts"

interface TetrisState {
  isGameOver: boolean
  board: TetrisMatrix
  totalScore: number
  gainedScore?: number
  currentLevel: number
}

type Ctx = CanvasRenderingContext2D
type Canvas = HTMLCanvasElement

const ONE_SECOND = 1000

export class Tetris extends Component<{}, TetrisState> {
  private game: Game
  private columnCount = 10
  private rowCount = 16
  private onBoardChange: OnBoardChange
  private onScoreChange: OnScoreChange
  private onLevelChange: OnLevelChange

  state: TetrisState = {
    isGameOver: false,
    board: [],
    totalScore: 0,
    gainedScore: undefined,
    currentLevel: 1,
  }

  async componentDidMount() {
    this.resizeCanvasToParentSize()
    window.onresize = () => this.resizeCanvasToParentSize()

    this.onBoardChange = (board: TetrisMatrix) => this.setState({ board })
    this.onScoreChange = async (gainedScore: number, totalScore: number) => {
      this.setState({ gainedScore, totalScore })
      await wait(ONE_SECOND)
      this.setState({ gainedScore: undefined })
    }
    this.onLevelChange = (currentLevel: number) =>
      this.setState({ currentLevel })

    this.game = new Game(
      this.onBoardChange,
      this.onScoreChange,
      this.onLevelChange,
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
    const canvas = this.canvas
    const ctx = this.ctx
    if (canvas && ctx) {
      this.renderGame(canvas, ctx)
    }

    return (
      <>
        <canvas ref="canvas" />
      </>
    )
  }

  private renderGame(canvas: Canvas, ctx: Ctx): void {
    const { gainedScore } = this.state

    this.clearCanvas(canvas, ctx)
    this.drawBoard(canvas, ctx)
    this.drawBorder(canvas, ctx)

    if (gainedScore) {
      this.drawGainedScore(canvas, ctx, gainedScore)
    }

    this.drawTotalScore(canvas, ctx)
    this.drawCurrentLevel(canvas, ctx)
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

  private drawGainedScore(canvas: Canvas, ctx: Ctx, gainedScore: number) {
    ctx.font = `60px '${fonts.PRESS_START_2P}'`
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.fillText(`+${gainedScore}`, canvas.width / 2, canvas.height / 2)
  }

  private drawTotalScore(canvas: Canvas, ctx: Ctx) {
    const { totalScore } = this.state

    const coeff = canvas.width / 30
    ctx.font = `${coeff}px '${fonts.PRESS_START_2P}'`
    ctx.fillStyle = "black"
    ctx.textAlign = "left"
    ctx.fillText(`${totalScore}`.padStart(8, "0"), 20, 2 * coeff)
  }

  private drawCurrentLevel(canvas: Canvas, ctx: Ctx) {
    const { currentLevel } = this.state
    const coeff = canvas.width / 30
    ctx.font = `${coeff}px '${fonts.PRESS_START_2P}'`
    ctx.fillStyle = "black"
    ctx.textAlign = "left"
    ctx.fillText(`Level ${`${currentLevel}`.padStart(2, "0")}`, 20, 4 * coeff)
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

    const isGamePortrait = this.rowCount >= this.columnCount
    const isParentPortrait = parent.clientHeight >= parent.clientWidth

    const aspectRatio = this.columnCount / this.rowCount
    if (isGamePortrait) {
      if (isParentPortrait) {
        canvas.width = parent.clientWidth
        canvas.height = canvas.width / aspectRatio
      } else {
        canvas.height = parent.clientHeight
        canvas.width = canvas.height * aspectRatio
      }
    } else {
      if (isParentPortrait) {
        canvas.width = parent.clientWidth
        canvas.height = canvas.width / aspectRatio
      } else {
        canvas.height = parent.clientHeight
        canvas.width = canvas.height * aspectRatio
      }
    }

    const ctx = this.ctx
    if (!ctx) {
      return
    }

    this.renderGame(canvas, ctx)
  }
}

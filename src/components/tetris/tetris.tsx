import memoize from "fast-memoize"
import React, { Component, Fragment } from "react"
import { OnBoardChange } from "../../games/tetris/board"
import { Game, OnLevelChange, OnScoreChange } from "../../games/tetris/game"
import { TetrisMatrix } from "../../games/tetris/shape"
import { wait } from "../../helpers"
import { calculateCanvasSize } from "./calculate-canvas-size"

export type OnGameOver = (totalScore: number) => void

interface TetrisProps {
  staticPath: string
  onGameOver: OnGameOver
}

interface TetrisState {
  totalScore: number
  gainedScore?: number
  currentLevel: number
}

type Ctx = CanvasRenderingContext2D
type Canvas = HTMLCanvasElement

const ONE_SECOND = 1000

export class Tetris extends Component<TetrisProps, TetrisState> {
  private game: Game
  private columnCount = 10
  private rowCount = 16
  private onBoardChange: OnBoardChange
  private onScoreChange: OnScoreChange
  private onLevelChange: OnLevelChange
  private board: TetrisMatrix
  private blockSVG: SVGElement
  private readonly canvasRef = React.createRef<HTMLCanvasElement>()

  state: TetrisState = {
    totalScore: 0,
    gainedScore: undefined,
    currentLevel: 1,
  }

  componentWillUnmount() {
    this.onBoardChange = () => undefined
    this.onScoreChange = () => undefined
  }

  async componentDidMount() {
    this.resizeCanvasToParentSize()
    window.onresize = () => this.resizeCanvasToParentSize()

    this.onBoardChange = (board: TetrisMatrix) => { this.board = board }
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

    const xhr = new XMLHttpRequest()
    const url = this.props.staticPath + "/block.svg"
    xhr.open("GET", url, true)
    xhr.overrideMimeType("image/svg+xml")
    xhr.onload = () => {
      if (xhr.responseXML && xhr.responseXML.documentElement) {
        this.blockSVG = xhr.responseXML.documentElement as any as SVGElement
      }
    }
    xhr.send("")

    const canvasRef = this.canvasRef
    const ctx = this.ctx
    const renderFrame = () => {
      if (canvasRef.current && ctx ) {
        this.renderGame(canvasRef.current, ctx)
      }
      window.requestAnimationFrame(renderFrame)
    }

    window.requestAnimationFrame(renderFrame)

    await this.game.start()

    this.props.onGameOver(this.state.totalScore)
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

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <Fragment>
        <canvas ref={this.canvasRef} />
      </Fragment>
    )
  }

  private renderGame(canvas: Canvas, ctx: Ctx): void {
    this.clearCanvas(canvas, ctx)
    this.drawBoard(canvas, ctx)
  }

  private clearCanvas(canvas: Canvas, ctx: Ctx): void {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  static svgToImage(svg: SVGElement): HTMLImageElement {
    const img = new Image()
    const b64Prefix = "data:image/svg+xml;base64,"
    const b64Image = btoa(new XMLSerializer().serializeToString(svg))
    img.src = b64Prefix + b64Image
    return img
  }

  static blockWithColors(element: SVGElement, gradientStartColor: string, gradientStopColor: string): SVGElement {
    const SVGdup = element.cloneNode(true) as SVGElement
    const stopElements = SVGdup.getElementsByTagName("stop")
    stopElements[0].setAttribute("stop-color", gradientStartColor)
    stopElements[1].setAttribute("stop-color", gradientStopColor)
    return SVGdup
  }

  static memBlockWithColors = memoize(Tetris.blockWithColors)

  private drawBlock(x: number,
                    y: number,
                    width: number,
                    height: number,
                    gradient: string[],
                    ctx: Ctx): void {
    if (this.blockSVG) {
      const blockSVG = Tetris.memBlockWithColors(this.blockSVG, gradient[0], gradient[1])
      const blockImage = Tetris.svgToImage(blockSVG)
      ctx.drawImage(blockImage, x, y, width, height)
    }
  }

  private drawBoard(canvas: Canvas, ctx: Ctx): void {
    const board = this.board

    if (board) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate board size so that borders end on exact pixels
      const boardWidth = canvas.width - (canvas.width % this.columnCount)
      const boardHeight = canvas.height - (canvas.height % this.rowCount)

      // Draw the board background
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, boardWidth, boardHeight)

      const cellWidth = boardWidth / this.columnCount
      const cellHeight = boardHeight / this.rowCount
      const innerWidth = Math.floor(cellWidth * 0.97)
      const innerHeight = Math.floor(cellHeight * 0.97)
      const paddingX = Math.floor((cellWidth - innerWidth) / 2)
      const paddingY = Math.floor((cellHeight - innerHeight) / 2)

      board.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {

          const x = (columnIndex * cellWidth) + paddingX
          const y = (rowIndex * cellHeight) + paddingY

          ctx.fillStyle = "#1d1f21"
          ctx.fillRect(x, y, innerWidth, innerHeight)

          if (cell) {
            this.drawBlock(x, y, innerWidth, innerHeight, cell.color, ctx)
          }
        })
      })
    }
  }

  private get ctx(): Ctx | undefined {
    const canvas = this.canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }

    return ctx
  }

  private resizeCanvasToParentSize(): void {
    const canvas = this.canvasRef.current
    if (!canvas) {
      return
    }

    const parentElement = canvas.parentElement
    if (!parentElement) {
      return
    }

    const parent = {
      width: parentElement.clientWidth,
      height: parentElement.clientHeight,
    }
    const aspectRatio = this.columnCount / this.rowCount
    const { width, height } = calculateCanvasSize({
      parent,
      aspectRatio,
    })

    canvas.width = width
    canvas.height = height

    const ctx = this.ctx
    if (!ctx) {
      return
    }

    this.renderGame(canvas, ctx)
  }
}

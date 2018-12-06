import memoize from "fast-memoize"
import React, { Component } from "react"
import { clientConfig } from "../../client-config"
import { columnCount, rowCount } from "../../games/tetris/matrix"
import { TetrisMatrix } from "../../games/tetris/shape"
import { svgToImage } from "../../helpers"
import { colors } from "../../styles/colors"
import { calculateCanvasSize } from "./calculate-canvas-size"

interface TetrisProps {
  board: TetrisMatrix
}

type Ctx = CanvasRenderingContext2D
type Canvas = HTMLCanvasElement

export class Tetris extends Component<TetrisProps> {
  private previousBoard?: TetrisMatrix
  private blockSVG: SVGElement
  private readonly canvasRef = React.createRef<HTMLCanvasElement>()

  async componentDidMount() {
    await this.loadShapeBlock()
    const canvasRef = this.canvasRef
    const ctx = this.ctx
    window.requestAnimationFrame(() => this.renderFrame(canvasRef.current, ctx))
    window.onresize = () => this.resizeCanvasToParentSize()
    this.resizeCanvasToParentSize()
  }

  private renderFrame = (canvas: Canvas | null, ctx?: Ctx): void => {
    const { board } = this.props
    if (canvas && ctx && this.shouldRender()) {
      this.previousBoard = board
      this.renderGame(canvas, ctx)
    }
    window.requestAnimationFrame(() => this.renderFrame(canvas, ctx))
  }

  private shouldRender() {
    const { board } = this.props
    return this.previousBoard !== board
  }

  private loadShapeBlock(): Promise<void> {
    const xhr = new XMLHttpRequest()
    const url = `${clientConfig.staticPath}/block.svg`
    xhr.open("GET", url, true)
    xhr.overrideMimeType("image/svg+xml")

    return new Promise(resolve => {
      xhr.onload = () => {
        if (xhr.responseXML && xhr.responseXML.documentElement) {
          this.blockSVG = (xhr.responseXML.documentElement as any) as SVGElement
          resolve()
        }
      }
      xhr.send("")
    })
  }

  render() {
    return <canvas ref={this.canvasRef} />
  }

  private renderGame(canvas: Canvas, ctx: Ctx): void {
    this.clearCanvas(canvas, ctx)
    this.drawBoard(canvas, ctx)
  }

  private clearCanvas(canvas: Canvas, ctx: Ctx): void {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  private drawBlock(
    x: number,
    y: number,
    width: number,
    height: number,
    [startColor, stopColor]: string[],
    ctx: Ctx,
  ): void {
    const blockImage = this.getColoredBlockImage({ startColor, stopColor })
    ctx.drawImage(blockImage, x, y, width, height)
  }

  private getColoredBlockImage = memoize(
    this.unmemoizedGetColoredBlockImage.bind(this),
  )

  private unmemoizedGetColoredBlockImage({
    startColor,
    stopColor,
  }: {
    startColor: string
    stopColor: string
  }): HTMLImageElement {
    const coloredBlockSVG = this.blockSVG.cloneNode(true) as SVGElement
    const stopElements = coloredBlockSVG.getElementsByTagName("stop")
    stopElements[0].setAttribute("stop-color", startColor)
    stopElements[1].setAttribute("stop-color", stopColor)
    return svgToImage(coloredBlockSVG)
  }

  private drawBoard(canvas: Canvas, ctx: Ctx): void {
    const { board } = this.props
    if (!board) {
      return
    }

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
        const x = columnIndex * cellWidth + paddingX
        const y = rowIndex * cellHeight + paddingY

        ctx.fillStyle = colors.DARK_GRAY
        ctx.fillRect(x, y, innerWidth, innerHeight)

        if (cell) {
          this.drawBlock(x, y, innerWidth, innerHeight, cell.color, ctx)
        }
      })
    })
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

  private get columnCount(): number {
    const { board } = this.props
    return columnCount(board)
  }

  private get rowCount(): number {
    const { board } = this.props
    return rowCount(board)
  }
}

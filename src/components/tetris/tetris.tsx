import memoize from "fast-memoize"
import React, { Component } from "react"
import { ReplaySubject } from "rxjs"
import { TetrisMatrix } from "../../games/tetris/shape"
import { svgToImage } from "../../helpers"
import {
  withAutoUnsubscribe,
  AutoUnsubscribeProps,
} from "../with-auto-unsubscribe"
import { calculateCanvasSize } from "./calculate-canvas-size"

interface Game {
  boardChange: ReplaySubject<TetrisMatrix>
  getColumnCount(): number
  getRowCount(): number
}

interface TetrisProps extends AutoUnsubscribeProps {
  game: Game
  staticPath: string
}

interface TetrisState {
  score: number
}

type Ctx = CanvasRenderingContext2D
type Canvas = HTMLCanvasElement

class _Tetris extends Component<TetrisProps, TetrisState> {
  private board: TetrisMatrix
  private blockSVG: SVGElement
  private readonly canvasRef = React.createRef<HTMLCanvasElement>()

  async componentDidMount() {
    this.resizeCanvasToParentSize()
    window.onresize = () => this.resizeCanvasToParentSize()

    await this.loadShapeBlock()

    const canvasRef = this.canvasRef
    const ctx = this.ctx
    const renderFrame = () => {
      if (canvasRef.current && ctx) {
        this.renderGame(canvasRef.current, ctx)
      }
      window.requestAnimationFrame(renderFrame)
    }
    window.requestAnimationFrame(renderFrame)

    const { game, unsubscribeOnUnmount } = this.props
    unsubscribeOnUnmount(
      game.boardChange.subscribe(board => (this.board = board)),
    )
  }

  private loadShapeBlock(): Promise<void> {
    const xhr = new XMLHttpRequest()
    const url = `${this.props.staticPath}/block.svg`
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
    const board = this.board
    if (!board) {
      return
    }

    const { game } = this.props

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate board size so that borders end on exact pixels
    const boardWidth = canvas.width - (canvas.width % game.getColumnCount())
    const boardHeight = canvas.height - (canvas.height % game.getRowCount())

    // Draw the board background
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, boardWidth, boardHeight)

    const cellWidth = boardWidth / game.getColumnCount()
    const cellHeight = boardHeight / game.getRowCount()
    const innerWidth = Math.floor(cellWidth * 0.97)
    const innerHeight = Math.floor(cellHeight * 0.97)
    const paddingX = Math.floor((cellWidth - innerWidth) / 2)
    const paddingY = Math.floor((cellHeight - innerHeight) / 2)

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const x = columnIndex * cellWidth + paddingX
        const y = rowIndex * cellHeight + paddingY

        ctx.fillStyle = "#1d1f21"
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
    const { game } = this.props
    const aspectRatio = game.getColumnCount() / game.getRowCount()
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

export const Tetris = withAutoUnsubscribe(_Tetris)

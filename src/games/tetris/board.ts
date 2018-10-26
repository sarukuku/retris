import { always, times, clone } from "ramda"
import { GetNextShape } from "./get-next-shape"
import { Matrix } from "./matrix"
import { Shape } from "./shape"

interface Active {
  shape: Shape
  position: Position
}

interface Position {
  x: number
  y: number
}

type OnBoardChange = (board: Matrix) => void

type OnGameOver = () => void

export class Board {
  protected matrix: Matrix
  private active: Active | undefined

  constructor(
    private columnCount: number,
    rowCount: number,
    public onBoardChange: OnBoardChange,
    public onGameOver: OnGameOver,
    private getNextShape: GetNextShape,
  ) {
    this.matrix = times(() => times(always(undefined), columnCount), rowCount)
    this.invalidateBoard()
  }

  rotate() {
    if (this.active && this.canRotate()) {
      this.active.shape.rotate()
      this.invalidateBoard()
    }
  }

  private canRotate() {
    return true
  }

  left() {
    if (this.active && this.canMoveLeft()) {
      this.active.position.x--
      this.invalidateBoard()
    }
  }

  private canMoveLeft() {
    return true
  }

  right() {
    if (this.active && this.canMoveRight()) {
      this.active.position.x++
      this.invalidateBoard()
    }
  }

  private canMoveRight() {
    return true
  }

  down() {
    if (this.active && this.canMoveDown()) {
      this.active.position.y++
      this.invalidateBoard()
    }
  }

  private canMoveDown() {
    return true
  }

  step() {
    this.executeStep()
    this.invalidateBoard()
  }

  private executeStep() {
    if (!this.active) {
      this.addNewActiveShape()
      return
    }

    if (this.isBottomReached()) {
      if (this.hasNoSpaceLeft()) {
        this.onGameOver()
        return
      }

      this.addActiveShapeToBoard()
      this.addNewActiveShape()
      return
    }

    this.active.position.y++
  }

  private invalidateBoard(): void {
    if (!this.active) {
      this.onBoardChange(this.matrix)
      return
    }

    const { position, shape } = this.active

    const board = clone(this.matrix)

    shape.draw().map((row, rowIndex) => {
      row.map((cell, columnIndex) => {
        const rowWithOffset = rowIndex + position.y
        const columnWithOffset = columnIndex + position.x

        if (typeof board[rowWithOffset][columnWithOffset] === "undefined") {
          board[rowWithOffset][columnWithOffset] = cell
        }
      })
    })

    this.onBoardChange(board)
    return
  }

  private isBottomReached() {
    return false
  }

  private hasNoSpaceLeft() {
    return false
  }

  private addNewActiveShape() {
    const middleX = Math.floor((this.columnCount - 1) / 2)

    this.active = {
      shape: this.getNextShape(),
      position: { x: middleX, y: 0 },
    }
  }

  private addActiveShapeToBoard() {
    return
  }
}

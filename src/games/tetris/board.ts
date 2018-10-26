import { clone } from "ramda"
import { GetNextShape } from "./get-next-shape"
import { Matrix } from "./matrix"
import { Shape, Position } from "./shape"

export interface Active {
  shape: Shape
  position: Position
  hasAlreadyHitBottom: boolean
}

export type OnBoardChange = (board: Matrix) => void

export type OnGameOver = () => void

export class Board {
  constructor(
    public onBoardChange: OnBoardChange,
    public onGameOver: OnGameOver,
    private getNextShape: GetNextShape,
    private matrix: Matrix,
    private active?: Active,
  ) {
    this.invalidateBoard()
  }

  rotate(): void {
    if (this.active && this.canRotate()) {
      this.active.shape.rotate()
      this.invalidateBoard()
    }
  }

  private canRotate(): boolean {
    return true
  }

  left(): void {
    if (this.active && this.canMoveLeft()) {
      this.active.position.x--
      this.invalidateBoard()
    }
  }

  private canMoveLeft(): boolean {
    return true
  }

  right(): void {
    if (this.active && this.canMoveRight()) {
      this.active.position.x++
      this.invalidateBoard()
    }
  }

  private canMoveRight(): boolean {
    return true
  }

  down(): void {
    if (this.active && this.canMoveDown()) {
      this.active.position.y++
      this.invalidateBoard()
    }
  }

  private canMoveDown(): boolean {
    return true
  }

  step(): void {
    this.executeStep()
    this.invalidateBoard()
  }

  private executeStep(): void {
    if (!this.active) {
      this.spawnNewActiveShape()
      return
    }

    if (this.isActiveAtBottom()) {
      if (this.active.hasAlreadyHitBottom) {
        // this.addActiveToBoard()
        return
      }

      this.active.hasAlreadyHitBottom = true
      return
    }

    if (this.active.hasAlreadyHitBottom) {
      this.active.hasAlreadyHitBottom = false
    }

    this.active.position.y++
  }

  private isActiveAtBottom(): boolean {
    if (!this.active) {
      return false
    }

    const activeShapeCellPositions = this.active.shape
      .getCellPositions()
      .map(p => this.toBoardCellPositions(p))

    const isAtBottom = activeShapeCellPositions.some(
      p => this.isAtBottomRow(p) || this.isAboveOccupiedCell(p),
    )

    return isAtBottom
  }

  private toBoardCellPositions({ x, y }: Position): Position {
    const { position } = this.active!
    return { x: x + position.x, y: y + position.y }
  }

  private isAtBottomRow({ y }: Position): boolean {
    const lastRowIndex = this.matrix.length - 1
    return y === lastRowIndex
  }

  private isAboveOccupiedCell(p: Position): boolean {
    const positionBelow = { ...p, y: p.y + 1 }
    return !!this.matrix[positionBelow.y][positionBelow.x]
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

        if (!board[rowWithOffset][columnWithOffset]) {
          board[rowWithOffset][columnWithOffset] = cell
        }
      })
    })

    this.onBoardChange(board)
    return
  }

  private spawnNewActiveShape(): void {
    const middleX = Math.floor((this.columnCount - 1) / 2)

    this.active = {
      shape: this.getNextShape(),
      position: { x: middleX, y: 0 },
      hasAlreadyHitBottom: false,
    }
  }

  private get columnCount(): number {
    const firstRow = this.matrix[0]

    if (!firstRow) {
      return 0
    }

    return firstRow.length
  }
}

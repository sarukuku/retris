import { clone } from "ramda"
import { GetNextShape } from "./get-next-shape"
import { Matrix } from "./matrix"
import { Shape, Position } from "./shape"

export interface Active {
  shape: Shape
  position: Position
}

export type OnBoardChange = (board: Matrix) => void

export type OnGameOver = () => void

export class Board {
  private hasActiveAlreadyHitBottom: boolean

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
    return this.canMoveDirection(this.isNotAtLeftEdge)
  }

  private isNotAtLeftEdge = (p: Position): boolean => p.x > 0

  right(): void {
    if (this.active && this.canMoveRight()) {
      this.active.position.x++
      this.invalidateBoard()
    }
  }

  private canMoveRight(): boolean {
    return this.canMoveDirection(this.isNotAtRightEdge)
  }

  private isNotAtRightEdge = (p: Position): boolean =>
    p.x < this.columnCount - 1

  private canMoveDirection(checkEdgeCondition: (p: Position) => boolean) {
    if (!this.active) {
      return false
    }

    const activePositions = this.active.shape
      .getCellPositions()
      .map(this.toBoardCellPosition)

    return activePositions.every(checkEdgeCondition)
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
      if (this.hasActiveAlreadyHitBottom) {
        this.matrix = this.addActiveToBoard()
        this.active = undefined
        return
      }

      this.hasActiveAlreadyHitBottom = true
      return
    }

    if (this.hasActiveAlreadyHitBottom) {
      this.hasActiveAlreadyHitBottom = false
    }

    this.active.position.y++
  }

  private isActiveAtBottom(): boolean {
    if (!this.active) {
      return false
    }

    const activeShapeCellPositions = this.active.shape
      .getCellPositions()
      .map(this.toBoardCellPosition)

    const isAtBottom = activeShapeCellPositions.some(
      p => this.isAtBottomRow(p) || this.isAboveOccupiedCell(p),
    )

    return isAtBottom
  }

  private toBoardCellPosition = ({ x, y }: Position): Position => {
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

    const board = this.addActiveToBoard()
    this.onBoardChange(board)
    return
  }

  private addActiveToBoard(): Matrix {
    const { shape } = this.active!

    const board = clone(this.matrix)
    shape.getCellPositions().forEach(({ x, y }) => {
      const shapeCell = shape.matrix[y][x]
      const boardCellPosition = this.toBoardCellPosition({ x, y })
      board[boardCellPosition.y][boardCellPosition.x] = shapeCell
    })

    return board
  }

  private spawnNewActiveShape(): void {
    const middleX = Math.floor((this.columnCount - 1) / 2)

    this.active = {
      shape: this.getNextShape(),
      position: { x: middleX, y: 0 },
    }
    this.hasActiveAlreadyHitBottom = false
  }

  private get columnCount(): number {
    const firstRow = this.matrix[0]

    if (!firstRow) {
      return 0
    }

    return firstRow.length
  }
}

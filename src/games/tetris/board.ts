import { clone } from "ramda"
import { GetNextShape } from "./get-next-shape"
import { rotateCounterClockwise, rotateMatrix } from "./matrix"
import { Position, Shape, TetrisMatrix, TetrisRow } from "./shape"

export interface Active {
  shape: Shape
  position: Position
}

export type OnBoardChange = (board: TetrisMatrix) => void

export type OnGameOver = () => void

export class Board {
  private hasActiveAlreadyHitBottom: boolean

  constructor(
    public onBoardChange: OnBoardChange,
    public onGameOver: OnGameOver,
    private getNextShape: GetNextShape,
    private matrix: TetrisMatrix,
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
    if (!this.active) {
      return false
    }

    const rotatedActive = new Shape(this.active.shape.matrix)
    rotatedActive.rotate()

    const activePositions = rotatedActive
      .getCellPositions()
      .map(this.toBoardCellPosition)

    const isACellNonRotatable = activePositions.some(p => {
      if (this.isCellOutOfBounds(p)) {
        return true
      }

      const isCellOverLapping = !!this.matrix[p.y][p.x]
      return isCellOverLapping
    })
    return !isACellNonRotatable
  }

  private isCellOutOfBounds(p: Position): boolean {
    const lastColumnIndex = this.columnCount - 1
    const isXOutOfBounds = p.x < 0 || p.x > lastColumnIndex
    if (isXOutOfBounds) {
      return true
    }

    const lastRowIndex = this.rowCount - 1
    const isYOutOfBounds = p.y < 0 || p.y > lastRowIndex
    if (isYOutOfBounds) {
      return true
    }

    return false
  }

  left(): void {
    if (this.active && this.canMoveLeft()) {
      this.active.position.x--
      this.invalidateBoard()
    }
  }

  private canMoveLeft(): boolean {
    return this.isActiveOnEdge(this.isAtLeftEdge)
  }

  private isAtLeftEdge = (p: Position): boolean => {
    const isAtLeftmostColumn = p.x === 0
    if (isAtLeftmostColumn) {
      return true
    }

    const positionToLeft = { ...p, x: p.x - 1 }
    const isLeftCellOccupied = !!this.matrix[positionToLeft.y][positionToLeft.x]
    return isLeftCellOccupied
  }

  right(): void {
    if (this.active && this.canMoveRight()) {
      this.active.position.x++
      this.invalidateBoard()
    }
  }

  private canMoveRight(): boolean {
    return this.isActiveOnEdge(this.isAtRightEdge)
  }

  private isAtRightEdge = (p: Position): boolean => {
    const isAtRightmostColumn = p.x === this.columnCount - 1
    if (isAtRightmostColumn) {
      return true
    }

    const positionToRight = { ...p, x: p.x + 1 }
    const isRightCellOccupied = !!this.matrix[positionToRight.y][
      positionToRight.x
    ]
    return isRightCellOccupied
  }

  down(): void {
    if (this.active && this.canMoveDown()) {
      this.active.position.y++
      this.invalidateBoard()
    }
  }

  step(): void {
    this.executeStep()
    this.invalidateBoard()
  }

  private executeStep(): void {
    if (!this.active) {
      this.spawnNewActiveShape()
      if (this.newActiveCouldNotSpawn()) {
        this.onGameOver()
        return
      }

      return
    }

    const hasActiveHitBottom = !this.canMoveDown()
    if (hasActiveHitBottom) {
      if (this.hasActiveAlreadyHitBottom) {
        this.matrix = this.addActiveToBoard(clone(this.matrix))
        this.active = undefined

        if (this.hasFullRow()) {
          this.matrix = this.applyGravity(
            this.removeFullRows(clone(this.matrix)),
          )
          return
        }
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

  private canMoveDown(): boolean {
    return this.isActiveOnEdge(this.isAtBottomEdge)
  }

  private isAtBottomEdge = (p: Position): boolean => {
    const lastRowIndex = this.rowCount - 1
    const isAtBottomRow = p.y === lastRowIndex
    if (isAtBottomRow) {
      return true
    }

    const positionBelow = { ...p, y: p.y + 1 }
    const isBelowCellOccupied = !!this.matrix[positionBelow.y][positionBelow.x]
    return isBelowCellOccupied
  }

  private isActiveOnEdge(isCellOnEdge: (p: Position) => boolean) {
    if (!this.active) {
      return false
    }

    const activePositions = this.active.shape
      .getCellPositions()
      .map(this.toBoardCellPosition)

    const isACellOnEdge = activePositions.some(isCellOnEdge)
    return !isACellOnEdge
  }

  private toBoardCellPosition = ({ x, y }: Position): Position => {
    if (!this.active) {
      return { x, y }
    }

    const { position } = this.active
    return { x: x + position.x, y: y + position.y }
  }

  private invalidateBoard(): void {
    if (!this.active) {
      this.onBoardChange(this.matrix)
      return
    }

    const board = this.addActiveToBoard(clone(this.matrix))
    this.onBoardChange(board)
    return
  }

  private hasFullRow(): boolean {
    return this.matrix.some(this.isRowFull)
  }

  private removeFullRows(matrix: TetrisMatrix): TetrisMatrix {
    matrix.forEach((row, rowIndex) => {
      if (this.isRowFull(row)) {
        matrix[rowIndex] = row.map(() => undefined)
      }
    })

    return matrix
  }

  private isRowFull = (row: TetrisRow): boolean => row.every(cell => !!cell)

  private applyGravity(matrix: TetrisMatrix): TetrisMatrix {
    const rotated = rotateCounterClockwise(matrix)

    const gravityApplied = rotated.map(column => {
      column.forEach((cell, cellIndex) => {
        if (!cell) {
          column.splice(cellIndex, 1)
          column.unshift(cell)
        }
      })
      return column
    })

    return rotateMatrix(gravityApplied)
  }

  private addActiveToBoard(matrix: TetrisMatrix): TetrisMatrix {
    if (!this.active) {
      return matrix
    }

    const { shape } = this.active
    shape.getCellPositions().forEach(({ x, y }) => {
      const shapeCell = shape.matrix[y][x]
      const boardCellPosition = this.toBoardCellPosition({ x, y })
      matrix[boardCellPosition.y][boardCellPosition.x] = shapeCell
    })

    return matrix
  }

  private spawnNewActiveShape(): void {
    const middleX = Math.floor((this.columnCount - 1) / 2)

    this.active = {
      shape: this.getNextShape(),
      position: { x: middleX, y: 0 },
    }
    this.hasActiveAlreadyHitBottom = false
  }

  private newActiveCouldNotSpawn(): boolean {
    if (!this.active) {
      return false
    }

    const activePositions = this.active.shape
      .getCellPositions()
      .map(this.toBoardCellPosition)

    return activePositions.some(p => {
      const isOverlappingCell = !!this.matrix[p.y][p.x]
      return isOverlappingCell
    })
  }

  private get rowCount(): number {
    return this.matrix.length
  }

  private get columnCount(): number {
    const firstRow = this.matrix[0]

    if (!firstRow) {
      return 0
    }

    return firstRow.length
  }
}

import { clone } from "ramda"
import { GetNextShape } from "./get-next-shape"
import { Position, Shape, TetrisMatrix, TetrisRow } from "./shape"

export interface Active {
  shape: Shape
  position: Position
}

export type OnBoardChange = (board: TetrisMatrix) => void

export type OnGameOver = () => void

export type OnRowClear = (numberOfRowsCleared: number) => void

export class Board {
  private hasActiveAlreadyHitBottom: boolean

  constructor(
    private onBoardChange: OnBoardChange,
    private onGameOver: OnGameOver,
    private onRowClear: OnRowClear,
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

    const rotatedActiveShape = new Shape(this.active.shape.matrix)
    rotatedActiveShape.rotate()
    return this.isValidAction(rotatedActiveShape, this.canCellRotate)
  }

  private canCellRotate = (p: Position): boolean => {
    const lastColumnIndex = this.columnCount - 1
    const isXOutOfBounds = p.x < 0 || p.x > lastColumnIndex
    const lastRowIndex = this.rowCount - 1
    const isYOutOfBounds = p.y < 0 || p.y > lastRowIndex
    const isCellOutOfBounds = isXOutOfBounds || isYOutOfBounds
    if (isCellOutOfBounds) {
      return false
    }

    const isCellEmpty = !this.matrix[p.y][p.x]
    return isCellEmpty
  }

  left(): void {
    if (this.active && this.canMoveLeft()) {
      this.active.position.x--
      this.invalidateBoard()
    }
  }

  private canMoveLeft(): boolean {
    if (!this.active) {
      return false
    }
    return this.isValidAction(this.active.shape, this.canCellMoveLeft)
  }

  private canCellMoveLeft = (p: Position): boolean => {
    const isAtLeftmostColumn = p.x === 0
    if (isAtLeftmostColumn) {
      return false
    }

    const positionToLeft = { ...p, x: p.x - 1 }
    const isLeftCellEmpty = !this.matrix[positionToLeft.y][positionToLeft.x]
    return isLeftCellEmpty
  }

  right(): void {
    if (this.active && this.canMoveRight()) {
      this.active.position.x++
      this.invalidateBoard()
    }
  }

  private canMoveRight(): boolean {
    if (!this.active) {
      return false
    }
    return this.isValidAction(this.active.shape, this.canCellMoveRight)
  }

  private canCellMoveRight = (p: Position): boolean => {
    const isAtRightmostColumn = p.x === this.columnCount - 1
    if (isAtRightmostColumn) {
      return false
    }

    const positionToRight = { ...p, x: p.x + 1 }
    const isRightCellEmpty = !this.matrix[positionToRight.y][positionToRight.x]
    return isRightCellEmpty
  }

  down(): void {
    if (this.active && this.canMoveDown()) {
      this.active.position.y++
      this.invalidateBoard()
    }
  }

  private canMoveDown(): boolean {
    if (!this.active) {
      return false
    }
    return this.isValidAction(this.active.shape, this.canCellMoveDown)
  }

  private canCellMoveDown = (p: Position): boolean => {
    const lastRowIndex = this.rowCount - 1
    const isAtBottomRow = p.y === lastRowIndex
    if (isAtBottomRow) {
      return false
    }

    const positionBelow = { ...p, y: p.y + 1 }
    const isBelowCellEmpty = !this.matrix[positionBelow.y][positionBelow.x]
    return isBelowCellEmpty
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

        const fullRowCount = this.getNumberOfFullRows()
        if (fullRowCount > 0) {
          this.onRowClear(fullRowCount)
          this.matrix = this.clearFullRows(clone(this.matrix))
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

  private isValidAction(
    activeShape: Shape,
    isValidActionForCell: (p: Position) => boolean,
  ) {
    const cellPositions = activeShape
      .getPositions()
      .map(this.toAbsolutePosition)

    const isValid = cellPositions.every(isValidActionForCell)
    return isValid
  }

  private toAbsolutePosition = ({ x, y }: Position): Position => {
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

  private getNumberOfFullRows(): number {
    return this.matrix.reduce(
      (acc, row) => (this.isRowFull(row) ? acc + 1 : acc),
      0,
    )
  }

  private clearFullRows(matrix: TetrisMatrix): TetrisMatrix {
    matrix.forEach((row, rowIndex) => {
      if (this.isRowFull(row)) {
        matrix.splice(rowIndex, 1)
        matrix.unshift(row.map(() => undefined))
      }
    })

    return matrix
  }

  private isRowFull = (row: TetrisRow): boolean => row.every(cell => !!cell)

  private addActiveToBoard(matrix: TetrisMatrix): TetrisMatrix {
    if (!this.active) {
      return matrix
    }

    const { shape } = this.active
    shape.getPositions().forEach(({ x, y }) => {
      const shapeCell = shape.matrix[y][x]
      const boardCellPosition = this.toAbsolutePosition({ x, y })
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
      .getPositions()
      .map(this.toAbsolutePosition)

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

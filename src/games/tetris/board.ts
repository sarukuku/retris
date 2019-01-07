import { clone } from "ramda"
import { ReplaySubject, Subject } from "rxjs"
import { GetNextShape } from "./get-next-shape"
import { columnCount, rowCount } from "./matrix"
import { Position, Shape, TetrisMatrix, TetrisRow } from "./shape"

export interface Active {
  shape: Shape
  position: Position
}

export class Board {
  private hasActiveAlreadyHitBottom: boolean

  readonly boardChange = new ReplaySubject<TetrisMatrix>()
  readonly gameOver = new Subject<void>()
  readonly rowClear = new Subject<number>()

  constructor(
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
    const lastColumnIndex = columnCount(this.matrix) - 1
    const isXOutOfBounds = p.x < 0 || p.x > lastColumnIndex
    const lastRowIndex = rowCount(this.matrix) - 1
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
    const isAtRightmostColumn = p.x === columnCount(this.matrix) - 1
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
    const lastRowIndex = rowCount(this.matrix) - 1
    const isAtBottomRow = p.y === lastRowIndex
    if (isAtBottomRow) {
      return false
    }

    const positionBelow = { ...p, y: p.y + 1 }
    const isBelowCellEmpty = !this.matrix[positionBelow.y][positionBelow.x]
    return isBelowCellEmpty
  }

  smash(): void {
    while (this.canMoveDown()) {
      this.down()
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
        this.gameOver.next()
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
          this.rowClear.next(fullRowCount)
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
      this.boardChange.next(this.matrix)
      return
    }

    const board = this.addActiveToBoard(clone(this.matrix))
    this.boardChange.next(board)
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
    const shape = this.getNextShape()

    const middleX = Math.floor(columnCount(this.matrix) / 2)
    const shapeMiddleX = Math.floor((columnCount(shape.matrix) - 1) / 2)
    const { top } = shape.getBoundingRect()
    this.active = {
      shape,
      position: { x: middleX - shapeMiddleX - 1, y: -top },
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
}

import { last, prepend, remove } from "ramda"
import { ReplaySubject } from "rxjs"
import { wait } from "../../helpers"
import { Board } from "./board"
import { createEmptyMatrix, createEmptyRow } from "./matrix"
import { Shape, TetrisMatrix, TetrisRow, TetrisCell } from "./shape"

const I = () => Shape.createIShape()
const J = () => Shape.createJShape()
const L = () => Shape.createLShape()
const O = () => Shape.createOShape()
const S = () => Shape.createSShape()
const T = () => Shape.createTShape()
const Z = () => Shape.createZShape()

const shapes = [
  {
    getShape: I,
    position: -5,
  },
  {
    getShape: L,
    position: -3,
  },
  {
    getShape: I,
    position: -3,
  },
  {
    getShape: T,
    position: -3,
    rotationCount: 3,
  },
  {
    getShape: I,
    position: -5,
  },
  {
    getShape: T,
    position: 6,
  },
  {
    getShape: O,
    position: 4,
  },
  {
    getShape: T,
    position: 3,
    rotationCount: 2,
  },
  {
    getShape: J,
    position: 2,
    rotationCount: 1,
  },
  {
    getShape: J,
    position: -1,
    rotationCount: 1,
  },
  {
    getShape: T,
    position: -3,
    rotationCount: 1,
  },
  {
    getShape: T,
    position: 2,
    rotationCount: 2,
  },
  {
    getShape: L,
    position: -1,
  },
  {
    getShape: T,
    position: 3,
  },
  {
    getShape: J,
    position: 5,
  },
  {
    getShape: L,
    position: -4,
  },
  {
    getShape: J,
    position: -2,
    rotationCount: 2,
  },
  {
    getShape: J,
    position: 4,
    rotationCount: 2,
  },
  {
    getShape: L,
    position: -2,
    rotationCount: 1,
  },
  {
    getShape: I,
    position: -3,
    rotationCount: 1,
  },
  {
    getShape: Z,
    position: 4,
    rotationCount: 3,
  },
  {
    getShape: S,
    position: 2,
  },
  {
    getShape: J,
    position: 0,
    rotationCount: 2,
  },
  {
    getShape: () => {
      const shape = I()
      shape.rotate()
      return shape
    },
    position: 1,
  },
]

const GAME_STEP_TIME = 100
const SHAPE_POSITION_TIME = 40

export class ReaktorGame {
  private board: Board
  private shapeIndex?: number
  private isGameOver = false
  private currentPosition = 0
  private currentRotation = 0
  private latestBoard: TetrisMatrix
  private rowCount = 16
  private columnCount = 13

  readonly boardChange = new ReplaySubject<TetrisMatrix>()

  constructor() {
    this.board = new Board(
      this.getNextShape,
      createEmptyMatrix(this.columnCount, this.rowCount),
    )
    this.board.gameOver.subscribe(() => (this.isGameOver = true))
    this.board.boardChange.subscribe(board => {
      this.latestBoard = board
      this.boardChange.next(board)
    })
  }

  private getNextShape = () => {
    if (typeof this.shapeIndex === "undefined") {
      this.shapeIndex = 0
    } else {
      this.shapeIndex++
    }

    this.currentPosition = 0
    this.currentRotation = 0

    if (!shapes[this.shapeIndex]) {
      throw new NoShapesLeft()
    }

    return shapes[this.shapeIndex].getShape()
  }

  async start() {
    while (!this.isGameOver) {
      await this.positionShape()
      try {
        this.board.step()
      } catch (err) {
        if (err instanceof NoShapesLeft) {
          this.isGameOver = true
        } else {
          throw err
        }
      }
      await wait(GAME_STEP_TIME)
    }

    await this.flashBoard(this.latestBoard)
    await wait(1000)
    await this.flushBoard(this.latestBoard)
  }

  private async flashBoard(board: TetrisMatrix): Promise<void> {
    const flashCount = 3
    const emptyMatrix = createEmptyMatrix<TetrisCell>(
      this.columnCount,
      this.rowCount,
    )
    for (let i = 0; i < flashCount; i++) {
      await wait(500)
      this.boardChange.next(emptyMatrix)
      await wait(500)
      this.boardChange.next(board)
    }
  }

  private async flushBoard(board: TetrisMatrix): Promise<void> {
    if (this.isLastRowEmpty(board)) {
      return
    }

    const shiftedBoard = remove<TetrisRow>(
      this.rowCount,
      1,
      prepend<TetrisRow>(createEmptyRow(this.columnCount), board),
    )
    this.boardChange.next(shiftedBoard)
    await wait(100)

    return this.flushBoard(shiftedBoard)
  }

  private isLastRowEmpty(board: TetrisMatrix) {
    const lastRow = last(board)
    if (!lastRow) {
      return false
    }

    return lastRow.every(cell => typeof cell === "undefined")
  }

  private async positionShape(): Promise<void> {
    if (typeof this.shapeIndex === "undefined") {
      return
    }

    const shapeRotation = shapes[this.shapeIndex].rotationCount || 0
    while (this.currentRotation < shapeRotation) {
      this.board.rotate()
      this.currentRotation++
      await wait(SHAPE_POSITION_TIME)
    }

    const shapePosition = shapes[this.shapeIndex].position
    while (this.currentPosition < shapePosition) {
      this.board.right()
      this.currentPosition++
      await wait(SHAPE_POSITION_TIME)
    }

    while (this.currentPosition > shapePosition) {
      this.board.left()
      this.currentPosition--
      await wait(SHAPE_POSITION_TIME)
    }
  }
}

class NoShapesLeft {}

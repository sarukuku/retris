import { always, times } from "ramda"
import { wait } from "../../helpers"
import { getNextShape } from "./get-next-shape"
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

const CYCLE_DURATION = 100

type OnGameCycle = (board: Matrix) => void

export class Game {
  private active: Active
  private board: Matrix
  private isGameLost = false

  constructor(
    private columnCount: number,
    rowCount: number,
    public onGameCycle: OnGameCycle,
    private cycleDuration = CYCLE_DURATION,
  ) {
    this.board = times(() => times(always(undefined), columnCount), rowCount)
  }

  async start() {
    this.addNewActive()
    while (this.isGameLost) {
      await wait(this.cycleDuration)
      this.runCycle()
      this.onGameCycle(this.board)
    }
  }

  rotate() {
    if (this.canRotate()) {
      this.active.shape.rotate()
    }
  }

  private canRotate() {
    return true
  }

  left() {
    if (this.canMoveLeft()) {
      this.active.position.x--
    }
  }

  private canMoveLeft() {
    return true
  }

  right() {
    if (this.canMoveRight()) {
      this.active.position.x++
    }
  }

  private canMoveRight() {
    return true
  }

  down() {
    if (this.canMoveDown()) {
      this.active.position.y--
    }
  }

  private canMoveDown() {
    return true
  }

  private runCycle() {
    if (this.isBottomReached()) {
      if (this.noSpaceLeft()) {
        this.isGameLost = true
        return
      }

      this.addNewActive()
      return
    }

    this.active.position.y--
    this.placeShapeToBoard()
  }

  private isBottomReached() {
    return false
  }

  private noSpaceLeft() {
    return false
  }

  private addNewActive() {
    this.active = {
      shape: getNextShape(),
      position: { x: this.columnCount / 2, y: 0 },
    }
  }

  private placeShapeToBoard() {
    return
  }
}

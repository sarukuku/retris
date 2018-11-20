import { wait } from "../../helpers"
import { colors } from "../../styles/colors"
import { Board, OnBoardChange } from "./board"
import { createEmptyMatrix } from "./matrix"
import { Shape } from "./shape"

const noop = () => undefined

const I = () => Shape.createIShape(colors.PETER_RIVER)
const J = () => Shape.createJShape(colors.SUNFLOWER)
const L = () => Shape.createLShape(colors.AMETHYST)
const O = () => Shape.createOShape(colors.ALIZARIN)
const S = () => Shape.createSShape(colors.EMERALD)
const T = () => Shape.createTShape(colors.WET_ASPHALT)
const Z = () => Shape.createZShape(colors.CARROT)

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

export class ReaktorGame {
  private board: Board
  private shapeIndex?: number
  private isGameOver = false
  private currentPosition = 0
  private currentRotation = 0

  constructor(onBoardChange: OnBoardChange) {
    const onGameOver = () => (this.isGameOver = true)
    this.board = new Board(
      onBoardChange,
      onGameOver,
      noop,
      this.getNextShape,
      createEmptyMatrix(13, 16),
    )
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
      await wait(100)
    }
  }

  private async positionShape(): Promise<void> {
    if (typeof this.shapeIndex === "undefined") {
      return
    }

    const shapeRotation = shapes[this.shapeIndex].rotationCount || 0
    while (this.currentRotation < shapeRotation) {
      this.board.rotate()
      this.currentRotation++
      await wait(40)
    }

    const shapePosition = shapes[this.shapeIndex].position
    while (this.currentPosition < shapePosition) {
      this.board.right()
      this.currentPosition++
      await wait(40)
    }

    while (this.currentPosition > shapePosition) {
      this.board.left()
      this.currentPosition--
      await wait(40)
    }
  }
}

class NoShapesLeft {}

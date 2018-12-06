import { Subject, ReplaySubject } from "rxjs"
import { wait } from "../../helpers"
import { Board } from "./board"
import { getNextShape } from "./get-next-shape"
import { createEmptyMatrix } from "./matrix"
import { Score } from "./score"
import { TetrisMatrix } from "./shape"

export interface ScoreChange {
  gained: number
  current: number
}

export class Game {
  private isGameOver = false
  private isForcedGameOver = false
  private board: Board
  private score = new Score()
  private currentLevel = 1

  readonly boardChange: ReplaySubject<TetrisMatrix>
  readonly scoreChange = new Subject<ScoreChange>()
  readonly levelChange = new Subject<number>()

  constructor({
    columnCount,
    rowCount,
  }: {
    columnCount: number
    rowCount: number
  }) {
    this.board = new Board(
      getNextShape,
      createEmptyMatrix(columnCount, rowCount),
    )
    this.boardChange = this.board.boardChange

    this.board.gameOver.subscribe(() => (this.isGameOver = true))
    this.board.rowClear.subscribe((numberOfRowsCleared: number) => {
      const gained = this.score.linesCleared(
        this.currentLevel,
        numberOfRowsCleared,
      )
      const currentScore = this.score.current
      this.currentLevel = Math.floor(currentScore / 500) + 1
      this.scoreChange.next({ gained, current: currentScore })
    })
  }

  forceGameOver() {
    this.isGameOver = true
    this.isForcedGameOver = true
  }

  async start(): Promise<boolean> {
    while (!this.isGameOver) {
      this.board.step()
      await wait(this.mapLevelToTime())
    }

    return this.isForcedGameOver
  }

  private mapLevelToTime(): number {
    const level = this.currentLevel > 10 ? 10 : this.currentLevel
    return -100 * level + 1100
  }

  rotate() {
    if (!this.isGameOver) {
      this.board.rotate()
    }
  }

  left() {
    if (!this.isGameOver) {
      this.board.left()
    }
  }

  right() {
    if (!this.isGameOver) {
      this.board.right()
    }
  }

  down() {
    if (!this.isGameOver) {
      this.board.down()
    }
  }
}

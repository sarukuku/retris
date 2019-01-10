import { ReplaySubject, Subject, interval } from "rxjs"
import { wait } from "../../helpers"
import { Board } from "./board"
import { Difficulty } from "./difficulty"
import { getNextShape } from "./get-next-shape"
import { createEmptyMatrix } from "./matrix"
import { Score } from "./score"
import { TetrisMatrix } from "./shape"

const ONE_SECOND_MS = 1000
const secondsTicker = interval(ONE_SECOND_MS)

export interface ScoreChange {
  gained: number
  current: number
}

export class Game {
  private isGameOver = false
  private isForcedGameOver = false
  private board: Board
  private score = new Score()
  private difficulty = new Difficulty()

  readonly boardChange: ReplaySubject<TetrisMatrix>
  readonly scoreChange = new Subject<ScoreChange>()
  readonly levelChange = new Subject<number>()
  readonly elapsedSecondsChange = new Subject<number>()

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
      const currentLevel = this.difficulty.getCurrentLevel()
      const gained = this.score.linesCleared(currentLevel, numberOfRowsCleared)
      const currentScore = this.score.current
      this.difficulty.updateCurrentLevel(numberOfRowsCleared)
      this.scoreChange.next({ gained, current: currentScore })
    })
  }

  forceGameOver() {
    this.isGameOver = true
    this.isForcedGameOver = true
  }

  async start(): Promise<boolean> {
    let elapsedSeconds = 0
    this.elapsedSecondsChange.next(elapsedSeconds)
    const elapsedSubscription = secondsTicker.subscribe(() => {
      this.elapsedSecondsChange.next(elapsedSeconds)
      elapsedSeconds++
    })

    while (!this.isGameOver) {
      this.board.step()
      await wait(this.difficulty.getStepWaitTimeMS())
    }

    elapsedSubscription.unsubscribe()

    return this.isForcedGameOver
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

  smash() {
    if (!this.isGameOver) {
      this.board.smash()
    }
  }
}

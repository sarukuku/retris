import { wait } from "../../helpers"
import { Board, OnBoardChange } from "./board"
import { getNextShape } from "./get-next-shape"
import { createEmptyMatrix } from "./matrix"
import { Score } from "./score"

export type OnScoreChange = (gained: number, total: number) => void

export class Game {
  private isGameOver = false
  private board: Board
  private score = new Score()
  private currentLevel = 1

  constructor(
    private onBoardChange: OnBoardChange,
    private onScoreChange: OnScoreChange,
    columnCount: number,
    rowCount: number,
  ) {
    this.board = new Board(
      this.onBoardChange,
      () => {
        this.isGameOver = true
      },
      numberOfRowsCleared => {
        const gainedScore = this.score.linesCleared(
          this.currentLevel,
          numberOfRowsCleared,
        )
        this.onScoreChange(gainedScore, this.score.current)
      },
      getNextShape,
      createEmptyMatrix(columnCount, rowCount),
    )
  }

  async start() {
    while (!this.isGameOver) {
      this.board.step()
      await wait(500)
    }
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

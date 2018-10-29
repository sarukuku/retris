import { wait } from "../../helpers"
import { Board, OnBoardChange } from "./board"
import { getNextShape } from "./get-next-shape"
import { createEmptyMatrix } from "./matrix"

export class Game {
  private isGameOver = false
  private board: Board

  constructor(
    private onBoardChange: OnBoardChange,
    columnCount: number,
    rowCount: number,
  ) {
    this.board = new Board(
      this.onBoardChange,
      () => {
        this.isGameOver = true
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

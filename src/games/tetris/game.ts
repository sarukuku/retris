import { wait } from "../../helpers"
import { Board, OnBoardChange } from "./board"
import { getNextShape } from "./get-next-shape"
import { createEmptyMatrix } from "./matrix"
import { Score } from "./score"

export type OnScoreChange = (gained: number, total: number) => void

export type OnLevelChange = (currentLevel: number) => void

const TEN_SECONDS = 10000

export class Game {
  private isGameOver = false
  private board: Board
  private score = new Score()
  private currentLevel = 1
  private onScoreChange: OnScoreChange = () => undefined
  private onBoardChange: OnBoardChange = () => undefined
  private columnCount: number
  private rowCount: number

  constructor({
    columnCount,
    rowCount,
  }: {
    columnCount: number
    rowCount: number
  }) {
    this.rowCount = rowCount
    this.columnCount = columnCount

    const onGameOver = () => (this.isGameOver = true)
    const onRowClear = (numberOfRowsCleared: number) => {
      const gainedScore = this.score.linesCleared(
        this.currentLevel,
        numberOfRowsCleared,
      )
      this.onScoreChange(gainedScore, this.score.current)
    }

    this.board = new Board(
      this.onBoardChange,
      onGameOver,
      onRowClear,
      getNextShape,
      createEmptyMatrix(columnCount, rowCount),
    )
  }

  setOnScoreChange(cb: OnScoreChange) {
    this.onScoreChange = cb
  }

  setOnBoardChange(cb: OnBoardChange) {
    this.onBoardChange = cb
    this.board.setOnBoardChange(cb)
  }

  getRowCount(): number {
    return this.rowCount
  }

  getColumnCount(): number {
    return this.columnCount
  }

  async start() {
    const handle = setInterval(this.increaseLevel, TEN_SECONDS)

    while (!this.isGameOver) {
      this.board.step()
      await wait(this.mapLevelToTime())
    }

    clearInterval(handle)
  }

  private increaseLevel = () => {
    this.currentLevel++
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

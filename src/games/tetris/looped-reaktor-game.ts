import { ReplaySubject } from "rxjs"
import { ReaktorGame } from "./reaktor-game"
import { TetrisMatrix } from "./shape"

export class LoopedReaktorGame {
  private reaktorGame = new ReaktorGame()
  boardChange = new ReplaySubject<TetrisMatrix>()

  getColumnCount = () => this.reaktorGame.getColumnCount()

  getRowCount = () => this.reaktorGame.getRowCount()

  async start() {
    let subscripiton = this.reaktorGame.boardChange.subscribe(board =>
      this.boardChange.next(board),
    )
    while (true) {
      await this.reaktorGame.start()
      subscripiton.unsubscribe()
      this.reaktorGame = new ReaktorGame()
      subscripiton = this.reaktorGame.boardChange.subscribe(board =>
        this.boardChange.next(board),
      )
    }
  }
}

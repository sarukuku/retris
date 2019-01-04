import { Subject } from "rxjs"
import { ReaktorGame } from "./reaktor-game"
import { TetrisMatrix } from "./shape"

export class LoopedReaktorGame {
  private reaktorGame = new ReaktorGame()
  boardChange = new Subject<TetrisMatrix>()
  private isRunning = true

  async start() {
    let subscription = this.reaktorGame.boardChange.subscribe(board =>
      this.boardChange.next(board),
    )
    while (this.isRunning) {
      await this.reaktorGame.start()
      subscription.unsubscribe()
      this.reaktorGame.unsubscribe()
      this.reaktorGame = new ReaktorGame()
      subscription = this.reaktorGame.boardChange.subscribe(board =>
        this.boardChange.next(board),
      )
    }
  }

  stop() {
    this.isRunning = false
  }
}

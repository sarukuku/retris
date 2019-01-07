import { last } from "ramda"

const waitTimes = [
  800,
  720,
  630,
  550,
  470,
  380,
  300,
  220,
  130,
  100,
  80,
  70,
  50,
  30,
  20,
]

export class Difficulty {
  private currentLevel = 0
  private totalLinesCleared = 0

  getStepWaitTimeMS(): number {
    const currentWait = waitTimes[this.currentLevel]
    if (typeof currentWait === "undefined") {
      return last(waitTimes)!
    }

    return currentWait
  }

  updateCurrentLevel(linesCleared: number) {
    this.totalLinesCleared += linesCleared
    this.currentLevel = Math.floor(this.totalLinesCleared / 2)
  }

  getCurrentLevel(): number {
    return this.currentLevel
  }
}

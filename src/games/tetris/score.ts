export class Score {
  private _current = 0

  linesCleared(level: number, numberOfLines: number): number {
    const numberOfLinesMultiplier = this.getMultiplier(numberOfLines)
    const gained = numberOfLinesMultiplier * (level + 1)
    this._current += gained
    return gained
  }

  get current(): number {
    return this._current
  }

  private getMultiplier(numberOfLines: number): number {
    switch (numberOfLines) {
      case 1:
        return 40
      case 2:
        return 100
      case 3:
        return 300
      case 4:
        return 1200
      default:
        return 0
    }
  }
}

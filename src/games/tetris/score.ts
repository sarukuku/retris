export class Score {
  private current = 0

  linesCleared(level: number, numberOfLines: number): number {
    const numberOfLinesMultiplier = this.getMultiplier(numberOfLines)
    this.current += numberOfLinesMultiplier * level
    return this.current
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

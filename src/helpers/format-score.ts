export function formatScore(score: number): string {
  return String(score)
    .split("")
    .reverse()
    .map((scoreNumber, index) => {
      if (index === 0 || index % 3 !== 0) {
        return scoreNumber
      }
      return `${scoreNumber},`
    })
    .reverse()
    .join("")
}

export function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${pad(minutes)}:${pad(sec)}`
}

function pad(num: number): string {
  return String(num).padStart(2, "0")
}

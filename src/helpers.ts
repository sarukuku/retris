export const isBrowser = () => {
  return typeof window !== "undefined"
}

export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const pick = <T>(arr: T[]): T => {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

export const isBrowser = () => {
  return typeof window !== "undefined"
}

export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

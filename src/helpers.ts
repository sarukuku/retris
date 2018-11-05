import FontFaceObserver from "fontfaceobserver"
import { fonts } from "./styles/fonts"

export const isBrowser = () => {
  return typeof window !== "undefined"
}

export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const pick = <T>(arr: T[]): T => {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

export async function loadFonts(): Promise<void> {
  await Promise.all(
    Object.values(fonts).map(font => new FontFaceObserver(font).load()),
  )
}

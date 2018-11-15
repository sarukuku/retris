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

interface Response {
  text(): Promise<string | undefined>
}

export async function parseJSON(res: Response): Promise<any> {
  const text = await res.text()
  if (!text) {
    return undefined
  }

  let json: any
  try {
    json = JSON.parse(text)
  } catch (err) {
    return undefined
  }

  return json
}

export function onPageVisibilityChange(handler: (isVisible: boolean) => void) {
  const hiddenProperty =
    "hidden" in document
      ? "hidden"
      : "webkitHidden" in document
        ? "webkitHidden"
        : "mozHidden" in document
          ? "mozHidden"
          : null

  const visibilityStateProperty =
    "visibilityState" in document
      ? "visibilityState"
      : "webkitVisibilityState" in document
        ? "webkitVisibilityState"
        : "mozVisibilityState" in document
          ? "mozVisibilityState"
          : null

  if (hiddenProperty === null || visibilityStateProperty === null) {
    return
  }

  const visibilityChangeEvent = hiddenProperty.replace(
    /hidden/i,
    "visibilitychange",
  )
  document.addEventListener(visibilityChangeEvent, onVisibilityChange)

  const doc = document as any
  function onVisibilityChange() {
    handler(doc[hiddenProperty as string])
  }

  return () =>
    document.removeEventListener(visibilityChangeEvent, onVisibilityChange)
}

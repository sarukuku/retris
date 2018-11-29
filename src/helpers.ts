export const isBrowser = () => {
  return typeof window !== "undefined"
}

export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const pick = <T>(arr: T[]): T => {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
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

export function svgToImage(svg: SVGElement): HTMLImageElement {
  const img = new Image()
  const b64Prefix = "data:image/svg+xml;base64,"
  const b64Image = btoa(new XMLSerializer().serializeToString(svg))
  img.src = `${b64Prefix}${b64Image}`
  return img
}

export function svgToImage(svg: SVGElement): HTMLImageElement {
  const img = new Image()
  const b64Prefix = "data:image/svg+xml;base64,"
  const b64Image = btoa(new XMLSerializer().serializeToString(svg))
  img.src = `${b64Prefix}${b64Image}`
  return img
}

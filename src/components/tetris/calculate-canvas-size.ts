interface Dimension {
  width: number
  height: number
}

interface Input {
  parent: Dimension
  aspectRatio: number
}

export function calculateCanvasSize({ parent, aspectRatio }: Input): Dimension {
  const isParentPortrait = parent.height > parent.width
  if (isParentPortrait) {
    return normalize(parent, {
      height: parent.width / aspectRatio,
      width: parent.width,
    })
  }

  const isParentLandscape = parent.height < parent.width
  const isChildPortrait = aspectRatio < 1
  if (isParentLandscape || isChildPortrait) {
    return normalize(parent, {
      height: parent.height,
      width: parent.height * aspectRatio,
    })
  }

  return normalize(parent, {
    width: parent.width,
    height: parent.width / aspectRatio,
  })
}

function normalize(parent: Dimension, child: Dimension): Dimension {
  if (child.height > parent.height) {
    return {
      height: parent.height,
      width: (child.width / child.height) * parent.height,
    }
  }

  if (child.width > parent.width) {
    return {
      width: parent.width,
      height: (child.height / child.width) * parent.width,
    }
  }

  return child
}

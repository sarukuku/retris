import { times } from "ramda"
import { pick } from "../../helpers"
import { colors } from "../../styles/colors"
import { Shape } from "./shape"

export type GetNextShape = () => Shape

export function getNextShape(): Shape {
  const { createShape, color } = pick(shapes)
  const shape = createShape(color)

  const rotationAmount = pick(rotationAmounts)
  times(() => shape.rotate(), rotationAmount)

  return shape
}

const shapes = [
  { createShape: Shape.createIShape, color: colors.PETER_RIVER },
  { createShape: Shape.createJShape, color: colors.SUNFLOWER },
  { createShape: Shape.createLShape, color: colors.AMETHYST },
  { createShape: Shape.createOShape, color: colors.ALIZARIN },
  { createShape: Shape.createSShape, color: colors.EMERALD },
  { createShape: Shape.createTShape, color: colors.WET_ASPHALT },
  { createShape: Shape.createZShape, color: colors.CARROT },
]

const rotationAmounts = [0, 1, 2, 3]

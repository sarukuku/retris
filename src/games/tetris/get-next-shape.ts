import { times } from "ramda"
import { pick } from "../../helpers"
import {
  AMETHYST,
  CARROT,
  EMERALD,
  PETER_RIVER,
  WET_ASPHALT,
  ALIZARIN,
  SUNFLOWER,
} from "../../styles/colors"
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
  { createShape: Shape.createIShape, color: PETER_RIVER },
  { createShape: Shape.createJShape, color: SUNFLOWER },
  { createShape: Shape.createLShape, color: AMETHYST },
  { createShape: Shape.createOShape, color: ALIZARIN },
  { createShape: Shape.createSShape, color: EMERALD },
  { createShape: Shape.createTShape, color: WET_ASPHALT },
  { createShape: Shape.createZShape, color: CARROT },
]

const rotationAmounts = [0, 1, 2, 3]

import { times } from "ramda"
import { pick } from "../../helpers"
import { Shape } from "./shape"

export type GetNextShape = () => Shape

export function getNextShape(): Shape {
  const createShape = pick(shapes)
  const shape = createShape()

  const rotationAmount = pick(rotationAmounts)
  times(() => shape.rotate(), rotationAmount)

  return shape
}

const shapes = [
  Shape.createIShape,
  Shape.createJShape,
  Shape.createLShape,
  Shape.createOShape,
  Shape.createSShape,
  Shape.createTShape,
  Shape.createZShape,
]

const rotationAmounts = [0, 1, 2, 3]

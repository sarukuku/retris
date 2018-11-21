import { times } from "ramda"
import { pick } from "../../helpers"
import { Shape } from "./shape"

export type GetNextShape = () => Shape

export function getNextShape(): Shape {
  const { createShape, color } = pick(shapes)
  const shape = createShape(color)

  const rotationAmount = pick(rotationAmounts)
  times(() => shape.rotate(), rotationAmount)

  return shape
}

const gradients = {
  GREEN: ["#0aff00", "#00edff"],
  WHITE: ["#ffffff", "#92baff"],
  BLUE: ["#4dffff", "#0a34af"],
  ORANGE: ["#fad961", "#f76b1c"],
  LIGHT_BLUE: ["#1fddff", "#21a0ff"],
  RED: ["#ff4396", "#ff292c"],
  PURPLE: ["#3023ae", "#c86dd7"]
}

const shapes = [
  { createShape: Shape.createIShape, color: gradients.GREEN },
  { createShape: Shape.createJShape, color: gradients.WHITE },
  { createShape: Shape.createLShape, color: gradients.BLUE },
  { createShape: Shape.createOShape, color: gradients.ORANGE},
  { createShape: Shape.createSShape, color: gradients.LIGHT_BLUE },
  { createShape: Shape.createTShape, color: gradients.RED },
  { createShape: Shape.createZShape, color: gradients.PURPLE },
]

const rotationAmounts = [0, 1, 2, 3]

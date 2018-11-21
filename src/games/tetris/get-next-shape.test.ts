import { getNextShape } from "./get-next-shape"
import { Shape } from "./shape"

const originalRandom = Math.random
afterAll(() => {
  Math.random = originalRandom
})

test("generate random shape with color", () => {
  Math.random = () => 0
  const createFirstShape = Shape.createIShape
  const greenGradient = ["#0aff00", "#00edff"]
  const expectedShape = createFirstShape(greenGradient)

  const shape = getNextShape()

  expect(shape).toEqual(expectedShape)
})

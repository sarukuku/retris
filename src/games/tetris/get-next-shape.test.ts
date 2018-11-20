import { getNextShape } from "./get-next-shape"
import { Shape } from "./shape"

const originalRandom = Math.random
afterAll(() => {
  Math.random = originalRandom
})

test("generate random shape with color", () => {
  Math.random = () => 0
  const createFirstShape = Shape.createIShape
  const redGradient = ["#ff4396", "#ff292c"]
  const expectedShape = createFirstShape(redGradient)

  const shape = getNextShape()

  expect(shape).toEqual(expectedShape)
})

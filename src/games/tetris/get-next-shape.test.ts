import { PETER_RIVER } from "../../styles/colors"
import { getNextShape } from "./get-next-shape"
import { Shape } from "./shape"

const originalRandom = Math.random
afterAll(() => {
  Math.random = originalRandom
})

test("generate random shape with color", () => {
  Math.random = () => 0
  const createFirstShape = Shape.createIShape
  const expectedShape = createFirstShape(PETER_RIVER)

  const shape = getNextShape()

  expect(shape).toEqual(expectedShape)
})

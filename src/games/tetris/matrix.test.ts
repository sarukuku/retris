import { rotateMatrix, rotateCounterClockwise } from "./matrix"

test("rotate clockwise", () => {
  const matrix = [
    [1, 2, 3], //
    [4, 5, 6],
    [7, 8, 9],
  ]

  const expectedMatrix = [
    [7, 4, 1], //
    [8, 5, 2],
    [9, 6, 3],
  ]

  expect(rotateMatrix(matrix)).toEqual(expectedMatrix)
})

test("rotate counter clockwise", () => {
  const matrix = [
    [7, 4, 1], //
    [8, 5, 2],
    [9, 6, 3],
  ]

  const expectedMatrix = [
    [1, 2, 3], //
    [4, 5, 6],
    [7, 8, 9],
  ]

  expect(rotateCounterClockwise(matrix)).toEqual(expectedMatrix)
})

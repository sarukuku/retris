import { Score } from "./score"

test("invalid line clear", () => {
  const score = new Score()
  const level = 1
  const numberOfLines = -1

  const result = score.linesCleared(level, numberOfLines)

  expect(result).toBe(0)
})

test("single line clear", () => {
  const score = new Score()
  const level = 1
  const numberOfLines = 1

  const result = score.linesCleared(level, numberOfLines)

  expect(result).toBe(40)
})

test("consecutive single line clears", () => {
  const score = new Score()
  const level = 1
  const numberOfLines = 1

  score.linesCleared(level, numberOfLines)
  score.linesCleared(level, numberOfLines)
  const result = score.linesCleared(level, numberOfLines)

  expect(result).toBe(120)
})

test("multi line clear", () => {
  const score = new Score()
  const level = 1
  const numberOfLines = 4

  const result = score.linesCleared(level, numberOfLines)

  expect(result).toBe(1200)
})

test("higher level line clear", () => {
  const score = new Score()
  const level = 10
  const numberOfLines = 1

  const result = score.linesCleared(level, numberOfLines)

  expect(result).toBe(400)
})

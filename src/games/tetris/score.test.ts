import { Score } from "./score"

test("invalid line clear", () => {
  const score = new Score()
  const level = 1
  const numberOfLines = -1

  const gained = score.linesCleared(level, numberOfLines)

  expect(gained).toBe(0)
  expect(score.current).toBe(0)
})

test("single line clear", () => {
  const score = new Score()
  const level = 1
  const numberOfLines = 1

  const gained = score.linesCleared(level, numberOfLines)

  expect(gained).toBe(40)
  expect(score.current).toBe(40)
})

test("consecutive single line clears", () => {
  const score = new Score()
  const level = 1
  const numberOfLines = 1

  score.linesCleared(level, numberOfLines)
  score.linesCleared(level, numberOfLines)
  const gained = score.linesCleared(level, numberOfLines)

  expect(gained).toBe(40)
  expect(score.current).toBe(120)
})

test("multi line clear", () => {
  const score = new Score()
  const level = 1
  const numberOfLines = 4

  const gained = score.linesCleared(level, numberOfLines)

  expect(gained).toBe(1200)
  expect(score.current).toBe(1200)
})

test("higher level line clear", () => {
  const score = new Score()
  const level = 10
  const numberOfLines = 1

  const gained = score.linesCleared(level, numberOfLines)

  expect(gained).toBe(400)
  expect(score.current).toBe(400)
})

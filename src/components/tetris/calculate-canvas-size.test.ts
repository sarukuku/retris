import { calculateCanvasSize } from "./calculate-canvas-size"

test("parent portrait, child portrait", () => {
  const parent = { width: 1000, height: 2000 }
  const aspectRatio = 1 / 2

  const { width, height } = calculateCanvasSize({
    parent,
    aspectRatio,
  })

  expect(width).toBe(parent.width)
  expect(height).toBe(parent.width / aspectRatio)
})

test("parent portrait, child landscape", () => {
  const parent = { width: 1000, height: 2000 }
  const aspectRatio = 2 / 1

  const { width, height } = calculateCanvasSize({
    parent,
    aspectRatio,
  })

  expect(width).toBe(parent.width)
  expect(height).toBe(parent.width / aspectRatio)
})

test("parent portrait, child equal", () => {
  const parent = { width: 1000, height: 2000 }
  const aspectRatio = 1

  const { width, height } = calculateCanvasSize({
    parent,
    aspectRatio,
  })

  expect(width).toBe(parent.width)
  expect(height).toBe(parent.width)
})

test("parent landscape, child landscape", () => {
  const parent = { width: 2000, height: 1000 }
  const aspectRatio = 2 / 1

  const { width, height } = calculateCanvasSize({
    parent,
    aspectRatio,
  })

  expect(height).toBe(parent.height)
  expect(width).toBe(parent.height * aspectRatio)
})

test("parent landscape, child portrait", () => {
  const parent = { width: 2000, height: 1000 }
  const aspectRatio = 1 / 2

  const { width, height } = calculateCanvasSize({
    parent,
    aspectRatio,
  })

  expect(height).toBe(parent.height)
  expect(width).toBe(parent.height * aspectRatio)
})

test("parent landscape, child equal", () => {
  const parent = { width: 2000, height: 1000 }
  const aspectRatio = 1

  const { width, height } = calculateCanvasSize({
    parent,
    aspectRatio,
  })

  expect(height).toBe(parent.height)
  expect(width).toBe(parent.height)
})

test("parent equal, child portrait", () => {
  const parent = { width: 1000, height: 1000 }
  const aspectRatio = 1 / 2

  const { width, height } = calculateCanvasSize({
    parent,
    aspectRatio,
  })

  expect(height).toBe(parent.height)
  expect(width).toBe(parent.height * aspectRatio)
})

test("parent equal, child landscape", () => {
  const parent = { width: 1000, height: 1000 }
  const aspectRatio = 2 / 1

  const { width, height } = calculateCanvasSize({
    parent,
    aspectRatio,
  })

  expect(width).toBe(parent.width)
  expect(height).toBe(parent.width / aspectRatio)
})

test("parent equal, child equal", () => {
  const parent = { width: 1000, height: 1000 }
  const aspectRatio = 1

  const { width, height } = calculateCanvasSize({
    parent,
    aspectRatio,
  })

  expect(width).toBe(parent.width)
  expect(height).toBe(parent.width)
})

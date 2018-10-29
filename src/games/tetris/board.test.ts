import { Board, OnBoardChange, OnGameOver, Active } from "./board"
import { getNextShape as _getNextShape, GetNextShape } from "./get-next-shape"
import { createEmptyMatrix } from "./matrix"
import { Shape, ShapeMatrix } from "./shape"

const _ = undefined

test("initialize board", () => {
  const onBoardChange = jest.fn()
  createBoard({ onBoardChange, matrix: createEmptyMatrix(3, 2) })

  const expectedBoard = [
    [_, _, _], //
    [_, _, _],
  ]

  expect(onBoardChange).toHaveBeenCalledWith(expectedBoard)
})

test("add shape to board", () => {
  const color = "red"
  const onBoardChange = jest.fn()
  const board = createBoard({
    onBoardChange,
    getNextShape: () => Shape.createIShape(color),
  })

  board.step()

  const o = { color }
  const expectedBoard = [
    [_, _, _, _, _, _, o, _, _, _], //
    [_, _, _, _, _, _, o, _, _, _],
    [_, _, _, _, _, _, o, _, _, _],
    [_, _, _, _, _, _, o, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("3 steps", () => {
  const color = "red"
  const onBoardChange = jest.fn()
  const board = createBoard({
    getNextShape: () => Shape.createTShape(color),
    onBoardChange,
  })

  board.step()
  board.step()
  board.step()

  const o = { color }
  const expectedBoard = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, o, _, _, _, _],
    [_, _, _, _, o, o, o, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("2 steps and a rotation", () => {
  const color = "red"
  const onBoardChange = jest.fn()
  const board = createBoard({
    getNextShape: () => Shape.createZShape(color),
    onBoardChange,
  })

  board.step()
  board.step()
  board.rotate()

  const o = { color }
  const expectedBoard = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, o, _, _, _],
    [_, _, _, _, _, o, o, _, _, _],
    [_, _, _, _, _, o, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("a step and 2 lefts", () => {
  const color = "red"
  const onBoardChange = jest.fn()
  const board = createBoard({
    getNextShape: () => Shape.createSShape(color),
    onBoardChange,
  })

  board.step()
  board.left()
  board.left()

  const o = { color }
  const expectedBoard = [
    [_, _, _, o, o, _, _, _, _, _], //
    [_, _, o, o, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("a step and 2 right", () => {
  const color = "red"
  const onBoardChange = jest.fn()
  const board = createBoard({
    getNextShape: () => Shape.createOShape(color),
    onBoardChange,
  })

  board.step()
  board.right()
  board.right()

  const o = { color }
  const expectedBoard = [
    [_, _, _, _, _, _, o, o, _, _], //
    [_, _, _, _, _, _, o, o, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("a step and 2 down", () => {
  const color = "red"
  const onBoardChange = jest.fn()
  const board = createBoard({
    getNextShape: () => Shape.createOShape(color),
    onBoardChange,
  })

  board.step()
  board.down()
  board.down()

  const o = { color }
  const expectedBoard = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, o, o, _, _, _, _],
    [_, _, _, _, o, o, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active reached bottom", () => {
  const color = "red"
  const o = { color }
  const onBoardChange = jest.fn()
  const bottomOfBoard = { x: 4, y: 8 }
  const board = createBoard({
    onBoardChange,
    active: {
      position: bottomOfBoard,
      shape: Shape.createOShape(color),
    },
  })

  board.step()

  const expectedBoard = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, o, o, _, _, _, _],
    [_, _, _, _, o, o, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active reached bottom (shape already present)", () => {
  const o = { color: "red" }
  const onBoardChange = jest.fn()
  const initialMatrix = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, o, _, _, _, _, _],
  ]
  const aboveInitialCell = {
    x: 4,
    y: 7,
  }
  const board = createBoard({
    onBoardChange,
    matrix: initialMatrix,
    active: {
      position: aboveInitialCell,
      shape: Shape.createOShape(o.color),
    },
  })

  board.step()

  const expectedBoard = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, o, o, _, _, _, _],
    [_, _, _, _, o, o, _, _, _, _],
    [_, _, _, _, o, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active reached bottom but dodges to the left", () => {
  const o = { color: "red" }
  const onBoardChange = jest.fn()
  const initialMatrix = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, o, _, _, _, _],
  ]
  const aboveInitialCell = {
    x: 4,
    y: 7,
  }
  const board = createBoard({
    onBoardChange,
    matrix: initialMatrix,
    active: {
      position: aboveInitialCell,
      shape: Shape.createOShape(o.color),
    },
  })

  board.step()
  board.left()
  board.step()

  const expectedBoard = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, o, o, _, _, _, _, _],
    [_, _, _, o, o, o, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active reached bottom twice, new shape spawns", () => {
  const o = { color: "red" }
  const onBoardChange = jest.fn()
  const bottomOfBoard = { x: 4, y: 8 }
  const board = createBoard({
    onBoardChange,
    active: {
      position: bottomOfBoard,
      shape: Shape.createOShape(o.color),
    },
    getNextShape: () => Shape.createIShape(o.color),
  })

  board.step()
  board.step()
  board.step()

  const expectedBoard = [
    [_, _, _, _, _, _, o, _, _, _], //
    [_, _, _, _, _, _, o, _, _, _],
    [_, _, _, _, _, _, o, _, _, _],
    [_, _, _, _, _, _, o, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, o, o, _, _, _, _],
    [_, _, _, _, o, o, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active can't go right due to edge", () => {
  const color = "red"
  const o = { color }
  const onBoardChange = jest.fn()
  const rightOfBoard = { x: 7, y: 0 }
  const board = createBoard({
    onBoardChange,
    active: {
      position: rightOfBoard,
      shape: Shape.createIShape(color),
    },
  })

  board.right()

  const expectedBoard = [
    [_, _, _, _, _, _, _, _, _, o], //
    [_, _, _, _, _, _, _, _, _, o],
    [_, _, _, _, _, _, _, _, _, o],
    [_, _, _, _, _, _, _, _, _, o],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active can't go right due to occupied cell", () => {
  const color = "red"
  const o = { color }
  const onBoardChange = jest.fn()
  const rightOfBoard = { x: 6, y: 0 }
  const initialMatrix = [
    [_, _, _, _, _, _, _, _, _, o], //
    [_, _, _, _, _, _, _, _, _, o],
    [_, _, _, _, _, _, _, _, _, o],
    [_, _, _, _, _, _, _, _, _, o],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]
  const board = createBoard({
    matrix: initialMatrix,
    onBoardChange,
    active: {
      position: rightOfBoard,
      shape: Shape.createIShape(color),
    },
  })

  board.right()

  const expectedBoard = [
    [_, _, _, _, _, _, _, _, o, o], //
    [_, _, _, _, _, _, _, _, o, o],
    [_, _, _, _, _, _, _, _, o, o],
    [_, _, _, _, _, _, _, _, o, o],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active can't go left due to edge", () => {
  const color = "red"
  const o = { color }
  const onBoardChange = jest.fn()
  const leftOfBoard = { x: 0, y: 0 }
  const board = createBoard({
    onBoardChange,
    active: {
      position: leftOfBoard,
      shape: Shape.createZShape(color),
    },
  })

  board.left()

  const expectedBoard = [
    [o, o, _, _, _, _, _, _, _, _], //
    [_, o, o, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active can't go left due to occupied cell", () => {
  const color = "red"
  const o = { color }
  const onBoardChange = jest.fn()
  const leftOfBoard = { x: 1, y: 0 }
  const initialMatrix = [
    [_, o, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]
  const board = createBoard({
    matrix: initialMatrix,
    onBoardChange,
    active: {
      position: leftOfBoard,
      shape: Shape.createTShape(color),
    },
  })

  board.left()

  const expectedBoard = [
    [_, o, o, _, _, _, _, _, _, _], //
    [_, o, o, o, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active can't go down due to edge", () => {
  const color = "red"
  const o = { color }
  const onBoardChange = jest.fn()
  const bottomOfBoard = { x: 0, y: 8 }
  const board = createBoard({
    onBoardChange,
    active: {
      position: bottomOfBoard,
      shape: Shape.createOShape(color),
    },
  })

  board.down()

  const expectedBoard = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [o, o, _, _, _, _, _, _, _, _],
    [o, o, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active can't go down due to occupied cell", () => {
  const color = "red"
  const o = { color }
  const onBoardChange = jest.fn()
  const leftOfBoard = { x: 0, y: 0 }
  const initialMatrix = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, o, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]
  const board = createBoard({
    matrix: initialMatrix,
    onBoardChange,
    active: {
      position: leftOfBoard,
      shape: Shape.createIShape(color),
    },
  })

  board.down()

  const expectedBoard = [
    [_, _, o, _, _, _, _, _, _, _], //
    [_, _, o, _, _, _, _, _, _, _],
    [_, _, o, _, _, _, _, _, _, _],
    [_, _, o, _, _, _, _, _, _, _],
    [_, _, o, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active can't rotate due to edge", () => {
  const color = "red"
  const o = { color }
  const onBoardChange = jest.fn()
  const leftOfBoard = { x: -2, y: 0 }
  const board = createBoard({
    onBoardChange,
    active: {
      position: leftOfBoard,
      shape: Shape.createIShape(color),
    },
  })

  board.rotate()

  const expectedBoard = [
    [o, _, _, _, _, _, _, _, _, _], //
    [o, _, _, _, _, _, _, _, _, _],
    [o, _, _, _, _, _, _, _, _, _],
    [o, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("active can't rotate due to occupied cell", () => {
  const color = "red"
  const o = { color }
  const onBoardChange = jest.fn()
  const initialMatrix = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, o, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]
  const leftOfBoard = { x: 0, y: 0 }
  const board = createBoard({
    matrix: initialMatrix,
    onBoardChange,
    active: {
      position: leftOfBoard,
      shape: Shape.createIShape(color),
    },
  })

  board.rotate()

  const expectedBoard = [
    [_, _, o, _, _, _, _, _, _, _], //
    [_, _, o, _, _, _, _, _, _, _],
    [_, o, o, _, _, _, _, _, _, _],
    [_, _, o, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

test("row disappears if full", () => {
  const color = "red"
  const o = { color }
  const onBoardChange = jest.fn()
  const initialMatrix = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [o, o, _, o, o, o, o, o, o, o],
  ]
  const leftOfBoard = { x: 0, y: 6 }
  const board = createBoard({
    matrix: initialMatrix,
    onBoardChange,
    active: {
      position: leftOfBoard,
      shape: Shape.createIShape(color),
    },
  })

  board.step()
  board.step()

  const expectedBoard = [
    [_, _, _, _, _, _, _, _, _, _], //
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
    [_, _, o, _, _, _, _, _, _, _],
    [_, _, o, _, _, _, _, _, _, _],
    [_, _, o, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _],
  ]

  expect(onBoardChange).toHaveBeenLastCalledWith(expectedBoard)
})

interface CreateBoardOptions {
  getNextShape?: GetNextShape
  onBoardChange?: OnBoardChange
  onGameOver?: OnGameOver
  matrix?: ShapeMatrix
  active?: Active
}

function createBoard({
  getNextShape = _getNextShape,
  onBoardChange = (_board: ShapeMatrix) => {
    return
  },
  onGameOver = () => {
    return
  },
  matrix = createEmptyMatrix(10, 10),
  active,
}: CreateBoardOptions = {}) {
  return new Board(onBoardChange, onGameOver, getNextShape, matrix, active)
}

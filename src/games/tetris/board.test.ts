import { Board } from "./board"
import { getNextShape as _getNextShape } from "./get-next-shape"
import { Matrix, createEmptyMatrix } from "./matrix"
import { Shape } from "./shape"

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

test("observe board after 3 steps", () => {
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

test("observe board after 2 steps and a rotation", () => {
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

test("observe board after a step and 2 lefts", () => {
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

test("observe board after a step and 2 right", () => {
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

test("observe board after a step and 2 down", () => {
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

function createBoard({
  getNextShape = _getNextShape,
  onBoardChange = (_board: Matrix) => {
    return
  },
  onboardOver = () => {
    return
  },
  matrix = createEmptyMatrix(10, 10),
} = {}) {
  return new Board(onBoardChange, onboardOver, getNextShape, matrix)
}

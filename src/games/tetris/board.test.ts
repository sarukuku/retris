import { Board } from "./board"
import { getNextShape as _getNextShape } from "./get-next-shape"
import { Matrix } from "./matrix"
import { Shape } from "./shape"

const _ = undefined

test("initialize board", () => {
  const onBoardChange = jest.fn()
  createBoard({ columnCount: 3, rowCount: 2, onBoardChange })

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
    columnCount: 10,
    rowCount: 10,
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
    columnCount: 10,
    rowCount: 10,
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
    columnCount: 10,
    rowCount: 10,
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
    columnCount: 10,
    rowCount: 10,
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
    columnCount: 10,
    rowCount: 10,
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
    columnCount: 10,
    rowCount: 10,
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
  columnCount = 10,
  rowCount = 10,
  getNextShape = _getNextShape,
  onBoardChange = (_board: Matrix) => {
    return
  },
  onboardOver = () => {
    return
  },
} = {}) {
  return new Board(
    columnCount,
    rowCount,
    onBoardChange,
    onboardOver,
    getNextShape,
  )
}

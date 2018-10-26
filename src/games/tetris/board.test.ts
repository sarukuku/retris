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
  const game = createBoard({
    columnCount: 10,
    rowCount: 10,
    getNextShape: () => Shape.createTShape(color),
    onBoardChange,
  })

  game.step()
  game.step()
  game.step()

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

function createBoard({
  columnCount = 10,
  rowCount = 10,
  getNextShape = _getNextShape,
  onBoardChange = (_board: Matrix) => {
    return
  },
  onGameOver = () => {
    return
  },
} = {}) {
  return new Board(
    columnCount,
    rowCount,
    onBoardChange,
    onGameOver,
    getNextShape,
  )
}

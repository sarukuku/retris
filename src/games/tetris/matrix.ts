import { always, times, transpose } from "ramda"

interface Cell {
  color: string
}

export type Row = Array<Cell | undefined>

export type Matrix = Row[]

export function createEmptyMatrix(
  columnCount: number,
  rowCount: number,
): Matrix {
  return times(() => times(always(undefined), columnCount), rowCount)
}

export function rotateMatrix(matrix: Matrix) {
  return reverseColumns(transpose(matrix))
}

function reverseColumns(matrix: Matrix): Matrix {
  return matrix.map(row => row.reverse())
}

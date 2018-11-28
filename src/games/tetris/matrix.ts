import { always, times, transpose } from "ramda"

export type Row<T> = Array<T | undefined>

export type Matrix<T> = Array<Row<T>>

export function createEmptyMatrix<T>(
  _columnCount: number,
  _rowCount: number,
): Matrix<T> {
  return times(() => createEmptyRow(_columnCount), _rowCount)
}

export function createEmptyRow<T>(_columnCount: number): Row<T> {
  return times(always(undefined), _columnCount)
}

export function rotateMatrix<T>(matrix: Matrix<T>): Matrix<T> {
  return reverseColumns(transpose(matrix))
}

export function rotateCounterClockwise<T>(matrix: Matrix<T>): Matrix<T> {
  return transpose(reverseColumns(matrix))
}

function reverseColumns<T>(matrix: Matrix<T>): Matrix<T> {
  return matrix.map(row => row.reverse())
}

export function rowCount<T>(matrix: Matrix<T>): number {
  return matrix.length
}

export function columnCount<T>(matrix: Matrix<T>): number {
  const firstRow = matrix[0]

  if (!firstRow) {
    return 0
  }

  return firstRow.length
}

import { always, times, transpose } from "ramda"

export type Row<T> = Array<T | undefined>

export type Matrix<T> = Array<Row<T>>

export function createEmptyMatrix<T>(
  columnCount: number,
  rowCount: number,
): Matrix<T> {
  return times(() => times(always(undefined), columnCount), rowCount)
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

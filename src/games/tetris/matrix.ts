import { always, times } from "ramda"

interface Cell {
  color: string
}

type Row = Array<Cell | undefined>

export type Matrix = Row[]

export function createEmptyMatrix(
  columnCount: number,
  rowCount: number,
): Matrix {
  return times(() => times(always(undefined), columnCount), rowCount)
}

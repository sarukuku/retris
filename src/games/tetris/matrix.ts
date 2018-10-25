interface Cell {
  color: string
}

type Row = Array<Cell | undefined>

export type Matrix = Row[]

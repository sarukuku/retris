import { transpose } from "ramda"
import { Matrix, rotateMatrix, Row } from "./matrix"

const _ = undefined

interface TetrisCell {
  color: string
}

export interface Position {
  x: number
  y: number
}

export type TetrisMatrix = Matrix<TetrisCell>

export type TetrisRow = Row<TetrisCell>

export class Shape {
  constructor(public matrix: TetrisMatrix) {}

  rotate() {
    this.matrix = rotateMatrix(this.matrix)
  }

  getPositions(): Position[] {
    const positions: Position[] = []
    this.matrix.forEach((row, rowIndex) =>
      row.forEach((cell, columnIndex) => {
        if (!cell) {
          return
        }
        positions.push({
          x: columnIndex,
          y: rowIndex,
        })
      }),
    )
    return positions
  }

  static createIShape(color: string) {
    const x = { color }
    return new IShape([
      [_, _, x, _], //
      [_, _, x, _],
      [_, _, x, _],
      [_, _, x, _],
    ])
  }

  static createJShape(color: string) {
    const x = { color }
    return new Shape([
      [_, x, _], //
      [_, x, _],
      [x, x, _],
    ])
  }

  static createLShape(color: string) {
    const x = { color }
    return new Shape([
      [_, x, _], //
      [_, x, _],
      [_, x, x],
    ])
  }

  static createOShape(color: string) {
    const x = { color }
    return new Shape([
      [x, x], //
      [x, x],
    ])
  }

  static createSShape(color: string) {
    const x = { color }
    return new Shape([
      [_, x, x], //
      [x, x, _],
      [_, _, _],
    ])
  }

  static createTShape(color: string) {
    const x = { color }
    return new Shape([
      [_, x, _], //
      [x, x, x],
      [_, _, _],
    ])
  }

  static createZShape(color: string) {
    const x = { color }
    return new Shape([
      [x, x, _], //
      [_, x, x],
      [_, _, _],
    ])
  }
}

class IShape extends Shape {
  rotate() {
    this.matrix = transpose(this.matrix)
  }
}

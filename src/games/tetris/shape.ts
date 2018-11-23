import { transpose } from "ramda"
import { colorGradients } from "../../styles/colors"
import { Matrix, rotateMatrix, Row } from "./matrix"

const _ = undefined

interface TetrisCell {
  color: string[]
}

export interface Position {
  x: number
  y: number
}

export type TetrisMatrix = Matrix<TetrisCell>

export type TetrisRow = Row<TetrisCell>

export interface BoundingRect {
  top: number
  right: number
  bottom: number
  left: number
}

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

  getBoundingRect(): BoundingRect {
    const positions = this.getPositions()
    const initialBoundingRect: BoundingRect = {
      top: positions[0].y,
      right: positions[0].x,
      bottom: positions[0].y,
      left: positions[0].x,
    }
    return positions.reduce((acc, { x, y }) => {
      const { top, right, bottom, left } = acc
      if (x < left) {
        acc.left = x
      }
      if (x > right) {
        acc.right = x
      }
      if (y < top) {
        acc.top = y
      }
      if (y > bottom) {
        acc.bottom = y
      }
      return acc
    }, initialBoundingRect)
  }

  static createIShape(color: string[] = colorGradients.GREEN) {
    const x = { color }
    return new IShape([
      [_, _, x, _], //
      [_, _, x, _],
      [_, _, x, _],
      [_, _, x, _],
    ])
  }

  static createJShape(color: string[] = colorGradients.WHITE) {
    const x = { color }
    return new Shape([
      [_, x, _], //
      [_, x, _],
      [x, x, _],
    ])
  }

  static createLShape(color: string[] = colorGradients.BLUE) {
    const x = { color }
    return new Shape([
      [_, x, _], //
      [_, x, _],
      [_, x, x],
    ])
  }

  static createOShape(color: string[] = colorGradients.ORANGE) {
    const x = { color }
    return new Shape([
      [x, x], //
      [x, x],
    ])
  }

  static createSShape(color: string[] = colorGradients.LIGHT_BLUE) {
    const x = { color }
    return new Shape([
      [_, x, x], //
      [x, x, _],
      [_, _, _],
    ])
  }

  static createTShape(color: string[] = colorGradients.RED) {
    const x = { color }
    return new Shape([
      [_, x, _], //
      [x, x, x],
      [_, _, _],
    ])
  }

  static createZShape(color: string[] = colorGradients.PURPLE) {
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

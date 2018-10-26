import { transpose } from "ramda"
import { Matrix } from "./matrix"

const _ = undefined

export class Shape {
  protected constructor(protected matrix: Matrix) {}

  draw() {
    return this.matrix
  }

  rotate() {
    this.matrix = Shape.reverseColumns(transpose(this.matrix))
  }

  private static reverseColumns(matrix: Matrix): Matrix {
    return matrix.map(row => row.reverse())
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